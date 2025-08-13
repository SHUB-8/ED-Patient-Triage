import express from "express";
import {
  admitTopPriorityCase,
  getAllPriorityQueues,
  getPriorityQueue,
  insertToPriorityQueue,
  updateDetails,
} from "../controllers/priority.controller.js";

const router = express.Router();

router.post("/", insertToPriorityQueue);

router.get("/", getAllPriorityQueues);

router.get("/:zone", getPriorityQueue);

router.delete("/top/:zone", admitTopPriorityCase);

router.put("/update", updateDetails);

export default router;
