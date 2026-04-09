import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { AuthService } from "../services/AuthService";
import { DataStore } from "../services/DataStore";

const userService = new UserService();
const authService = AuthService.getInstance();

export function register(req: Request, res: Response): void {
    const { username, email, password } = req.body as { username: string; email: string; password: string };
    if (!username || !email || !password) {
        res.status(400).json({ error: "username, email, and password are required." });
        return;
    }
    const exists = Array.from(DataStore.users.values()).find(u => u.getUsername() === username);
    if (exists) {
        res.status(409).json({ error: "Username already taken." });
        return;
    }
    const user = userService.register(username, email, password);
    res.status(201).json({ id: user.getId(), username: user.getUsername() });
}

export function login(req: Request, res: Response): void {
    const { username, password } = req.body as { username: string; password: string };
    const user = userService.login(username, password);
    if (!user) {
        res.status(401).json({ error: "Invalid credentials." });
        return;
    }
    const sessionId = authService.createSession(user.getId());
    res.json({ sessionId, userId: user.getId() });
}

export function logout(req: Request, res: Response): void {
    const sessionId = req.headers["x-session-id"] as string;
    if (!sessionId) {
        res.status(400).json({ error: "No session provided." });
        return;
    }
    authService.invalidateSession(sessionId);
    res.json({ message: "Logged out successfully." });
}

export function updateAccount(req: Request, res: Response): void {
    const sessionId = req.headers["x-session-id"] as string;
    const userId = authService.validateSession(sessionId);
    if (!userId) {
        res.status(401).json({ error: "Unauthorized." });
        return;
    }
    const { username, email } = req.body as { username?: string; email?: string };
    const user = DataStore.users.get(userId);
    if (!user) {
        res.status(404).json({ error: "User not found." });
        return;
    }
    user.updateAccount(username, email);
    res.json({ id: user.getId(), username: user.getUsername() });
}

export function deleteAccount(req: Request, res: Response): void {
    const sessionId = req.headers["x-session-id"] as string;
    const userId = authService.validateSession(sessionId);
    if (!userId) {
        res.status(401).json({ error: "Unauthorized." });
        return;
    }
    const user = DataStore.users.get(userId);
    if (!user) {
        res.status(404).json({ error: "User not found." });
        return;
    }
    user.deleteAccount();
    DataStore.users.delete(userId);
    DataStore.profiles.delete(userId);
    authService.invalidateSession(sessionId);
    res.json({ message: "Account deleted." });
}

export function followUser(req: Request, res: Response): void {
    const sessionId = req.headers["x-session-id"] as string;
    const followerId = authService.validateSession(sessionId);
    if (!followerId) {
        res.status(401).json({ error: "Unauthorized." });
        return;
    }
    const targetUserId = req.params["targetUserId"] as string;
    const follow = userService.followUser(followerId, targetUserId);
    if (!follow) {
        res.status(400).json({ error: "Cannot follow this user." });
        return;
    }
    res.json({ followerId: follow.getFollowerId(), followingId: follow.getFollowingId() });
}

export function unfollowUser(req: Request, res: Response): void {
    const sessionId = req.headers["x-session-id"] as string;
    const followerId = authService.validateSession(sessionId);
    if (!followerId) {
        res.status(401).json({ error: "Unauthorized." });
        return;
    }
    const targetUserId = req.params["targetUserId"] as string;
    const success = userService.unfollowUser(followerId, targetUserId);
    if (!success) {
        res.status(404).json({ error: "Follow relationship not found." });
        return;
    }
    res.json({ message: "Unfollowed successfully." });
}

export function getProfile(req: Request, res: Response): void {
    const userId = req.params["userId"] as string;
    const profile = DataStore.profiles.get(userId);
    if (!profile) {
        res.status(404).json({ error: "Profile not found." });
        return;
    }
    res.json({ userId: profile.getUserId(), bio: profile.getBio(), profilePicture: profile.getProfilePicture() });
}

export function updateProfile(req: Request, res: Response): void {
    const sessionId = req.headers["x-session-id"] as string;
    const userId = authService.validateSession(sessionId);
    if (!userId) {
        res.status(401).json({ error: "Unauthorized." });
        return;
    }
    const { bio, profilePicture } = req.body as { bio?: string; profilePicture?: string };
    const profile = userService.updateProfile(userId, bio ?? "", profilePicture ?? "");
    if (!profile) {
        res.status(404).json({ error: "Profile not found." });
        return;
    }
    res.json({ userId: profile.getUserId(), bio: profile.getBio(), profilePicture: profile.getProfilePicture() });
}

export function getNotifications(req: Request, res: Response): void {
    const sessionId = req.headers["x-session-id"] as string;
    const userId = authService.validateSession(sessionId);
    if (!userId) {
        res.status(401).json({ error: "Unauthorized." });
        return;
    }
    const notifications = Array.from(DataStore.notifications.values())
        .filter(n => n.getUserId() === userId)
        .map(n => ({ id: n.getId(), type: n.getType(), message: n.getMessage() }));
    res.json(notifications);
}
