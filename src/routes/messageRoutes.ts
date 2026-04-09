import { Router } from "express";
import { sendMessage, getConversation } from "../controllers/MessageController";

const router = Router();

router.post("/", sendMessage);
router.get("/conversation/:otherUserId", getConversation);

export default router;
