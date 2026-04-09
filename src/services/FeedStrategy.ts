import { DataStore } from "./DataStore";
import { Post } from "../models/Post";
import { Follow } from "../models/Follow";

export interface FeedStrategy {
    generateFeed(userId: string): Post[];
}

export class ChronologicalFeedStrategy implements FeedStrategy {
    public generateFeed(userId: string): Post[] {
        // Find users that this userId follows
        const followingIds = Array.from(DataStore.followers.values())
            .filter(follow => follow.getFollowerId() === userId)
            .map(follow => follow.getFollowingId());

        // Get all posts from those users
        const posts = Array.from(DataStore.posts.values())
            .filter(post => followingIds.includes(post.getUserId()));

        // In a real app we would sort by timestamp. Here we just return the array
        // as our Post model doesn't have a timestamp according to UML.
        // We simulate chronological by reversing since Maps maintain insertion order.
        return posts.reverse();
    }
}
