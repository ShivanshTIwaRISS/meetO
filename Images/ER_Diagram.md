# ER Diagram - MeetO Social Media Platform

<img width="674" height="745" alt="Screenshot 2026-04-13 at 9 47 26 PM" src="https://github.com/user-attachments/assets/c8cc64ef-8acd-498b-a511-0e78d2e419e5" />

## Database Schema

The ER diagram represents the MeetO social media database with MongoDB as the primary database. The User entity is central, connected to all other entities.

### Entities & Relationships:

**USER** (Central Entity)
- id (PK), username, email, passwordHash, profileId, createdAt
- Has one PROFILE
- Creates many POSTS
- Writes many COMMENTS
- Gives many LIKES
- Has many FOLLOW relationships (as follower and followee)
- Sends/Receives many MESSAGES
- Receives many NOTIFICATIONS

**PROFILE**
- id (PK), userId (FK), bio, avatarUrl, updatedAt
- Belongs to one USER

**POST**
- id (PK), userId (FK), content, imageUrl, likeCount, commentCount, createdAt, updatedAt
- Belongs to one USER
- Has many COMMENTS
- Has many LIKES

**COMMENT**
- id (PK), postId (FK), userId (FK), content, createdAt
- Belongs to one POST
- Written by one USER

**LIKE**
- id (PK), postId (FK), userId (FK), createdAt
- Belongs to one POST
- Given by one USER

**FOLLOW**
- id (PK), followerId (FK), followeeId (FK), createdAt
- Connects two USERS (follower follows followee)

**MESSAGE**
- id (PK), senderId (FK), receiverId (FK), content, createdAt
- Sent by one USER
- Received by one USER

**NOTIFICATION**
- id (PK), userId (FK), actorId (FK), type (like/comment/follow), targetId, isRead, createdAt
- Received by one USER
- Triggered by one USER (actor)

### Key Features:
- One-to-One: User ↔ Profile
- One-to-Many: User → Posts, User → Comments, User → Likes
- Many-to-Many: User ↔ User (Follow relationship)
- Message: User → User (sender/receiver)
- Notification: User receives from Actor User
