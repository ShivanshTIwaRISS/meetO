import { randomUUID } from "crypto";

export enum NotificationType {
    LIKE = "LIKE",
    COMMENT = "COMMENT",
    FOLLOW = "FOLLOW"
}

export class Notification {
    private id: string;
    private userId: string;
    private type: NotificationType;
    private message: string;

    constructor(id: string, userId: string, type: NotificationType, message: string) {
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.message = message;
    }

    public getId(): string { return this.id; }
    public getUserId(): string { return this.userId; }
    public getType(): NotificationType { return this.type; }
    public getMessage(): string { return this.message; }

    public static sendNotification(userId: string, type: NotificationType, message: string): Notification {
        return new Notification(randomUUID(), userId, type, message);
    }
}
