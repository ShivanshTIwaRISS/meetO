# MeetO - Architecture Diagrams

## 1. ER Diagram

```mermaid
erDiagram
    USER ||--o| PROFILE : has
    USER ||--o{ POST : creates
    USER ||--o{ COMMENT : writes
    USER ||--o{ LIKE : gives
    USER ||--o{ FOLLOW : "follows/followed_by"
    USER ||--o{ MESSAGE : "sends/receives"
    USER ||--o{ NOTIFICATION : receives
    POST ||--o{ COMMENT : has
    POST ||--o{ LIKE : receives
    
    USER {
        string id PK
        string username
        string email
        string passwordHash
        string profileId
        date createdAt
    }
    
    PROFILE {
        string id PK
        string userId FK
        string bio
        string avatarUrl
        date updatedAt
    }
    
    POST {
        string id PK
        string userId FK
        string content
        string imageUrl
        int likeCount
        int commentCount
        date createdAt
        date updatedAt
    }
    
    COMMENT {
        string id PK
        string postId FK
        string userId FK
        string content
        date createdAt
    }
    
    LIKE {
        string id PK
        string postId FK
        string userId FK
        date createdAt
    }
    
    FOLLOW {
        string id PK
        string followerId FK
        string followeeId FK
        date createdAt
    }
    
    MESSAGE {
        string id PK
        string senderId FK
        string receiverId FK
        string content
        date createdAt
    }
    
    NOTIFICATION {
        string id PK
        string userId FK
        string actorId FK
        string type
        string targetId
        boolean isRead
        date createdAt
    }
```

## 2. Use Case Diagram

```mermaid
graph TB
    USER((User))
    
    subgraph "Authentication"
        REGISTER[Register]
        LOGIN[Login]
        LOGOUT[Logout]
    end
    
    subgraph "Profile"
        VIEW_PROFILE[View Profile]
        UPDATE_PROFILE[Update Profile]
    end
    
    subgraph "Posts"
        CREATE_POST[Create Post]
        VIEW_POST[View Post]
        EDIT_POST[Edit Post]
        DELETE_POST[Delete Post]
    end
    
    subgraph "Interactions"
        LIKE_POST[Like Post]
        UNLIKE_POST[Unlike Post]
        ADD_COMMENT[Add Comment]
        EDIT_COMMENT[Edit Comment]
        DELETE_COMMENT[Delete Comment]
    end
    
    subgraph "Social"
        FOLLOW_USER[Follow User]
        UNFOLLOW_USER[Unfollow User]
        VIEW_FEED[View Feed]
    end
    
    subgraph "Messaging"
        SEND_MESSAGE[Send Message]
        VIEW_MESSAGES[View Messages]
    end
    
    subgraph "Notifications"
        VIEW_NOTIFICATIONS[View Notifications]
        MARK_READ[Mark as Read]
    end
    
    USER --> REGISTER
    USER --> LOGIN
    USER --> LOGOUT
    USER --> VIEW_PROFILE
    USER --> UPDATE_PROFILE
    USER --> CREATE_POST
    USER --> VIEW_POST
    USER --> EDIT_POST
    USER --> DELETE_POST
    USER --> LIKE_POST
    USER --> UNLIKE_POST
    USER --> ADD_COMMENT
    USER --> EDIT_COMMENT
    USER --> DELETE_COMMENT
    USER --> FOLLOW_USER
    USER --> UNFOLLOW_USER
    USER --> VIEW_FEED
    USER --> SEND_MESSAGE
    USER --> VIEW_MESSAGES
    USER --> VIEW_NOTIFICATIONS
    USER --> MARK_READ
```

## 3. System Architecture

```mermaid
graph TB
    subgraph "Frontend"
        REACT[React App<br/>Vite + TypeScript]
    end
    
    subgraph "Backend"
        EXPRESS[Express Server<br/>Port 5001]
        AUTH_MW[Auth Middleware<br/>JWT]
        CONTROLLERS[Controllers]
        SERVICES[Services]
        REPOS[Repositories]
    end
    
    subgraph "Infrastructure"
        REDIS[(Redis<br/>Cache + Queue)]
        EVENTBUS[Event Bus]
        QUEUE[BullMQ Queue]
    end
    
    REACT -->|HTTP/REST| EXPRESS
    EXPRESS --> AUTH_MW
    AUTH_MW --> CONTROLLERS
    CONTROLLERS --> SERVICES
    SERVICES --> REPOS
    SERVICES --> EVENTBUS
    SERVICES --> REDIS
    EVENTBUS --> QUEUE
    QUEUE --> REDIS
```

## 4. Backend Architecture

```mermaid
graph LR
    subgraph "Controllers"
        AC[AuthController]
        UC[UserController]
        PC[PostController]
        CC[CommentController]
        LC[LikeController]
        FC[FollowController]
        FEEDC[FeedController]
        NC[NotificationController]
        MC[MessageController]
        PRC[ProfileController]
    end
    
    subgraph "Services"
        US[UserService]
        PS[PostService]
        CS[CommentService]
        LS[LikeService]
        FS[FollowService]
        FEEDS[FeedService]
        NS[NotificationService]
        MS[MessageService]
        PRS[ProfileService]
    end
    
    subgraph "Models"
        USER_M[User]
        POST_M[Post]
        COMMENT_M[Comment]
        LIKE_M[Like]
        FOLLOW_M[Follow]
        MESSAGE_M[Message]
        NOTIF_M[Notification]
        PROFILE_M[Profile]
    end
    
    AC --> US
    UC --> US
    PC --> PS
    CC --> CS
    LC --> LS
    FC --> FS
    FEEDC --> FEEDS
    NC --> NS
    MC --> MS
    PRC --> PRS
    
    US --> USER_M
    PS --> POST_M
    CS --> COMMENT_M
    LS --> LIKE_M
    FS --> FOLLOW_M
    MS --> MESSAGE_M
    NS --> NOTIF_M
    PRS --> PROFILE_M
```

