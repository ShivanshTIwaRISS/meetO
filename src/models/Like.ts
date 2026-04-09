import { randomUUID } from "crypto";

export class Like {
    private id: string;
    private postId: string;
    private userId: string;

    constructor(id: string, postId: string, userId: string) {
        this.id = id;
        this.postId = postId;
        this.userId = userId;
    }

    public getId(): string { return this.id; }
    public getPostId(): string { return this.postId; }
    public getUserId(): string { return this.userId; }

    public static likePost(postId: string, userId: string): Like {
        return new Like(randomUUID(), postId, userId);
    }

    public unlikePost(): boolean {
        return true;
    }
}
