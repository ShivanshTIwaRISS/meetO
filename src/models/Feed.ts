export class Feed {
    private userId: string;
    private postIds: string[];

    constructor(userId: string, postIds: string[] = []) {
        this.userId = userId;
        this.postIds = postIds;
    }

    public getUserId(): string { return this.userId; }
    public getPostIds(): string[] { return this.postIds; }

    public generateFeed(postIds: string[]): void {
        this.postIds = postIds;
    }

    public refreshFeed(newPostIds: string[]): void {
        this.postIds = newPostIds;
    }
}
