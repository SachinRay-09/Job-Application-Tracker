import express from "express";
import {
  register,
  login,
  logout,
  addApplication,
  getSpecificApplicationData,
  getAllApplicationData,
  getUserData,
  deleteApplication,
  updateApplication,
  updateUserData,
} from "../controller/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

// Simple healthcheck route (no auth) to verify server responsiveness
router.get("/api/ping", (req, res) => {
  res.status(200).json({ ok: true, time: new Date().toISOString() });
});

router.post("/api/user/addData", protect, addApplication);

router.get("/api/user/allApplicationData", protect, getAllApplicationData);

router.post(
  "/api/user/specificapplicationData",
  protect,
  getSpecificApplicationData,
);

router.get("/api/user/data", protect, getUserData);

router.post("/api/user/updateData", protect, updateUserData);

router.post("/api/user/deleteApplication", protect, deleteApplication);

router.post("/api/user/updateApplication", protect, updateApplication);

export default router;
