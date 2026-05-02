import { Router, type IRouter } from "express";
import { db, reportsTable } from "@workspace/db";
import { GenerateIntelligenceBody } from "@workspace/api-zod";
import OpenAI from "openai";
import { search, SafeSearchType } from "duck-duck-scrape";

const router: IRouter = Router();

const nvidiaClient = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_API_KEY ?? "",
});

function generateTrackingId(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

async function searchWeb(query: string): Promise<string> {
  try {
    const results = await search(query, { safeSearch: SafeSearchType.OFF });
    if (!results?.results?.length) return "(no results found)";
    return results.results
      .slice(0, 6)
      .map((r) => `- ${r.title}: ${r.description ?? ""}`)
      .join("\n");
  } catch {
    return "(search unavailable)";
  }
}

router.post("/intelligence/generate", async (req, res) => {
  const parsed = GenerateIntelligenceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: parsed.error.message });
    return;
  }

  const { companyName, category } = parsed.data;

  try {
    req.log.info({ companyName, category }, "Starting web research phase");

    const [overviewResults, competitorResults, campaignResults, eventResults, leadershipResults] =
      await Promise.all([
        searchWeb(`${companyName} ${category} company overview business model 2024`),
        searchWeb(`${companyName} competitors market rivals ${category}`),
        searchWeb(`${companyName} marketing campaign brand launch 2024 2025`),
        searchWeb(`${companyName} events conference sponsorship 2024 2025`),
        searchWeb(`${companyName} CEO CMO CRO VP leadership executives`),
      ]);

    const webContext = `=== COMPANY OVERVIEW ===
${overviewResults}

=== COMPETITORS & MARKET RIVALS ===
${competitorResults}

=== BRAND CAMPAIGNS & LAUNCHES ===
${campaignResults}

=== EVENTS & SPONSORSHIPS ===
${eventResults}

=== LEADERSHIP & EXECUTIVES ===
${leadershipResults}`;

    req.log.info({ companyName }, "Web research complete, calling NVIDIA minimax-m2.7");

    const systemPrompt = `You are an elite B2B market intelligence analyst. You have just completed a live web research session on ${companyName} operating in the ${category} sector. Your job is to synthesize the real search data below into a precise, professional intelligence report used by enterprise sales teams.

LIVE WEB RESEARCH DATA:
${webContext}

CRITICAL RULES:
1. Reference specific, real facts from the search results — actual product names, real campaigns, real executive names, actual company details.
2. Do NOT fabricate statistics, revenue figures, or specific contact details not found in the data.
3. Strategic Watchouts must identify non-obvious, cross-domain risks that a less informed analyst would miss.
4. Contact Intelligence: ONLY include executives actually found in the leadership search results with confirmed details. If none found, return the zero-hallucination placeholder object.
5. Outreach copy must reference ${companyName}'s specific real campaigns and their actual competitive dynamics.
6. Return ONLY valid JSON. No markdown fences, no code blocks, no commentary before or after.`;

    const userPrompt = `Generate a complete, deeply researched market intelligence report for ${companyName} (${category}).

Return ONLY a valid JSON object with exactly these keys:
{
  "companyOverview": "3-4 sentences grounded in real search data — their business model, key products/services, scale, and strategic positioning",
  "marketPosition": "3-4 sentences on their brand perception, competitive standing, recent market shifts, and momentum signals",
  "competitorMapping": [
    {"name": "ActualCompetitorName", "strengths": "specific real strengths", "gaps": "specific real weaknesses"},
    (3-4 real competitors from search results)
  ],
  "brandActivity": "3-4 sentences referencing specific real campaigns, product launches, or partnerships from the last 12-24 months found in search results",
  "experientialFootprint": "3-4 sentences about real events, conferences, sponsorships, or experiential activations found in search results",
  "strategicWatchouts": "3-4 sentences identifying 2-3 non-obvious strategic risks derived from the competitive landscape and market dynamics — cross-domain reasoning required",
  "decisionMakerRoles": [
    {"title": "Exact Job Title", "rationale": "specific reason this role controls the relevant budget or decision"},
    (2-3 roles)
  ],
  "contactIntelligence": [
    IF real executives were found in search: {"name": "Real Name", "title": "Real Title", "email": null, "phone": null, "linkedin": "URL if found or null", "verified": true}
    IF no real contacts found: {"name": "Verified Data Unavailable - Manual Extraction Required", "title": "Verified Data Unavailable - Manual Extraction Required", "email": null, "phone": null, "linkedin": null, "verified": false}
  ],
  "outreach": {
    "linkedinMessage": "3-sentence personalized LinkedIn outreach referencing a specific ${companyName} campaign or product and a strategic watchout",
    "emailSubject": "Compelling subject line under 60 characters",
    "emailBody": "4-5 paragraph cold email in first-person: paragraph 1 = warm opener referencing specific ${companyName} activity; paragraph 2 = bridge to their strategic risk; paragraph 3 = value proposition; paragraph 4 = social proof or insight; paragraph 5 = clear CTA. No placeholders like [Your Name].",
    "trackingPixelHtml": "<img src=\\"https://omnisense.app/track/open/PLACEHOLDER\\" width=\\"1\\" height=\\"1\\" style=\\"display:none\\" />",
    "trackingLogicExplanation": "2-3 sentences on the tracking pixel webhook architecture and how open-rate data is captured and routed to the CRM."
  }
}`;

    const stream = await nvidiaClient.chat.completions.create({
      model: "minimaxai/minimax-m2.7",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 4096,
      stream: true,
    });

    let raw = "";
    for await (const chunk of stream) {
      if (!chunk.choices?.length) continue;
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) raw += delta;
    }

    req.log.info({ companyName, rawLength: raw.length }, "AI response received");

    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : raw;

    let aiOutput: Record<string, unknown>;
    try {
      aiOutput = JSON.parse(jsonStr.trim());
    } catch {
      req.log.warn({ raw: raw.slice(0, 500) }, "Failed to parse AI JSON, using fallback");
      aiOutput = {};
    }

    const trackingId = generateTrackingId();

    const aiContacts = aiOutput.contactIntelligence as {
      name: string; title: string; email: string | null; phone: string | null; linkedin: string | null; verified: boolean;
    }[] | undefined;

    const contactIntelligence =
      Array.isArray(aiContacts) && aiContacts.length > 0
        ? aiContacts
        : [
            {
              name: "Verified Data Unavailable - Manual Extraction Required",
              title: "Verified Data Unavailable - Manual Extraction Required",
              email: null,
              phone: null,
              linkedin: null,
              verified: false,
            },
          ];

    const outreach = aiOutput.outreach as Record<string, string> | undefined;

    const report = {
      companyName,
      category,
      companyOverview:
        (aiOutput.companyOverview as string) ??
        `${companyName} is a company operating in the ${category} market.`,
      marketPosition:
        (aiOutput.marketPosition as string) ?? "Market position analysis unavailable.",
      competitorMapping:
        (aiOutput.competitorMapping as { name: string; strengths: string; gaps: string }[]) ?? [],
      brandActivity: (aiOutput.brandActivity as string) ?? "Brand activity data unavailable.",
      experientialFootprint:
        (aiOutput.experientialFootprint as string) ?? "Experiential footprint data unavailable.",
      strategicWatchouts:
        (aiOutput.strategicWatchouts as string) ?? "Strategic watchouts analysis unavailable.",
      decisionMakerRoles:
        (aiOutput.decisionMakerRoles as { title: string; rationale: string }[]) ?? [],
      contactIntelligence,
      outreach: {
        linkedinMessage: outreach?.linkedinMessage ?? "",
        emailSubject: outreach?.emailSubject ?? `${companyName} — Strategic Intelligence`,
        emailBody: outreach?.emailBody ?? "",
        trackingPixelHtml: `<img src="https://omnisense.app/track/open/${trackingId}" width="1" height="1" style="display:none" />`,
        trackingLogicExplanation:
          outreach?.trackingLogicExplanation ??
          "When the recipient opens the HTML email, their client silently loads the 1x1 pixel from the tracking endpoint. The server logs the timestamp, IP address, and user-agent, then fires a webhook to your CRM for real-time open-rate visibility.",
      },
      generatedAt: new Date().toISOString(),
    };

    const [saved] = await db.insert(reportsTable).values({ companyName, category, report }).returning();

    res.json({ ...report, id: saved!.id });
  } catch (err) {
    req.log.error({ err }, "Intelligence generation failed");
    res.status(500).json({
      error: "generation_failed",
      message: "Failed to generate intelligence report",
    });
  }
});

export default router;
