import { DataStore } from "./DataStore";
import { User } from "../models/User";
import { Profile } from "../models/Profile";
import { Follow } from "../models/Follow";
import { NotificationService } from "./NotificationService";
import { NotificationType } from "../models/Notification";

export class UserService {
    public register(username: string, email: string, passwordHash: string): User {
        const user = User.register(username, email, passwordHash);
        DataStore.users.set(user.getId(), user);

        const profile = new Profile(user.getId(), "", "");
        DataStore.profiles.set(user.getId(), profile);
        
        return user;
    }

    public login(username: string, passwordHashAttempt: string): User | null {
        const user = Array.from(DataStore.users.values()).find(u => u.getUsername() === username);
        if (user && user.login(passwordHashAttempt)) {
            return user;
        }
        return null;
    }

    public updateProfile(userId: string, bio: string, profilePicture: string): Profile | null {
        const profile = DataStore.profiles.get(userId);
        if (profile) {
            if (bio) profile.updateBio(bio);
            if (profilePicture) profile.updateProfilePicture(profilePicture);
            return profile;
        }
        return null;
    }

    public followUser(followerId: string, followingId: string): Follow | null {
        if (followerId === followingId) return null;

        const existingFollow = Array.from(DataStore.followers.values())
            .find(f => f.isFollowing(followerId, followingId));

        if (existingFollow) return existingFollow;

        const user = DataStore.users.get(followerId);
        if (!user) return null;

        const followData = user.follow(followingId);
        const follow = Follow.follow(followData.followerId, followData.followingId);
        DataStore.followers.set(follow.getId(), follow);

        NotificationService.getInstance().notifyUser(followingId, NotificationType.FOLLOW, `User ${followerId} started following you.`);

        return follow;
    }

    public unfollowUser(followerId: string, followingId: string): boolean {
        const follow = Array.from(DataStore.followers.values())
            .find(f => f.isFollowing(followerId, followingId));

        if (follow) {
            DataStore.followers.delete(follow.getId());
            return true;
        }
        return false;
    }
}
