import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import teamsRouter from "./teams.js";
import matchesRouter from "./matches.js";
import goalsRouter from "./goals.js";
import cardsRouter from "./cards.js";
import matchEventsRouter from "./matchEvents.js";
import standingsRouter from "./standings.js";
import statsRouter from "./stats.js";
import tournamentRouter from "./tournament.js";
import tournamentInfoRouter from "./tournamentInfo.js";
import playersRouter from "./players.js";
import otpRouter from "./otp.js";
import announcementsRouter from "./announcements.js";
import clubApplicationsRouter from "./clubApplications.js";
import clubSettingsRouter from "./clubSettings.js";
import seasonArchivesRouter from "./seasonArchives.js";

const router: IRouter = Router();

const PUBLIC_WRITE = [
  "/auth/login",
  "/auth/logout",
];
const PUBLIC_WRITE_PREFIX = [
  "/register",
  "/otp/",
];

router.use((req: Request, res: Response, next: NextFunction): void => {
  if (req.path === "/admin" || req.path.startsWith("/admin/")) {
    requireAuth(req, res, next);
    return;
  }
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
    return next();
  }
  if (PUBLIC_WRITE.includes(req.path)) return next();
  if (PUBLIC_WRITE_PREFIX.some(p => req.path.startsWith(p))) return next();
  if (req.path === "/club-applications" && req.method === "POST") return next();
  requireAuth(req, res, next);
});

router.use(healthRouter);
router.use(authRouter);
router.use(teamsRouter);
router.use(matchesRouter);
router.use(goalsRouter);
router.use(cardsRouter);
router.use(matchEventsRouter);
router.use(standingsRouter);
router.use(statsRouter);
router.use(tournamentRouter);
router.use(tournamentInfoRouter);
router.use(playersRouter);
router.use(otpRouter);
router.use(announcementsRouter);
router.use(clubApplicationsRouter);
router.use(clubSettingsRouter);
router.use(seasonArchivesRouter);

export default router;
