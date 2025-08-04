import express from "express";
import {
  login,
  logout,
  profile,
  signup,
} from "../controllers/auth.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", protectRoute, profile);

export default router;
