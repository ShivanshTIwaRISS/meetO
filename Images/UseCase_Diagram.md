# Use Case Diagram - MeetO Social Media Platform

<img width="700" height="690" alt="Screenshot 2026-04-13 at 9 42 28 PM" src="https://github.com/user-attachments/assets/75cffc55-f045-4d7e-a435-f96e8d75e5f6" />

## System Use Cases

The Use Case Diagram shows all interactions between the User (actor) and the MeetO social media system. The rectangle represents the system boundary containing all available features.

### Actor: User

### Use Cases by Category:

**1. Authentication**
- Register Account
- Login
- Logout
- Get Profile Info (Me)

**2. Profile Management**
- View Profile
- Update Profile (bio, avatar)
- Update Account Details
- Delete Account

**3. Post Management**
- Create Post (with image)
- View All Posts
- View Single Post
- Edit Post
- Delete Post
- View User's Posts

**4. Social Interactions**
- Like Post
- Unlike Post
- Add Comment
- Edit Comment
- Delete Comment
- Follow User
- Unfollow User
- Check Following Status

**5. Feed & Discovery**
- View Personalized Feed
- Refresh Feed
- Explore Posts

**6. Messaging**
- Send Direct Message
- View Conversation
- View Chat Partners

**7. Notifications**
- View Notifications (like, comment, follow)
- Mark Notification as Read

### System Features:
- JWT-based Authentication
- Real-time Notifications via Event Bus
- Multiple Feed Strategies (Chronological, Popular, Hybrid)
- Background Job Processing with BullMQ
- Redis Caching for Performance
