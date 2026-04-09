import { Notification, NotificationType } from "../models/Notification";
import { DataStore } from "./DataStore";

// Observer Interface
export interface Observer {
    update(notification: Notification): void;
}

export class NotificationService {
    private static instance: NotificationService;
    private observers: Map<string, Observer[]> = new Map(); // userId -> Observers

    private constructor() {}

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    public subscribe(userId: string, observer: Observer): void {
        const userObservers = this.observers.get(userId) || [];
        userObservers.push(observer);
        this.observers.set(userId, userObservers);
    }

    public unsubscribe(userId: string, observer: Observer): void {
        const userObservers = this.observers.get(userId) || [];
        this.observers.set(userId, userObservers.filter(obs => obs !== observer));
    }

    public notifyUser(userId: string, type: NotificationType, message: string): void {
        const notification = Notification.sendNotification(userId, type, message);
        DataStore.notifications.set(notification.getId(), notification);

        const userObservers = this.observers.get(userId) || [];
        for (const observer of userObservers) {
            observer.update(notification);
        }
    }
}
