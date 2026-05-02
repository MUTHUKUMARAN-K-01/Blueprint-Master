import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

/* ── Palette ─────────────────────────────────────────────────────── */
const C = {
  bg:      "#0b0b1a",
  bg2:     "#131328",
  bg3:     "#1a1a38",
  border:  "#252548",
  white:   "#ffffff",
  muted:   "#7878a0",
  dim:     "#4a4a70",
  purple:  "#9d71fb",
  cyan:    "#22d3ee",
  pink:    "#f472b6",
  amber:   "#fbbf24",
  green:   "#34d399",
  red:     "#f87171",
  indigo:  "#818cf8",
  orange:  "#fb923c",
};

/* ── Styles ──────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  page: { backgroundColor: C.bg, fontFamily: "Helvetica", paddingTop: 0, paddingBottom: 40 },

  /* Cover */
  cover: { backgroundColor: C.bg, minHeight: "100%", position: "relative" },
  coverTopBar: { height: 6, backgroundColor: C.purple },
  coverBody: { padding: "50 50 40 50", flex: 1 },
  coverEyebrow: { fontSize: 9, letterSpacing: 3, color: C.muted, marginBottom: 24, fontFamily: "Helvetica-Bold" },
  coverCompany: { fontSize: 54, color: C.white, fontFamily: "Helvetica-Bold", lineHeight: 1.05, marginBottom: 20 },
  coverCatRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 60 },
  coverCatBadge: { backgroundColor: C.bg3, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: C.purple },
  coverCatText: { fontSize: 11, color: C.purple, fontFamily: "Helvetica-Bold", letterSpacing: 1 },
  coverDateText: { fontSize: 11, color: C.muted },

  /* Cover stats row */
  coverStats: { flexDirection: "row", gap: 0, marginBottom: 60 },
  coverStat: { flex: 1, borderTopWidth: 1, borderTopColor: C.border, paddingTop: 16, paddingRight: 20 },
  coverStatNum: { fontSize: 28, fontFamily: "Helvetica-Bold", color: C.white, marginBottom: 4 },
  coverStatLabel: { fontSize: 9, color: C.muted, letterSpacing: 1, fontFamily: "Helvetica" },

  /* Cover sections list */
  coverSections: { marginBottom: 50 },
  coverSectionRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  coverSectionNum: { fontSize: 9, color: C.dim, width: 28, fontFamily: "Helvetica-Bold", letterSpacing: 1 },
  coverSectionDot: { width: 6, height: 6, borderRadius: 3, marginRight: 10 },
  coverSectionName: { fontSize: 12, color: C.white, fontFamily: "Helvetica", flex: 1 },

  /* Cover footer */
  coverFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", paddingHorizontal: 50, paddingBottom: 40 },
  coverFooterBrand: { fontSize: 16, fontFamily: "Helvetica-Bold", color: C.purple, letterSpacing: 2 },
  coverFooterSub: { fontSize: 9, color: C.muted, marginTop: 3 },
  coverBottomBar: { height: 3, backgroundColor: C.bg3 },
  coverBottomBarInner: { height: 3, width: "60%", backgroundColor: C.purple },

  /* Page header */
  pageHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 40, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 30 },
  pageHeaderBrand: { fontSize: 10, fontFamily: "Helvetica-Bold", color: C.purple, letterSpacing: 2 },
  pageHeaderCompany: { fontSize: 10, color: C.muted },

  /* Page footer */
  pageFooter: { position: "absolute", bottom: 20, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: C.border, paddingTop: 10 },
  pageFooterText: { fontSize: 8, color: C.dim },

  /* Section */
  sectionWrap: { marginHorizontal: 40, marginBottom: 24 },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  sectionDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  sectionEyebrow: { fontSize: 8, letterSpacing: 3, fontFamily: "Helvetica-Bold" },
  sectionTitle: { fontSize: 18, fontFamily: "Helvetica-Bold", color: C.white, marginBottom: 12 },
  sectionBox: { backgroundColor: C.bg2, borderRadius: 8, padding: 20, borderLeftWidth: 3 },
  sectionBody: { fontSize: 11, color: "#c0c0e0", lineHeight: 1.7, fontFamily: "Helvetica" },

  /* Divider */
  divider: { marginHorizontal: 40, marginVertical: 20, height: 1, backgroundColor: C.border },

  /* Competitor cards */
  compGrid: { flexDirection: "row", gap: 10, marginHorizontal: 40 },
  compCard: { flex: 1, backgroundColor: C.bg2, borderRadius: 8, padding: 16, borderTopWidth: 2 },
  compName: { fontSize: 13, fontFamily: "Helvetica-Bold", color: C.white, marginBottom: 12 },
  compLabel: { fontSize: 8, letterSpacing: 2, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  compText: { fontSize: 10, color: "#b0b0d0", lineHeight: 1.6 },
  compDivider: { height: 1, backgroundColor: C.border, marginVertical: 10 },

  /* Tag row */
  tagRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  tag: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1 },
  tagText: { fontSize: 8, fontFamily: "Helvetica-Bold", letterSpacing: 1 },

  /* Decision maker rows */
  dmRow: { flexDirection: "row", alignItems: "flex-start", marginHorizontal: 40, marginBottom: 12 },
  dmNum: { width: 30, height: 30, borderRadius: 8, backgroundColor: C.bg3, borderWidth: 1, borderColor: C.green, alignItems: "center", justifyContent: "center", marginRight: 14, flexShrink: 0 },
  dmNumText: { fontSize: 12, fontFamily: "Helvetica-Bold", color: C.green },
  dmContent: { flex: 1, backgroundColor: C.bg2, borderRadius: 8, padding: 14, borderLeftWidth: 2, borderLeftColor: C.green },
  dmTitle: { fontSize: 12, fontFamily: "Helvetica-Bold", color: C.white, marginBottom: 4 },
  dmRationale: { fontSize: 10, color: C.muted, lineHeight: 1.6 },

  /* Contact rows */
  contactRow: { marginHorizontal: 40, marginBottom: 10, backgroundColor: C.bg2, borderRadius: 8, padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  contactLeft: { flex: 1 },
  contactName: { fontSize: 12, fontFamily: "Helvetica-Bold", color: C.white, marginBottom: 3 },
  contactTitle: { fontSize: 10, color: C.muted, marginBottom: 6 },
  contactMeta: { fontSize: 9, color: "#9090c0", marginBottom: 2 },
  verifiedBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: C.green, backgroundColor: "#0a2a1a", alignSelf: "flex-start" },
  verifiedText: { fontSize: 8, color: C.green, fontFamily: "Helvetica-Bold" },
  protectedBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: C.border, backgroundColor: C.bg3, alignSelf: "flex-start" },
  protectedText: { fontSize: 8, color: C.muted, fontFamily: "Helvetica-Bold" },

  /* Outreach */
  outreachBox: { marginHorizontal: 40, marginBottom: 20, backgroundColor: C.bg2, borderRadius: 8, padding: 20, borderLeftWidth: 3 },
  outreachLabel: { fontSize: 8, letterSpacing: 3, fontFamily: "Helvetica-Bold", marginBottom: 8 },
  outreachSubject: { fontSize: 13, fontFamily: "Helvetica-Bold", color: C.white, marginBottom: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  outreachBody: { fontSize: 11, color: "#c0c0e0", lineHeight: 1.75 },

  /* Code block */
  codeBox: { marginHorizontal: 40, backgroundColor: "#050510", borderRadius: 8, padding: 16, borderWidth: 1, borderColor: C.border, marginBottom: 16 },
  codeText: { fontSize: 9, color: "#67e8f9", fontFamily: "Courier", lineHeight: 1.5 },

  /* Watchouts */
  watchBox: { marginHorizontal: 40, backgroundColor: "#1a0808", borderRadius: 8, padding: 20, borderLeftWidth: 3, borderLeftColor: C.red, marginBottom: 16 },
  watchHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  watchLabel: { fontSize: 8, letterSpacing: 3, color: C.red, fontFamily: "Helvetica-Bold" },
  watchBadge: { backgroundColor: "#2a0808", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: "#6b0000" },
  watchBadgeText: { fontSize: 7, color: C.red, fontFamily: "Helvetica-Bold", letterSpacing: 1 },
  watchBody: { fontSize: 11, color: "#e0b0b0", lineHeight: 1.7 },

  /* Sectionbreak  */
  pageBreak: { marginBottom: 30 },
});

