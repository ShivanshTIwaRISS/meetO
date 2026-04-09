import { randomUUID } from "crypto";

export class AuthService {
    private static instance: AuthService;
    private sessions: Map<string, string>; // sessionId -> userId

    private constructor() {
        this.sessions = new Map();
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    public createSession(userId: string): string {
        const sessionId = randomUUID();
        this.sessions.set(sessionId, userId);
        return sessionId;
    }

    public validateSession(sessionId: string): string | null {
        return this.sessions.get(sessionId) || null;
    }

    public invalidateSession(sessionId: string): void {
        this.sessions.delete(sessionId);
    }
}
