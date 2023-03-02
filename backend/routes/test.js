import express from "express";

import { getTest, createTest } from "../controllers/test.js";

const router = express.Router();

router.get("/", getTest);
router.post("/", createTest);

export default router;
