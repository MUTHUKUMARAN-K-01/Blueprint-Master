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

/** Robustly extract the first complete JSON object from a string that may
 *  contain leading/trailing prose or markdown fences. */
function extractJsonObject(raw: string): string {
  // 1. Try markdown fence first
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();

  // 2. Slice from first { to last }
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start !== -1 && end > start) return raw.slice(start, end + 1);

  return raw.trim();
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

    const systemPrompt = `You are an elite B2B market intelligence analyst. You MUST respond with ONLY a raw JSON object. Your response must begin with { and end with }. No preamble, no explanation, no markdown fences, no trailing text of any kind.

You have completed a live web research session on "${companyName}" in the "${category}" sector. Use the real search data below to produce a precise, professional intelligence report.

LIVE WEB RESEARCH DATA:
${webContext}

RULES:
- Your entire response = one valid JSON object, nothing else.
- Use specific real facts from the search data (product names, campaigns, executives, events).
- Do not fabricate revenue figures or contact details not found in the data.
- Strategic Watchouts must surface non-obvious, cross-domain risks.
- Contact Intelligence: only include executives actually found in search results.`;

    const userPrompt = `Produce the JSON intelligence report for ${companyName} (${category}).

RESPOND WITH ONLY THIS JSON (replace all placeholder values with real researched data):

{
  "companyOverview": "3-4 sentences: business model, key products/services, scale, strategic positioning — grounded in real search data",
  "marketPosition": "3-4 sentences: brand perception, competitive standing, recent market shifts, momentum signals",
  "competitorMapping": [
    { "name": "Competitor1Name", "strengths": "specific real strengths from search", "gaps": "specific real weaknesses" },
    { "name": "Competitor2Name", "strengths": "specific real strengths", "gaps": "specific real weaknesses" },
    { "name": "Competitor3Name", "strengths": "specific real strengths", "gaps": "specific real weaknesses" }
  ],
  "brandActivity": "3-4 sentences: specific real campaigns, product launches, or partnerships from last 12-24 months",
  "experientialFootprint": "3-4 sentences: real events, conferences, sponsorships, or activations from search results",
  "strategicWatchouts": "3-4 sentences: 2-3 non-obvious strategic risks from competitive landscape and market dynamics",
  "decisionMakerRoles": [
    { "title": "Chief Revenue Officer", "rationale": "controls GTM budget and owns revenue targets" },
    { "title": "VP of Sales", "rationale": "manages enterprise deals and vendor relationships" },
    { "title": "Chief Marketing Officer", "rationale": "owns brand, campaign, and outreach budget" }
  ],
  "contactIntelligence": [
    { "name": "Real Executive Name from search or 'Verified Data Unavailable - Manual Extraction Required'", "title": "Real Title", "email": null, "phone": null, "linkedin": null, "verified": false }
  ],
  "outreach": {
    "linkedinMessage": "3-sentence personalized LinkedIn InMail referencing a specific ${companyName} initiative and a strategic risk",
    "emailSubject": "Compelling cold email subject line under 60 characters",
    "emailBody": "5-paragraph cold email — P1: warm opener referencing specific ${companyName} activity; P2: bridge to their strategic risk; P3: value proposition; P4: social proof or data point; P5: clear low-friction CTA. Write in first person. No placeholders.",
    "trackingPixelHtml": "<img src=\\"https://omnisense.app/track/open/PLACEHOLDER\\" width=\\"1\\" height=\\"1\\" style=\\"display:none\\" />",
    "trackingLogicExplanation": "When the recipient opens the HTML email, the client silently loads the 1×1 pixel from the Omnisense tracking endpoint. The server logs the open timestamp, IP address, and user-agent, then fires a webhook to the CRM for real-time pipeline visibility."
  }
}`;

    const stream = await nvidiaClient.chat.completions.create({
      model: "minimaxai/minimax-m2.7",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.6,
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

    let aiOutput: Record<string, unknown>;
    try {
      const jsonStr = extractJsonObject(raw);
      aiOutput = JSON.parse(jsonStr);
      req.log.info({ companyName, fields: Object.keys(aiOutput).length }, "AI JSON parsed successfully");
    } catch (parseErr) {
      req.log.warn({ companyName, rawPreview: raw.slice(0, 500), parseErr }, "Failed to parse AI JSON, using fallback");
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
          "When the recipient opens the HTML email, their client silently loads the 1×1 pixel from the tracking endpoint. The server logs the timestamp, IP address, and user-agent, then fires a webhook to your CRM for real-time open-rate visibility.",
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
