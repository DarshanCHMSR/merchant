import express from "express";
import { sendotp,verifyotp } from "../controllers/otpController.js";

const router = express.Router();
// * otp routes
router.post('/send-otp', sendotp);
router.post('/verify-otp', verifyotp);

export default router