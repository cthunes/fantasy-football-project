import express from "express";

import {
    getRankings,
    createRanking,
    deleteRanking,
} from "../controllers/ranking.js";

const router = express.Router();

router.get("/", getRankings);
router.post("/", createRanking);
router.delete("/:id", deleteRanking);

export default router;
