import { Router } from "express";
import { register, login, logout, updateAccount, deleteAccount, followUser, unfollowUser, getProfile, updateProfile, getNotifications } from "../controllers/UserController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/account", updateAccount);
router.delete("/account", deleteAccount);
router.post("/follow/:targetUserId", followUser);
router.delete("/follow/:targetUserId", unfollowUser);
router.get("/:userId/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/notifications", getNotifications);

export default router;
