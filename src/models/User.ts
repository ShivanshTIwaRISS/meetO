import { randomUUID } from "crypto";

export class User {
    private id: string;
    private username: string;
    private email: string;
    private passwordHash: string;

    constructor(id: string, username: string, email: string, passwordHash: string) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
    }

    public getId(): string { return this.id; }
    public getUsername(): string { return this.username; }

    public static register(username: string, email: string, passwordHash: string): User {
        return new User(randomUUID(), username, email, passwordHash);
    }

    public login(passwordHashAttempt: string): boolean {
        return this.passwordHash === passwordHashAttempt;
    }

    public logout(): void {
        // Session invalidation is handled by AuthService, but method required by UML
    }

    public updateAccount(username?: string, email?: string): void {
        if (username) this.username = username;
        if (email) this.email = email;
    }

    public deleteAccount(): boolean {
        return true; // Used by service to flag deletion success
    }

    public follow(targetUserId: string): { followerId: string; followingId: string } {
        return { followerId: this.id, followingId: targetUserId };
    }

    public unfollow(targetUserId: string): { followerId: string; followingId: string } {
        return { followerId: this.id, followingId: targetUserId };
    }
}
