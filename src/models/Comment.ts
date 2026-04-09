import { randomUUID } from "crypto";

export class Comment {
    private id: string;
    private postId: string;
    private userId: string;
    private content: string;

    constructor(id: string, postId: string, userId: string, content: string) {
        this.id = id;
        this.postId = postId;
        this.userId = userId;
        this.content = content;
    }

    public getId(): string { return this.id; }
    public getPostId(): string { return this.postId; }
    public getUserId(): string { return this.userId; }
    public getContent(): string { return this.content; }

    public static add(postId: string, userId: string, content: string): Comment {
        return new Comment(randomUUID(), postId, userId, content);
    }

    public edit(newContent: string): void {
        this.content = newContent;
    }

    public delete(): boolean {
        return true;
    }
}
