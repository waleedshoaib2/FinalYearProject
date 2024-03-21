import express from "express";
import subscribersController from "../controllers/subscribers.js";

const router = express.Router();

router.post("/subscribe", subscribersController.createSubscribers);
router.post("/unsubscribe", subscribersController.deleteSubscribers);

export default router;
