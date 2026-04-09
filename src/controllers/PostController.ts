import { Request, Response } from "express";
import { PostService } from "../services/PostService";
import { AuthService } from "../services/AuthService";
import { DataStore } from "../services/DataStore";
import { FeedService } from "../services/FeedService";
import { ChronologicalFeedStrategy } from "../services/FeedStrategy";

const postService = new PostService();
const authService = AuthService.getInstance();
const feedService = new FeedService(new ChronologicalFeedStrategy());

export function createPost(req: Request, res: Response): void {
    const sessionId = req.headers["x-session-id"] as string;
    const userId = authService.validateSession(sessionId);
    if (!userId) {
        res.status(401).json({ error: "Unauthorized." });
        return;
    }
    const { content } = req.body as { content: string };
    if (!content) {
        res.status(400).json({ error: "content is required." });
        return;
    }
    const post = postService.createPost(userId, content);
    res.status(201).json({ id: post.getId(), userId: post.getUserId(), content: post.getContent(), likeCount: post.getLikeCount(), commentCount: post.getCommentCount() });
}

export function getPost(req: Request, res: Response): void {
    const postId = req.params["postId"] as string;
    const post = postService.getPost(postId);
    if (!post) {
        res.status(404).json({ error: "Post not found." });
        return;
    }
    res.json({ id: post.getId(), userId: post.getUserId(), content: post.getContent(), likeCount: post.getLikeCount(), commentCount: post.getCommentCount() });
}

export function editPost(req: Request, res: Response): void {
    const sessionId = req.headers["x-session-id"] as string;
    const userId = authService.validateSession(sessionId);
    if (!userId) {
        res.status(401).json({ error: "Unauthorized." });
        return;
    }
    const postId = req.params["postId"] as string;
    const post = DataStore.posts.get(postId);
    if (!post) {
        res.status(404).json({ error: "Post not found." });
        return;
    }
    if (post.getUserId() !== userId) {
        res.status(403).json({ error: "You cannot edit another user's post." });
        return;
    }
    const { content } = req.body as { content: string };
    post.edit(content);
    res.json({ id: post.getId(), content: post.getContent() });
}

export function deletePost(req: Request, res: Response): void {
    const sessionId = req.headers["x-session-id"] as string;
    const userId = authService.validateSession(sessionId);
    if (!userId) {
        res.status(401).json({ error: "Unauthorized." });
        return;
    }
    const postId = req.params["postId"] as string;
    const post = DataStore.posts.get(postId);
    if (!post) {
        res.status(404).json({ error: "Post not found." });
        return;
    }
    if (post.getUserId() !== userId) {
        res.status(403).json({ error: "You cannot delete another user's post." });
        return;
    }
    post.delete();
    DataStore.posts.delete(postId);
    res.json({ message: "Post deleted." });
}

export function likePost(req: Request, res: Response): void {
    const sessionId = req.headers["x-session-id"] as string;
    const userId = authService.validateSession(sessionId);
    if (!userId) {
        res.status(401).json({ error: "Unauthorized." });
        return;
    }
    const postId = req.params["postId"] as string;
    const like = postService.likePost(postId, userId);
    if (!like) {
        res.status(404).json({ error: "Post not found." });
        return;
    }
    res.json({ id: like.getId(), postId: like.getPostId(), userId: like.getUserId() });
}

export function unlikePost(req: Request, res: Response): void {
    const sessionId = req.headers["x-session-id"] as string;
    const userId = authService.validateSession(sessionId);
    if (!userId) {
        res.status(401).json({ error: "Unauthorized." });
        return;
    }
    const postId = req.params["postId"] as string;
    const success = postService.unlikePost(postId, userId);
    if (!success) {
        res.status(404).json({ error: "Like not found." });
        return;
    }
    res.json({ message: "Post unliked." });
}

export function addComment(req: Request, res: Response): void {
    const sessionId = req.headers["x-session-id"] as string;
    const userId = authService.validateSession(sessionId);
    if (!userId) {
        res.status(401).json({ error: "Unauthorized." });
        return;
    }
    const postId = req.params["postId"] as string;
    const { content } = req.body as { content: string };
    if (!content) {
        res.status(400).json({ error: "content is required." });
        return;
    }
    const comment = postService.addComment(postId, userId, content);
    if (!comment) {
        res.status(404).json({ error: "Post not found." });
        return;
    }
    res.status(201).json({ id: comment.getId(), postId: comment.getPostId(), userId: comment.getUserId(), content: comment.getContent() });
}

export function editComment(req: Request, res: Response): void {
    const sessionId = req.headers["x-session-id"] as string;
    const userId = authService.validateSession(sessionId);
    if (!userId) {
        res.status(401).json({ error: "Unauthorized." });
        return;
    }
    const commentId = req.params["commentId"] as string;
    const comment = DataStore.comments.get(commentId);
    if (!comment) {
        res.status(404).json({ error: "Comment not found." });
        return;
    }
    if (comment.getUserId() !== userId) {
        res.status(403).json({ error: "You cannot edit another user's comment." });
        return;
    }
    const { content } = req.body as { content: string };
    comment.edit(content);
    res.json({ id: comment.getId(), content: comment.getContent() });
}

export function deleteComment(req: Request, res: Response): void {
    const sessionId = req.headers["x-session-id"] as string;
    const userId = authService.validateSession(sessionId);
    if (!userId) {
        res.status(401).json({ error: "Unauthorized." });
        return;
    }
    const commentId = req.params["commentId"] as string;
    const comment = DataStore.comments.get(commentId);
    if (!comment) {
        res.status(404).json({ error: "Comment not found." });
        return;
    }
    if (comment.getUserId() !== userId) {
        res.status(403).json({ error: "You cannot delete another user's comment." });
        return;
    }
    const post = DataStore.posts.get(comment.getPostId());
    if (post) post.decrementCommentCount();
    comment.delete();
    DataStore.comments.delete(commentId);
    res.json({ message: "Comment deleted." });
}

export function getFeed(req: Request, res: Response): void {
    const sessionId = req.headers["x-session-id"] as string;
    const userId = authService.validateSession(sessionId);
    if (!userId) {
        res.status(401).json({ error: "Unauthorized." });
        return;
    }
    const feed = feedService.generateUserFeed(userId);
    const posts = feed.getPostIds().map(id => {
        const p = DataStore.posts.get(id);
        if (!p) return null;
        return { id: p.getId(), userId: p.getUserId(), content: p.getContent(), likeCount: p.getLikeCount(), commentCount: p.getCommentCount() };
    }).filter(Boolean);
    res.json(posts);
}

export function refreshFeed(req: Request, res: Response): void {
    const sessionId = req.headers["x-session-id"] as string;
    const userId = authService.validateSession(sessionId);
    if (!userId) {
        res.status(401).json({ error: "Unauthorized." });
        return;
    }
    const feed = feedService.refreshUserFeed(userId);
    const posts = feed.getPostIds().map(id => {
        const p = DataStore.posts.get(id);
        if (!p) return null;
        return { id: p.getId(), userId: p.getUserId(), content: p.getContent(), likeCount: p.getLikeCount(), commentCount: p.getCommentCount() };
    }).filter(Boolean);
    res.json(posts);
}
