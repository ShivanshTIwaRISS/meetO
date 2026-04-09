import { randomUUID } from "crypto";

export class Post {
    private id: string;
    private userId: string;
    private content: string;
    private likeCount: number;
    private commentCount: number;

    constructor(id: string, userId: string, content: string) {
        this.id = id;
        this.userId = userId;
        this.content = content;
        this.likeCount = 0;
        this.commentCount = 0;
    }

    public getId(): string { return this.id; }
    public getUserId(): string { return this.userId; }
    public getContent(): string { return this.content; }
    public getLikeCount(): number { return this.likeCount; }
    public getCommentCount(): number { return this.commentCount; }

    public static create(userId: string, content: string): Post {
        return new Post(randomUUID(), userId, content);
    }

    public edit(newContent: string): void {
        this.content = newContent;
    }

    public delete(): boolean {
        return true; // Handled by service
    }

    public incrementLikeCount(): void {
        this.likeCount++;
    }

    public decrementLikeCount(): void {
        if (this.likeCount > 0) this.likeCount--;
    }

    public incrementCommentCount(): void {
        this.commentCount++;
    }

    public decrementCommentCount(): void {
        if (this.commentCount > 0) this.commentCount--;
    }
}
