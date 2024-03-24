import express from "express";
import {
  stripeCheckOut,
  stripeWebHook,
} from "../controllers/stripeController.js";
import { checkAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/create-checkout-session",
  express.json(),
  checkAuth,
  stripeCheckOut
);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebHook
);

export default router;
