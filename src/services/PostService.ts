import { DataStore } from "./DataStore";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";
import { Like } from "../models/Like";
import { NotificationService } from "./NotificationService";
import { NotificationType } from "../models/Notification";

export class PostService {
    public createPost(userId: string, content: string): Post {
        const post = Post.create(userId, content);
        DataStore.posts.set(post.getId(), post);
        return post;
    }

    public getPost(postId: string): Post | null {
        return DataStore.posts.get(postId) || null;
    }

    public likePost(postId: string, userId: string): Like | null {
        const post = DataStore.posts.get(postId);
        if (!post) return null;

        const existingLike = Array.from(DataStore.likes.values())
            .find(l => l.getPostId() === postId && l.getUserId() === userId);

        if (existingLike) return existingLike;

        const like = Like.likePost(postId, userId);
        DataStore.likes.set(like.getId(), like);

        post.incrementLikeCount();

        if (post.getUserId() !== userId) {
            NotificationService.getInstance().notifyUser(post.getUserId(), NotificationType.LIKE, `User ${userId} liked your post ${postId}.`);
        }

        return like;
    }

    public unlikePost(postId: string, userId: string): boolean {
        const like = Array.from(DataStore.likes.values())
            .find(l => l.getPostId() === postId && l.getUserId() === userId);

        if (like) {
            DataStore.likes.delete(like.getId());
            
            const post = DataStore.posts.get(postId);
            if (post) post.decrementLikeCount();
            
            return true;
        }
        return false;
    }

    public addComment(postId: string, userId: string, content: string): Comment | null {
        const post = DataStore.posts.get(postId);
        if (!post) return null;

        const comment = Comment.add(postId, userId, content);
        DataStore.comments.set(comment.getId(), comment);

        post.incrementCommentCount();

        if (post.getUserId() !== userId) {
            NotificationService.getInstance().notifyUser(post.getUserId(), NotificationType.COMMENT, `User ${userId} commented on your post ${postId}.`);
        }

        return comment;
    }
}