## 5. API Endpoints

```mermaid
graph TB
    subgraph "Auth - Public"
        REG[POST /api/auth/register]
        LOG[POST /api/auth/login]
        LOGOUT[POST /api/auth/logout]
        ME[GET /api/auth/me]
    end
    
    subgraph "Users - Protected"
        GET_USERS[GET /api/users]
        GET_USER[GET /api/users/:id]
        UPDATE_USER[PUT /api/users/:id]
        DELETE_USER[DELETE /api/users/:id]
    end
    
    subgraph "Profiles - Protected"
        GET_PROFILE[GET /api/profiles/:userId]
        UPDATE_PROFILE[PUT /api/profiles/:userId]
    end
    
    subgraph "Posts - Protected"
        GET_POSTS[GET /api/posts]
        CREATE_POST[POST /api/posts]
        GET_POST[GET /api/posts/:id]
        UPDATE_POST[PUT /api/posts/:id]
        DELETE_POST[DELETE /api/posts/:id]
        USER_POSTS[GET /api/users/:userId/posts]
    end
    
    subgraph "Comments - Protected"
        GET_COMMENTS[GET /api/posts/:postId/comments]
        ADD_COMMENT[POST /api/posts/:postId/comments]
        UPDATE_COMMENT[PUT /api/comments/:id]
        DELETE_COMMENT[DELETE /api/comments/:id]
    end
    
    subgraph "Likes - Protected"
        LIKE[POST /api/posts/:postId/like]
        UNLIKE[DELETE /api/posts/:postId/like]
    end
    
    subgraph "Follow - Protected"
        FOLLOW[POST /api/users/:id/follow]
        UNFOLLOW[DELETE /api/users/:id/follow]
        CHECK_FOLLOW[GET /api/users/:id/following]
    end
    
    subgraph "Feed - Protected"
        GET_FEED[GET /api/feed]
        REFRESH_FEED[POST /api/feed/refresh]
    end
    
    subgraph "Notifications - Protected"
        GET_NOTIFS[GET /api/notifications]
        MARK_READ[PUT /api/notifications/:id/read]
    end
    
    subgraph "Messages - Protected"
        GET_PARTNERS[GET /api/messages]
        SEND_MSG[POST /api/messages]
        GET_CONV[GET /api/messages/:userId]
    end
```

## 6. Event-Driven Architecture

```mermaid
graph LR
    subgraph "Publishers"
        POST_SVC[PostService]
        LIKE_SVC[LikeService]
        COMMENT_SVC[CommentService]
        FOLLOW_SVC[FollowService]
    end
    
    EVENTBUS[Event Bus]
    
    subgraph "Subscribers"
        NOTIF_SUB[NotificationSubscriber]
    end
    
    QUEUE[Notification Queue]
    NOTIF_SVC[NotificationService]
    
    POST_SVC -->|post.created| EVENTBUS
    LIKE_SVC -->|post.liked| EVENTBUS
    COMMENT_SVC -->|comment.added| EVENTBUS
    FOLLOW_SVC -->|user.followed| EVENTBUS
    
    EVENTBUS --> NOTIF_SUB
    NOTIF_SUB --> QUEUE
    QUEUE --> NOTIF_SVC
```

## 7. Feed Strategy Pattern

```mermaid
classDiagram
    class FeedStrategy {
        <<interface>>
        +generateFeed(userId, limit) Post[]
    }
    
    class ChronologicalStrategy {
        +generateFeed(userId, limit) Post[]
    }
    
    class PopularFeedStrategy {
        +generateFeed(userId, limit) Post[]
    }
    
    class HybridFeedStrategy {
        +generateFeed(userId, limit) Post[]
    }
    
    class FeedService {
        -strategy: FeedStrategy
        +getFeed(userId, limit)
        +refreshFeed(userId)
    }
    
    FeedStrategy <|.. ChronologicalStrategy
    FeedStrategy <|.. PopularFeedStrategy
    FeedStrategy <|.. HybridFeedStrategy
    FeedService --> FeedStrategy
```

---

## Features Implemented

### Authentication
- User Registration
- User Login
- JWT Token Authentication
- Logout

### Profile Management
- View User Profile
- Update Profile (bio, avatar)
- Update Account Details

### Posts
- Create Post (with image)
- View All Posts
- View Single Post
- Edit Post
- Delete Post
- View User's Posts

### Social Interactions
- Like/Unlike Post
- Add Comment
- Edit Comment
- Delete Comment
- Follow/Unfollow User
- Check Following Status

### Feed
- Personalized Feed Generation
- Multiple Feed Strategies (Chronological, Popular, Hybrid)
- Refresh Feed

### Notifications
- Like Notifications
- Comment Notifications
- Follow Notifications
- Mark as Read

### Messaging
- Send Direct Message
- View Conversation
- View Chat Partners

### Infrastructure
- Event-Driven Architecture
- Background Job Queue (BullMQ)
- Redis Caching
- Rate Limiting
- Error Handling
- Request Logging

---

## Tech Stack

**Frontend:** React 19, TypeScript, Vite, React Router, Axios

**Backend:** Node.js, Express 5, TypeScript

**Database:** MongoDB

**Cache & Queue:** Redis, ioredis, BullMQ

**Auth:** JWT, bcryptjs
