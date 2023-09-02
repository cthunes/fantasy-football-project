import express from "express";

import {
    getRankings,
    createRanking,
    updateRanking,
    deleteRanking,
} from "../controllers/ranking.js";

const router = express.Router();

router.get("/", getRankings);
router.post("/", createRanking);
router.patch("/:id", updateRanking);
router.delete("/:id", deleteRanking);

export default router;
