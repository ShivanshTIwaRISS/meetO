import { randomUUID } from "crypto";

export class Message {
    private id: string;
    private senderId: string;
    private receiverId: string;
    private content: string;
    private timestamp: Date;

    constructor(id: string, senderId: string, receiverId: string, content: string) {
        this.id = id;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
        this.timestamp = new Date();
    }

    public getId(): string { return this.id; }
    public getSenderId(): string { return this.senderId; }
    public getReceiverId(): string { return this.receiverId; }
    public getContent(): string { return this.content; }
    public getTimestamp(): Date { return this.timestamp; }

    public static sendMessage(senderId: string, receiverId: string, content: string): Message {
        return new Message(randomUUID(), senderId, receiverId, content);
    }

    public static getConversation(): boolean {
        return true; // Implemented via service
    }
}
