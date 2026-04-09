import { randomUUID } from "crypto";

export class Follow {
    private id: string;
    private followerId: string;
    private followingId: string;

    constructor(id: string, followerId: string, followingId: string) {
        this.id = id;
        this.followerId = followerId;
        this.followingId = followingId;
    }

    public getId(): string { return this.id; }
    public getFollowerId(): string { return this.followerId; }
    public getFollowingId(): string { return this.followingId; }

    public static follow(followerId: string, followingId: string): Follow {
        return new Follow(randomUUID(), followerId, followingId);
    }

    public static unfollow(): boolean {
        return true;
    }

    public isFollowing(followerId: string, followingId: string): boolean {
        return this.followerId === followerId && this.followingId === followingId;
    }
}
