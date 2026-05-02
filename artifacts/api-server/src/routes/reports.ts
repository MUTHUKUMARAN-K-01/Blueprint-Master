import { Router, type IRouter } from "express";
import { db, reportsTable } from "@workspace/db";
import { GetReportParams } from "@workspace/api-zod";
import { desc, eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/reports", async (req, res) => {
  try {
    const reports = await db
      .select({
        id: reportsTable.id,
        companyName: reportsTable.companyName,
        category: reportsTable.category,
        createdAt: reportsTable.createdAt,
      })
      .from(reportsTable)
      .orderBy(desc(reportsTable.createdAt));

    res.json(
      reports.map((r) => ({
        id: r.id,
        companyName: r.companyName,
        category: r.category,
        createdAt: r.createdAt.toISOString(),
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list reports");
    res.status(500).json({ error: "server_error", message: "Failed to list reports" });
  }
});

router.get("/reports/:id", async (req, res) => {
  const parsed = GetReportParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: "Invalid report ID" });
    return;
  }

  try {
    const [record] = await db
      .select()
      .from(reportsTable)
      .where(eq(reportsTable.id, parsed.data.id))
      .limit(1);

    if (!record) {
      res.status(404).json({ error: "not_found", message: "Report not found" });
      return;
    }

    res.json({
      id: record.id,
      companyName: record.companyName,
      category: record.category,
      report: record.report,
      createdAt: record.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get report");
    res.status(500).json({ error: "server_error", message: "Failed to get report" });
  }
});

export default router;
