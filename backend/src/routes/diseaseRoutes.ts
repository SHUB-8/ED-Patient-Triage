import express from "express";
import {
  createDisease,
  getDiseases,
  updateDisease,
} from "../controllers/disease.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/", protectRoute, createDisease);
router.get("/", protectRoute, getDiseases);
router.put("/", protectRoute, updateDisease);

export default router;