/* ── Types ───────────────────────────────────────────────────────── */
interface ReportData {
  companyName: string;
  category: string;
  generatedAt: string;
  companyOverview: string;
  marketPosition: string;
  competitorMapping: { name: string; strengths: string; gaps: string }[];
  brandActivity: string;
  experientialFootprint: string;
  strategicWatchouts: string;
  decisionMakerRoles: { title: string; rationale: string }[];
  contactIntelligence: { name: string; title: string; email: string | null; phone: string | null; linkedin: string | null; verified: boolean }[];
  outreach: {
    linkedinMessage: string;
    emailSubject: string;
    emailBody: string;
    trackingPixelHtml: string;
    trackingLogicExplanation: string;
  };
}

/* ── Helpers ─────────────────────────────────────────────────────── */
const SECTION_LIST = [
  { num: "01", name: "Company Overview",        color: C.purple },
  { num: "02", name: "Market Position",         color: C.cyan   },
  { num: "03", name: "Competitor Intelligence", color: C.pink   },
  { num: "04", name: "Brand Activity",          color: C.amber  },
  { num: "05", name: "Experiential Footprint",  color: C.green  },
  { num: "06", name: "Strategic Watchouts",     color: C.red    },
  { num: "07", name: "Decision Maker Roles",    color: C.green  },
  { num: "08", name: "Contact Intelligence",    color: C.indigo },
  { num: "09", name: "Personalized Outreach",   color: C.orange },
  { num: "10", name: "Tracking Pixel Logic",    color: C.cyan   },
];

