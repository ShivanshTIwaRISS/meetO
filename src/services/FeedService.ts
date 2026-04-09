import { FeedStrategy } from "./FeedStrategy";
import { DataStore } from "./DataStore";
import { Feed } from "../models/Feed";

export class FeedService {
    private strategy: FeedStrategy;

    constructor(strategy: FeedStrategy) {
        this.strategy = strategy;
    }

    public setStrategy(strategy: FeedStrategy): void {
        this.strategy = strategy;
    }

    public generateUserFeed(userId: string): Feed {
        const posts = this.strategy.generateFeed(userId);
        const postIds = posts.map(post => post.getId());

        let feed = DataStore.feeds.get(userId);
        if (!feed) {
            feed = new Feed(userId, postIds);
            DataStore.feeds.set(userId, feed);
        } else {
            feed.generateFeed(postIds);
        }

        return feed;
    }

    public refreshUserFeed(userId: string): Feed {
        // For our simple in-memory implementation, refresh is same as generate
        return this.generateUserFeed(userId);
    }
}
