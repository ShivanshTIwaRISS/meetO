import { Router } from "express";
import {
    createPost, getPost, editPost, deletePost,
    likePost, unlikePost,
    addComment, editComment, deleteComment,
    getFeed, refreshFeed
} from "../controllers/PostController";

const router = Router();

// Posts
router.post("/", createPost);
router.get("/:postId", getPost);
router.put("/:postId", editPost);
router.delete("/:postId", deletePost);

// Likes
router.post("/:postId/like", likePost);
router.delete("/:postId/like", unlikePost);

// Comments
router.post("/:postId/comments", addComment);
router.put("/comments/:commentId", editComment);
router.delete("/comments/:commentId", deleteComment);

// Feed
router.get("/feed/me", getFeed);
router.post("/feed/refresh", refreshFeed);

export default router;
