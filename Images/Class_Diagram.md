# Class Diagram - MeetO Social Media Platform

<img width="644" height="730" alt="Screenshot 2026-04-13 at 9 47 13 PM" src="https://github.com/user-attachments/assets/5b17f1b1-9518-4862-b57b-21d1950809ac" />

## Class Structure

The UML class diagram represents the MeetO social media system architecture. The User class is the central component with relationships to all other domain classes.

### Core Classes:

**User**
- Attributes: id, username, email, passwordHash, profileId, createdAt
- Methods: getId(), getUsername(), getEmail(), setUsername(), setEmail(), toJSON()
- Relationships: Has one Profile, Creates many Posts, Writes many Comments, Gives many Likes, Has Follow relationships, Sends/Receives Messages, Receives Notifications

**Profile**
- Attributes: id, userId, bio, avatarUrl, updatedAt
- Methods: getBio(), getAvatarUrl(), setBio(), setAvatarUrl(), toJSON()
- Relationship: Belongs to one User

**Post**
- Attributes: id, userId, content, imageUrl, likeCount, commentCount, createdAt, updatedAt
- Methods: getContent(), setContent(), incrementLikeCount(), decrementLikeCount(), incrementCommentCount(), decrementCommentCount(), toJSON()
- Relationships: Belongs to User, Has many Comments, Has many Likes

**Comment**
- Attributes: id, postId, userId, content, createdAt
- Methods: getContent(), setContent(), toJSON()
- Relationships: Belongs to Post, Written by User

**Like**
- Attributes: id, postId, userId, createdAt
- Methods: getId(), getPostId(), getUserId(), toJSON()
- Relationships: Belongs to Post, Given by User

**Follow**
- Attributes: id, followerId, followeeId, createdAt
- Methods: getFollowerId(), getFolloweeId(), toJSON()
- Relationship: Connects two Users

**Message**
- Attributes: id, senderId, receiverId, content, createdAt
- Methods: getContent(), toJSON()
- Relationship: Sent by User, Received by User

**Notification**
- Attributes: id, userId, actorId, type (like/comment/follow), targetId, isRead, createdAt
- Methods: markAsRead(), toJSON()
- Relationship: Received by User, Triggered by Actor User

**Feed**
- Relationship: Generated for User based on followed users' posts

**AuthService**
- Manages user authentication, JWT tokens, and sessions

### Architecture Layers:
- **Models**: Domain entities (User, Post, Comment, etc.)
- **Services**: Business logic (UserService, PostService, etc.)
- **Controllers**: HTTP request handlers
- **Repositories**: Data access layer
- **Infrastructure**: EventBus, Redis Cache, BullMQ Queue
