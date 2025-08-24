import express from "express";
import {
  addPatient,
  // deletePatient,
  getPatientById,
  getPatients,
  updatePatient,
} from "../controllers/patient.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/", protectRoute, addPatient);
router.get("/", protectRoute, getPatients);
router.get("/:id", protectRoute, getPatientById);
router.put("/:id", protectRoute, updatePatient);
// router.delete("/:id", protectRoute, deletePatient);

export default router;
