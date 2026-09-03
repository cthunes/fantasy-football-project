import express from "express";

import { getPlayerAggregations } from "../controllers/playerAggregation.js";

const router = express.Router();

router.get("/", getPlayerAggregations);

export default router;
