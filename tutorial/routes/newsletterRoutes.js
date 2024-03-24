import express from "express";
import sendNewsletters from "../controllers/newsletterSubscription.js";
const router = express.Router();

router.post("/", sendNewsletters);

export default router;