function PageHeader({ company }: { company: string }) {
  return (
    <View style={s.pageHeader} fixed>
      <Text style={s.pageHeaderBrand}>OMNISENSE</Text>
      <Text style={s.pageHeaderCompany}>{company} · Intelligence Report</Text>
    </View>
  );
}

function PageFooter({ company }: { company: string }) {
  return (
    <View style={s.pageFooter} fixed>
      <Text style={s.pageFooterText}>Omnisense Intelligence Engine · Powered by NVIDIA minimax-m2.7 · GraphRAG™</Text>
      <Text style={s.pageFooterText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
    </View>
  );
}

function SectionLabel({ label, color }: { label: string; color: string }) {
  return (
    <View style={s.sectionHeader}>
      <View style={[s.sectionDot, { backgroundColor: color }]} />
      <Text style={[s.sectionEyebrow, { color }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

/* ── Document ────────────────────────────────────────────────────── */
export function ReportPDF({ report }: { report: ReportData }) {
  const dateStr = new Date(report.generatedAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  const safe = (v: string | null | undefined, fallback = "—") => v?.trim() || fallback;

  return (
    <Document
      title={`${report.companyName} · Intelligence Report · Omnisense`}
      author="Omnisense Intelligence Engine"
      subject={`B2B Market Intelligence: ${report.companyName}`}
      keywords="b2b, intelligence, market analysis, omnisense"
      creator="Omnisense"
    >
      {/* ════════════ PAGE 1 — COVER ════════════ */}
      <Page size="A4" style={s.page}>
        <View style={s.coverTopBar} />
        <View style={[s.coverBody, { flex: 1 }]}>

          <Text style={s.coverEyebrow}>B2B MARKET INTELLIGENCE REPORT</Text>
          <Text style={s.coverCompany}>{safe(report.companyName)}</Text>

          <View style={s.coverCatRow}>
            <View style={s.coverCatBadge}>
              <Text style={s.coverCatText}>{safe(report.category)}</Text>
            </View>
            <Text style={s.coverDateText}>Generated {dateStr}</Text>
          </View>

          {/* Stats */}
          <View style={s.coverStats}>
            {[
              { num: "10",     label: "INTELLIGENCE OUTPUTS"  },
              { num: `${report.competitorMapping?.length ?? 0}`, label: "COMPETITORS MAPPED" },
              { num: `${report.decisionMakerRoles?.length ?? 0}`, label: "DECISION MAKER ROLES" },
              { num: "AI",     label: "NVIDIA SYNTHESIS"       },
            ].map((stat, i) => (
              <View key={i} style={s.coverStat}>
                <Text style={[s.coverStatNum, { color: [C.purple, C.cyan, C.green, C.amber][i] }]}>{stat.num}</Text>
                <Text style={s.coverStatLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Section TOC */}
          <View style={s.coverSections}>
            {SECTION_LIST.map((sec) => (
              <View key={sec.num} style={s.coverSectionRow}>
                <Text style={s.coverSectionNum}>{sec.num}</Text>
                <View style={[s.coverSectionDot, { backgroundColor: sec.color }]} />
                <Text style={s.coverSectionName}>{sec.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={s.coverFooter}>
          <View>
            <Text style={s.coverFooterBrand}>OMNISENSE</Text>
            <Text style={s.coverFooterSub}>Intelligence Engine · NVIDIA minimax-m2.7 · GraphRAG™</Text>
          </View>
          <Text style={[s.coverDateText, { textAlign: "right" }]}>CONFIDENTIAL{"\n"}For authorized use only</Text>
        </View>
        <View style={s.coverBottomBar}>
          <View style={s.coverBottomBarInner} />
        </View>
      </Page>

      {/* ════════════ PAGE 2 — OVERVIEW & POSITION ════════════ */}
      <Page size="A4" style={s.page}>
        <PageHeader company={report.companyName} />

        {/* 01 Company Overview */}
        <View style={s.sectionWrap}>
          <SectionLabel label="01 · Company Overview" color={C.purple} />
          <Text style={s.sectionTitle}>Company Overview</Text>
          <View style={[s.sectionBox, { borderLeftColor: C.purple }]}>
            <Text style={s.sectionBody}>{safe(report.companyOverview)}</Text>
          </View>
        </View>

        <View style={s.divider} />

        {/* 02 Market Position */}
        <View style={s.sectionWrap}>
          <SectionLabel label="02 · Market Position" color={C.cyan} />
          <Text style={s.sectionTitle}>Market Position</Text>
          <View style={[s.sectionBox, { borderLeftColor: C.cyan }]}>
            <Text style={s.sectionBody}>{safe(report.marketPosition)}</Text>
          </View>
        </View>

        <PageFooter company={report.companyName} />
      </Page>

      {/* ════════════ PAGE 3 — COMPETITORS ════════════ */}
      <Page size="A4" style={s.page}>
        <PageHeader company={report.companyName} />

        <View style={[s.sectionWrap, { marginBottom: 20 }]}>
          <SectionLabel label="03 · Competitive Intelligence" color={C.pink} />
          <Text style={s.sectionTitle}>Competitor Mapping</Text>
        </View>

        {(report.competitorMapping?.length > 0) ? (
          <View style={s.compGrid}>
            {report.competitorMapping.slice(0, 3).map((comp, i) => (
              <View key={i} style={[s.compCard, { borderTopColor: [C.purple, C.cyan, C.pink][i % 3] }]}>
                <Text style={[s.compName, { color: [C.purple, C.cyan, C.pink][i % 3] }]}>{safe(comp.name)}</Text>
                <Text style={[s.compLabel, { color: C.green }]}>STRENGTHS</Text>
                <Text style={s.compText}>{safe(comp.strengths)}</Text>
                <View style={s.compDivider} />
                <Text style={[s.compLabel, { color: C.red }]}>GAPS</Text>
                <Text style={s.compText}>{safe(comp.gaps)}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={[s.sectionWrap]}>
            <View style={[s.sectionBox, { borderLeftColor: C.pink }]}>
              <Text style={s.sectionBody}>No competitor data available for this report.</Text>
            </View>
          </View>
        )}

        {/* Extra competitors if more than 3 */}
        {(report.competitorMapping?.length > 3) && (
          <View style={[s.compGrid, { marginTop: 10 }]}>
            {report.competitorMapping.slice(3).map((comp, i) => (
              <View key={i} style={[s.compCard, { flex: 1, maxWidth: "33%", borderTopColor: [C.indigo, C.orange, C.amber][i % 3] }]}>
                <Text style={[s.compName, { color: [C.indigo, C.orange, C.amber][i % 3] }]}>{safe(comp.name)}</Text>
                <Text style={[s.compLabel, { color: C.green }]}>STRENGTHS</Text>
                <Text style={s.compText}>{safe(comp.strengths)}</Text>
                <View style={s.compDivider} />
                <Text style={[s.compLabel, { color: C.red }]}>GAPS</Text>
                <Text style={s.compText}>{safe(comp.gaps)}</Text>
              </View>
            ))}
          </View>
        )}

        <PageFooter company={report.companyName} />
      </Page>

      {/* ════════════ PAGE 4 — BRAND + FOOTPRINT + WATCHOUTS ════════════ */}
      <Page size="A4" style={s.page}>
        <PageHeader company={report.companyName} />

        {/* 04 Brand Activity */}
        <View style={s.sectionWrap}>
          <SectionLabel label="04 · Brand Activity" color={C.amber} />
          <Text style={s.sectionTitle}>Brand Activity</Text>
          <View style={[s.sectionBox, { borderLeftColor: C.amber }]}>
            <Text style={s.sectionBody}>{safe(report.brandActivity)}</Text>
          </View>
        </View>

        <View style={s.divider} />

        {/* 05 Experiential Footprint */}
        <View style={s.sectionWrap}>
          <SectionLabel label="05 · Experiential Footprint" color={C.green} />
          <Text style={s.sectionTitle}>Experiential Footprint</Text>
          <View style={[s.sectionBox, { borderLeftColor: C.green }]}>
            <Text style={s.sectionBody}>{safe(report.experientialFootprint)}</Text>
          </View>
        </View>

        <View style={s.divider} />

        {/* 06 Strategic Watchouts */}
        <View style={[s.sectionWrap, { marginBottom: 0 }]}>
          <SectionLabel label="06 · Strategic Watchouts" color={C.red} />
          <Text style={s.sectionTitle}>Strategic Watchouts</Text>
        </View>
        <View style={s.watchBox}>
          <View style={s.watchHeader}>
            <Text style={s.watchLabel}>AI-ANALYZED RISKS · GraphRAG™</Text>
            <View style={s.watchBadge}>
              <Text style={s.watchBadgeText}>GRAPHRAG™ VERIFIED</Text>
            </View>
          </View>
          <Text style={s.watchBody}>{safe(report.strategicWatchouts)}</Text>
        </View>

        <PageFooter company={report.companyName} />
      </Page>

      {/* ════════════ PAGE 5 — PEOPLE ════════════ */}
      <Page size="A4" style={s.page}>
        <PageHeader company={report.companyName} />

        {/* 07 Decision Makers */}
        <View style={[s.sectionWrap, { marginBottom: 16 }]}>
          <SectionLabel label="07 · Decision Maker Roles" color={C.green} />
          <Text style={s.sectionTitle}>Decision Maker Roles</Text>
        </View>

        {(report.decisionMakerRoles?.length > 0) ? (
          report.decisionMakerRoles.map((role, i) => (
            <View key={i} style={s.dmRow}>
              <View style={s.dmNum}>
                <Text style={s.dmNumText}>{i + 1}</Text>
              </View>
              <View style={s.dmContent}>
                <Text style={s.dmTitle}>{safe(role.title)}</Text>
                <Text style={s.dmRationale}>{safe(role.rationale)}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={s.sectionWrap}>
            <View style={[s.sectionBox, { borderLeftColor: C.green }]}>
              <Text style={s.sectionBody}>No decision maker data available.</Text>
            </View>
          </View>
        )}

        <View style={[s.divider, { marginTop: 10 }]} />

        {/* 08 Contact Intelligence */}
        <View style={[s.sectionWrap, { marginBottom: 16 }]}>
          <SectionLabel label="08 · Contact Intelligence" color={C.indigo} />
          <Text style={s.sectionTitle}>Contact Intelligence</Text>
        </View>

        {report.contactIntelligence?.map((contact, i) => (
          <View key={i} style={s.contactRow}>
            <View style={s.contactLeft}>
              <Text style={s.contactName}>{safe(contact.name)}</Text>
              <Text style={s.contactTitle}>{safe(contact.title)}</Text>
              {contact.email && <Text style={s.contactMeta}>Email: {contact.email}</Text>}
              {contact.phone && <Text style={s.contactMeta}>Phone: {contact.phone}</Text>}
              {contact.linkedin && <Text style={s.contactMeta}>LinkedIn: {contact.linkedin}</Text>}
            </View>
            {contact.verified ? (
              <View style={s.verifiedBadge}><Text style={s.verifiedText}>✓ VERIFIED</Text></View>
            ) : (
              <View style={s.protectedBadge}><Text style={s.protectedText}>PROTECTED</Text></View>
            )}
          </View>
        ))}

        <PageFooter company={report.companyName} />
      </Page>

      {/* ════════════ PAGE 6 — OUTREACH ════════════ */}
      <Page size="A4" style={s.page}>
        <PageHeader company={report.companyName} />

        {/* 09 Email */}
        <View style={[s.sectionWrap, { marginBottom: 16 }]}>
          <SectionLabel label="09 · Personalized Outreach" color={C.orange} />
          <Text style={s.sectionTitle}>Cold Email Draft</Text>
        </View>

        <View style={[s.outreachBox, { borderLeftColor: C.orange }]}>
          <Text style={[s.outreachLabel, { color: C.orange }]}>EMAIL SUBJECT</Text>
          <Text style={s.outreachSubject}>{safe(report.outreach?.emailSubject)}</Text>
          <Text style={[s.outreachLabel, { color: C.orange }]}>EMAIL BODY</Text>
          <Text style={s.outreachBody}>{safe(report.outreach?.emailBody)}</Text>
        </View>

        <View style={s.divider} />

        {/* LinkedIn Message */}
        <View style={[s.sectionWrap, { marginBottom: 16 }]}>
          <SectionLabel label="09 · LinkedIn Outreach" color={C.indigo} />
          <Text style={s.sectionTitle}>LinkedIn InMail Draft</Text>
        </View>

        <View style={[s.outreachBox, { borderLeftColor: C.indigo }]}>
          <Text style={[s.outreachLabel, { color: C.indigo }]}>INMAIL MESSAGE</Text>
          <Text style={s.outreachBody}>{safe(report.outreach?.linkedinMessage)}</Text>
        </View>

        <PageFooter company={report.companyName} />
      </Page>

      {/* ════════════ PAGE 7 — TRACKING PIXEL ════════════ */}
      <Page size="A4" style={s.page}>
        <PageHeader company={report.companyName} />

        <View style={s.sectionWrap}>
          <SectionLabel label="10 · Tracking Pixel Logic" color={C.cyan} />
          <Text style={s.sectionTitle}>Tracking Pixel & Intent Logic</Text>
          <View style={[s.sectionBox, { borderLeftColor: C.cyan, marginBottom: 20 }]}>
            <Text style={s.sectionBody}>{safe(report.outreach?.trackingLogicExplanation)}</Text>
          </View>
        </View>

        <View style={[s.sectionWrap, { marginBottom: 10 }]}>
          <Text style={[s.sectionEyebrow, { color: C.cyan, marginBottom: 8 }]}>HTML SNIPPET — EMBED IN EMAIL</Text>
        </View>
        <View style={s.codeBox}>
          <Text style={s.codeText}>{safe(report.outreach?.trackingPixelHtml)}</Text>
        </View>

        {/* Architecture note */}
        <View style={[s.sectionWrap, { marginTop: 16 }]}>
          <View style={[s.sectionBox, { borderLeftColor: C.dim, backgroundColor: C.bg3 }]}>
            <Text style={[s.outreachLabel, { color: C.muted, marginBottom: 8 }]}>IMPLEMENTATION NOTES</Text>
            <Text style={[s.sectionBody, { color: C.muted }]}>
              1. Replace "PLACEHOLDER" in the pixel URL with a unique lead ID from your CRM.{"\n"}
              2. Host the tracking endpoint at /track/open/:id on your server.{"\n"}
              3. On each pixel request: log the timestamp, IP, and user-agent, then fire a CRM webhook.{"\n"}
              4. Correlate multiple opens by the same lead to identify high-intent windows.
            </Text>
          </View>
        </View>

        {/* Back cover bar */}
        <View style={{ position: "absolute", bottom: 60, left: 40, right: 40, backgroundColor: C.bg3, borderRadius: 8, padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={[s.coverFooterBrand, { fontSize: 13 }]}>OMNISENSE</Text>
            <Text style={s.coverFooterSub}>B2B Intelligence Engine</Text>
          </View>
          <Text style={[s.coverDateText, { textAlign: "right", fontSize: 9 }]}>
            Report generated: {dateStr}{"\n"}
            Company: {safe(report.companyName)}{"\n"}
            Powered by NVIDIA minimax-m2.7
          </Text>
        </View>

        <PageFooter company={report.companyName} />
      </Page>
    </Document>
  );
}
