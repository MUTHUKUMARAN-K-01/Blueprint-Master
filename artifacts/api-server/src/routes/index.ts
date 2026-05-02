import { Router, type IRouter } from "express";
import healthRouter from "./health";
import intelligenceRouter from "./intelligence";
import reportsRouter from "./reports";

const router: IRouter = Router();

router.use(healthRouter);
router.use(intelligenceRouter);
router.use(reportsRouter);

export default router;
