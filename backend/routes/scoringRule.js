import express from "express";
import { getScoringRules } from "../controllers/scoringRule.js";

const router = express.Router();

router.get("/", getScoringRules);

export default router;