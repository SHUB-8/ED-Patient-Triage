import express from "express";
import {
  getBeds,
  getBedById,
  getBedByZone,
  addToBed,
  createBed,
  dischargeFromBed,
} from "../controllers/bed.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getBeds);
router.get("/:id", protectRoute, getBedById);
router.get("/zone/:zone", protectRoute, getBedByZone);
router.post("/create", protectRoute, createBed);
router.post("/assign", protectRoute, addToBed);
router.post("/discharge", protectRoute, dischargeFromBed);

export default router;
