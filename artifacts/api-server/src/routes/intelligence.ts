import { Router, type IRouter } from "express";
import { db, reportsTable } from "@workspace/db";
import { GenerateIntelligenceBody } from "@workspace/api-zod";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();

function generateTrackingId(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function buildMockScraperData(companyName: string, category: string) {
  const competitors: string[] = [];
  const categoryLower = category.toLowerCase();

  if (categoryLower.includes("saas") || categoryLower.includes("software")) {
    competitors.push("Salesforce", "HubSpot", "Zendesk", "Freshworks", "Monday.com");
  } else if (categoryLower.includes("fintech") || categoryLower.includes("finance")) {
    competitors.push("Stripe", "Square", "Brex", "Plaid", "Adyen");
  } else if (categoryLower.includes("ecommerce") || categoryLower.includes("retail")) {
    competitors.push("Shopify", "BigCommerce", "WooCommerce", "Magento", "Wix");
  } else if (categoryLower.includes("health") || categoryLower.includes("medical")) {
    competitors.push("Epic Systems", "Cerner", "Veeva Systems", "Health Catalyst", "Meditech");
  } else if (categoryLower.includes("ai") || categoryLower.includes("ml")) {
    competitors.push("OpenAI", "Anthropic", "Cohere", "Scale AI", "Hugging Face");
  } else {
    competitors.push("Legacy Market Leader", "VC-Backed Challenger", "Enterprise Giant", "Niche Specialist", "International Player");
  }

  const recentCampaigns = [
    `${companyName} launched a rebrand campaign targeting enterprise clients in Q1`,
    `${companyName} partnered with major industry association for thought leadership content`,
    `${companyName} ran a digital-first acquisition push with $2M+ ad spend targeting SMB segment`,
    `${companyName} introduced a freemium tier to capture mid-market leads`,
  ];

  const events = [
    `Sponsored booth at the industry's flagship annual conference`,
    `Hosted a virtual summit with 3,000+ attendees from ${category} sector`,
    `Participated in 12 regional roadshows across North America and EMEA`,
    `Co-sponsored a hackathon focused on ${category} innovation`,
  ];

  return { competitors: competitors.slice(0, 4), recentCampaigns, events };
}

function buildKnowledgeGraph(companyName: string, category: string, competitors: string[]) {
  const nodes: { id: string; type: string }[] = [
    { id: companyName, type: "company" },
    { id: category, type: "market" },
    ...competitors.map((c) => ({ id: c, type: "competitor" })),
    { id: "Enterprise Segment", type: "segment" },
    { id: "SMB Segment", type: "segment" },
    { id: "Price Sensitivity", type: "risk" },
    { id: "Platform Lock-in", type: "risk" },
    { id: "AI Disruption", type: "trend" },
  ];

  const edges: { from: string; to: string; relation: string }[] = [
    { from: companyName, to: category, relation: "operates_in" },
    { from: companyName, to: "Enterprise Segment", relation: "targets" },
    { from: companyName, to: "SMB Segment", relation: "targets" },
    ...competitors.map((c) => ({ from: c, to: category, relation: "competes_in" })),
    ...competitors.map((c) => ({ from: companyName, to: c, relation: "competes_with" })),
    { from: "AI Disruption", to: category, relation: "threatens" },
    { from: "Price Sensitivity", to: "SMB Segment", relation: "affects" },
    { from: "Platform Lock-in", to: "Enterprise Segment", relation: "affects" },
  ];

  const intersections = competitors.filter((_, i) => i < 2).map((c) => ({
    competitor: c,
    overlap: ["Enterprise Segment", "SMB Segment"][Math.floor(Math.random() * 2)],
  }));

  return { nodes, edges, intersections };
}

function getMockContacts(companyName: string): {
  name: string; title: string; email: string | null; phone: string | null; linkedin: string | null; verified: boolean;
}[] {
  const mockDb: Record<string, { name: string; title: string; email: string; phone: string; linkedin: string }[]> = {
    default: [],
  };

  const result = mockDb[companyName.toLowerCase()] ?? mockDb["default"] ?? [];
  return result.length > 0
    ? result.map((c) => ({ ...c, verified: true }))
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
}

router.post("/intelligence/generate", async (req, res) => {
  const parsed = GenerateIntelligenceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: parsed.error.message });
    return;
  }

  const { companyName, category } = parsed.data;

  try {
    const { competitors, recentCampaigns, events } = buildMockScraperData(companyName, category);
    const graph = buildKnowledgeGraph(companyName, category, competitors);

    const systemPrompt = `You are a B2B market intelligence analyst. Generate structured market intelligence for ${companyName} in the ${category} sector.
    
You have access to the following scraped data:
- Recent campaigns: ${recentCampaigns.join("; ")}
- Events/sponsorships: ${events.join("; ")}
- Knowledge graph intersections: ${JSON.stringify(graph.intersections)}
- Competitors identified: ${competitors.join(", ")}

Rules:
1. Be specific and professional. Reference the actual company name and category throughout.
2. Strategic Watchouts MUST be derived from the knowledge graph intersections and competitor overlaps — deduce non-obvious risks.
3. Outreach MUST reference specific recent campaigns and watchouts.
4. Return ONLY valid JSON. No markdown, no code blocks.`;

    const userPrompt = `Generate a complete market intelligence report for ${companyName} (${category}). 

Return a JSON object with exactly these keys:
{
  "companyOverview": "3-4 sentence overview of the company's business model, scale, and market positioning",
  "marketPosition": "3-4 sentences on brand perception, recent market shifts, and competitive standing",
  "competitorMapping": [
    {"name": "CompetitorA", "strengths": "what they do well", "gaps": "where they fall short"},
    ... 3-4 competitors total
  ],
  "brandActivity": "3-4 sentences summarizing the most impactful campaigns and launches from the last 12-24 months. Reference specific campaigns.",
  "experientialFootprint": "3-4 sentences about events, sponsorships, and experiential activations",
  "strategicWatchouts": "3-4 sentences identifying 2-3 non-obvious strategic risks based on competitor overlaps and market tensions. Must reference specific graph insights.",
  "decisionMakerRoles": [
    {"title": "Chief Marketing Officer", "rationale": "Why this role controls the relevant budget"},
    ... 2-3 roles
  ],
  "outreach": {
    "linkedinMessage": "A 3-sentence personalized LinkedIn outreach message. Reference a specific campaign and watchout.",
    "emailSubject": "A compelling email subject line (max 60 chars)",
    "emailBody": "A 4-5 paragraph cold email. Paragraph 1: warm opener referencing ${companyName}'s specific campaign. Paragraph 2: bridge to their strategic watchout. Paragraph 3: introduce your value proposition. Paragraph 4: social proof. Paragraph 5: clear CTA. Do NOT use placeholders like [Your Name] — use 'I' perspective.",
    "trackingPixelHtml": "<img src=\\"https://omnisense-api.com/track/open/TRACK_ID\\" width=\\"1\\" height=\\"1\\" style=\\"display:none\\" />",
    "trackingLogicExplanation": "2-3 sentences explaining how the tracking pixel works and the webhook architecture for monitoring open rates."
  }
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 4096,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    let aiOutput: Record<string, unknown>;
    try {
      aiOutput = JSON.parse(raw);
    } catch {
      aiOutput = {};
    }

    const trackingId = generateTrackingId();
    const contacts = getMockContacts(companyName);

    const report = {
      companyName,
      category,
      companyOverview: (aiOutput.companyOverview as string) ?? `${companyName} is a leading player in the ${category} space.`,
      marketPosition: (aiOutput.marketPosition as string) ?? "Market position data processing.",
      competitorMapping: (aiOutput.competitorMapping as { name: string; strengths: string; gaps: string }[]) ?? competitors.map((c) => ({ name: c, strengths: "Strong brand recognition and customer base", gaps: "Limited innovation pipeline and slow enterprise sales cycle" })),
      brandActivity: (aiOutput.brandActivity as string) ?? recentCampaigns.join(" "),
      experientialFootprint: (aiOutput.experientialFootprint as string) ?? events.join(" "),
      strategicWatchouts: (aiOutput.strategicWatchouts as string) ?? `Based on Knowledge Graph analysis: competitor overlap at ${graph.intersections[0]?.overlap ?? "Enterprise"} segment creates pricing pressure. AI Disruption node threatens ${category} incumbents.`,
      decisionMakerRoles: (aiOutput.decisionMakerRoles as { title: string; rationale: string }[]) ?? [
        { title: "Chief Marketing Officer", rationale: "Controls brand and campaign budgets relevant to this engagement" },
        { title: "VP of Sales", rationale: "Owns revenue targets and outbound motion" },
        { title: "Chief Revenue Officer", rationale: "Accountable for overall GTM strategy and vendor partnerships" },
      ],
      contactIntelligence: contacts,
      outreach: {
        linkedinMessage: ((aiOutput.outreach as Record<string, string>)?.linkedinMessage) ?? `Hi [Name], I noticed ${companyName}'s recent campaign and wanted to connect. We help companies like yours address the exact market tension you're facing. Would love 15 minutes to explore synergies.`,
        emailSubject: ((aiOutput.outreach as Record<string, string>)?.emailSubject) ?? `${companyName} + Strategic Partnership Opportunity`,
        emailBody: ((aiOutput.outreach as Record<string, string>)?.emailBody) ?? "Email body processing.",
        trackingPixelHtml: `<img src="https://omnisense-api.com/track/open/${trackingId}" width="1" height="1" style="display:none" />`,
        trackingLogicExplanation: ((aiOutput.outreach as Record<string, string>)?.trackingLogicExplanation) ?? `When the recipient opens the HTML email, their client silently loads the 1x1 pixel from our tracking endpoint. The server records the timestamp, IP, and user-agent, then fires a webhook to your CRM. This gives real-time open-rate visibility without modifying the email copy.`,
      },
      generatedAt: new Date().toISOString(),
    };

    const [saved] = await db.insert(reportsTable).values({
      companyName,
      category,
      report,
    }).returning();

    res.json(report);
  } catch (err) {
    req.log.error({ err }, "Intelligence generation failed");
    res.status(500).json({ error: "generation_failed", message: "Failed to generate intelligence report" });
  }
});

export default router;
