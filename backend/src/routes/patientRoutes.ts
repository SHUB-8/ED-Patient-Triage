import express from "express";
import {
  addPatient,
  // deletePatient,
  getPatientById,
  getPatients,
  updatePatient,
  getPatientCases,
  searchPatients,
} from "../controllers/patient.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/", protectRoute, addPatient);
router.get("/", protectRoute, getPatients);
router.get("/search", protectRoute, searchPatients);
router.get("/:id", protectRoute, getPatientById);
router.put("/:id", protectRoute, updatePatient);
// router.delete("/:id", protectRoute, deletePatient);
router.get("/:id/cases", protectRoute, getPatientCases);
export default router;
