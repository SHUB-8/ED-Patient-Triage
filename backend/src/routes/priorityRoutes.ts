import express from "express";
import {
  getAllPriorityQueues,
  getPriorityQueue,
  insertToPriorityQueue,
} from "../controllers/priority.controller.js";

const router = express.Router();

router.post("/", insertToPriorityQueue);

router.get("/", getAllPriorityQueues);

router.get("/:zone", getPriorityQueue);

export default router;
