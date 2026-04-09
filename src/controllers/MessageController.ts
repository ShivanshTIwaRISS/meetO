import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { DataStore } from "../services/DataStore";
import { Message } from "../models/Message";

const authService = AuthService.getInstance();

export function sendMessage(req: Request, res: Response): void {
    const sessionId = req.headers["x-session-id"] as string;
    const senderId = authService.validateSession(sessionId);
    if (!senderId) {
        res.status(401).json({ error: "Unauthorized." });
        return;
    }
    const { receiverId, content } = req.body as { receiverId: string; content: string };
    if (!receiverId || !content) {
        res.status(400).json({ error: "receiverId and content are required." });
        return;
    }
    const receiver = DataStore.users.get(receiverId);
    if (!receiver) {
        res.status(404).json({ error: "Receiver not found." });
        return;
    }
    const message = Message.sendMessage(senderId, receiverId, content);
    DataStore.messages.set(message.getId(), message);
    res.status(201).json({ id: message.getId(), senderId: message.getSenderId(), receiverId: message.getReceiverId(), content: message.getContent() });
}

export function getConversation(req: Request, res: Response): void {
    const sessionId = req.headers["x-session-id"] as string;
    const userId = authService.validateSession(sessionId);
    if (!userId) {
        res.status(401).json({ error: "Unauthorized." });
        return;
    }
    const { otherUserId } = req.params;
    const conversation = Array.from(DataStore.messages.values())
        .filter(m =>
            (m.getSenderId() === userId && m.getReceiverId() === otherUserId) ||
            (m.getSenderId() === otherUserId && m.getReceiverId() === userId)
        )
        .map(m => ({
            id: m.getId(),
            senderId: m.getSenderId(),
            receiverId: m.getReceiverId(),
            content: m.getContent(),
            timestamp: m.getTimestamp()
        }));
    res.json(conversation);
}
