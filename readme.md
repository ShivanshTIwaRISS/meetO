# meetO

> A full-stack social media platform built from the ground up using System Design principles, OOP concepts, Design Patterns, and SOLID principles.

---

## Project Overview

**meetO** is a feature-rich social networking application that allows users to connect, share posts, follow each other, interact through comments and likes, send direct messages, and receive real-time notifications. The platform is designed with scalability, maintainability, and clean architecture at its core — making it a showcase of modern software engineering practices.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React (TypeScript), Vite, TailwindCSS |
| **Backend** | Node.js, Express.js (TypeScript) |
| **Database** | MongoDB (via ORM) |
| **Authentication** | JWT (JSON Web Tokens) |
| **Build Tools** | Vite (frontend), tsc (backend) |
| **Version Control** | GitHub |

---

## Project Structure

```
meetO/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── AuthController.ts
│   │   │   ├── UserController.ts
│   │   │   ├── PostController.ts
│   │   │   ├── CommentController.ts
│   │   │   ├── LikeController.ts
│   │   │   ├── FollowController.ts
│   │   │   ├── FeedController.ts
│   │   │   ├── MessageController.ts
│   │   │   ├── NotificationController.ts
│   │   │   └── ProfileController.ts
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
└── README.md
```

---

## Features

### Authentication & User Management
- Register / Login / Logout
- JWT-based session management with expiry
- Password hashing and secure auth flow
- Account deletion

### Profile
- View and edit bio
- Update profile picture
- View followers and following lists

### Posts
- Create posts with media (images)
- Edit and delete posts
- View post details with like and comment counts

### Likes
- Like / Unlike posts
- Like count tracked per post

### Comments
- Add, edit, delete comments on any post
- Comment count tracked per post

### Follow System
- Follow / Unfollow users
- Check follow status between users
- Follower and following count on profiles

### Feed
- Feed refresh and pagination

### Direct Messages
- Send messages to other users
- Delete messages
- Fetch full conversation history

### Notifications
- Receive notifications for likes, comments, and follows
- Mark notifications as read
- Get all notifications for a user

---

## Setup & Installation

> The application currently runs locally. Ensure you have the required tools installed before proceeding.

### Prerequisites
- Node.js (v18 or above)
- npm or yarn
- MongoDB running locally

### 1. Clone the Repository
```bash
git clone https://github.com/Vaageesh-Git/meetO.git
cd meetO
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:
```env
PORT=5000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_URL=your_cloudinary_url
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:5173` and the backend at `http://localhost:5000`.

> **Note:** The project is currently running locally. Deployment to a production environment is planned after Milestone 1 is complete.

---

## Architecture Explanation

meetO follows a **layered MVC (Model-View-Controller)** architecture with a clear separation of concerns:

```
Client (React) -> Routes -> Controllers -> Services -> Models -> Database
```

- **Controllers** handle incoming HTTP requests and delegate to Services
- **Services** contain all core business logic
- **Models** define data schemas and handle database interaction
- **Middleware** handles authentication guards, error handling, and request validation
- **Routes** map API endpoints to their corresponding controllers

This structure ensures each layer has a single responsibility, making the system easy to test, extend, and maintain.

---

## System Design Principles Applied

### 1. Scalability
- **Stateless REST API**: The backend is stateless (JWT-based auth), making it horizontally scalable. Multiple server instances can run behind a load balancer without shared session state.
- **Feed Generation**: The `FeedController` uses a fan-out or pull model to serve personalized feeds efficiently, avoiding full table scans.
- **Pagination**: All list endpoints (feed, comments, notifications) are paginated to limit data transfer and database load.

### 2. Separation of Concerns
Each feature (Auth, Post, Comment, Follow, etc.) has its own dedicated Controller, Service, and Model with no cross-contamination of business logic.

### 3. Database Design (ER Model)
Normalized relational design with proper use of Primary Keys (PK) and Foreign Keys (FK) across all entities: User, Post, Comment, Like, Follow, Profile, Message, and Notification. Relationships are clearly mapped — User to Post (1:N), Post to Comment (1:N), User to Follow (M:N), User to Like (M:N).

### 4. Security
- Passwords stored as hashed values (`passwordHash` field), never in plain text
- Auth middleware protects all private routes
- Session tokens carry an expiry timestamp

---

## OOP Concepts Used

| Concept | Where Applied |
|---|---|
| **Encapsulation** | Each class (User, Post, Comment, etc.) hides internal state and exposes only necessary methods |
| **Abstraction** | Services abstract database logic away from controllers; controllers have no knowledge of how data is fetched |
| **Inheritance** | Base controller and service classes define shared logic; specific controllers extend them |
| **Polymorphism** | Notification types (Like, Comment, Follow) are handled polymorphically through a common `sendNotification()` interface |

---

## Design Patterns Implemented

### 1. Factory Pattern
Used in notification creation. Instead of manually instantiating notification objects for each type (Like, Comment, Follow), a `NotificationFactory` creates the appropriate object based on the event type. This decouples notification creation logic from the controller.

```typescript
const notification = NotificationFactory.create(type, payload);
```

### 2. Observer Pattern
Used in the Feed and Notification system. When a user creates a post, likes, or follows, registered observers are notified and trigger feed updates or notification dispatch. Implemented via an event-emitter pattern internally.

```typescript
eventEmitter.emit('post:created', { userId, postId });
feedService.onPostCreated(handler);
notificationService.onPostCreated(handler);
```

### 3. Singleton Pattern
Used for the database connection pool and the auth service. A single shared instance is maintained across the entire application, preventing redundant connections and inconsistent state.

### 4. Chain of Responsibility (Middleware)
The Express middleware stack acts as a chain of responsibility. Each incoming request passes through authentication guards, request validation, and error handlers in sequence before reaching a controller.

---

## SOLID Principles

### S - Single Responsibility Principle
Every class has one clearly defined job. `AuthController` only handles login, register, and logout. `FeedController` only handles feed generation. `NotificationService` only manages notification dispatch.

### O - Open/Closed Principle
New notification types or post types can be added by extending existing classes and interfaces without modifying the core logic. The factory and observer patterns make this extensible by design.

### L - Liskov Substitution Principle
Any notification subtype (LikeNotification, CommentNotification, FollowNotification) can be used wherever a base `Notification` is expected without breaking the system's behavior.

### I - Interface Segregation Principle
Controllers and services implement focused interfaces. For example, `IFollowService` only declares follow-related methods (`follow`, `unfollow`, `isFollowing`) rather than a broad all-purpose interface.

### D - Dependency Inversion Principle
Controllers depend on service interfaces, not concrete implementations. Services depend on repository and model abstractions, not directly on database drivers. This makes unit testing straightforward and swapping implementations possible without touching higher-level code.

---

## UML Diagrams

### Use Case Diagram
The single actor (User) interacts with the following use cases: Authentication, Profile, Post, Comment, Like, Follow, Feed, Receive Notification, and Message.

### Class Diagram
Key classes and their relationships:
- User <-> Profile (1:1)
- User -> Post (1:N)
- Post -> Comment (1:N)
- Post -> Like (1:N)
- User -> Follow (M:N self-referential)
- User <-> Message (M:N via senderId/receiverId)
- User -> Notification (1:N)
- User -> Feed (via FeedService)
- AuthService handles session lifecycle

### ER Diagram

| Entity | PK | FKs |
|---|---|---|
| User | userId | — |
| Profile | profileId | userId |
| Post | postId | userId |
| Comment | commentId | postId, userId |
| Like | likeId | postId, userId |
| Follow | followId | followerId, followingId |
| Message | messageId | senderId, receiverId |
| Notification | notificationId | userId |

### Sequence Diagram - Post Creation Flow

```
User -> Frontend -> POST /api/posts -> AuthMiddleware -> PostController
                                                               |
                                                         PostService
                                                               |
                                                        PostModel (DB Write)
                                                               |
                                               FeedService (update follower feeds)
                                                               |
                                          NotificationService (notify followers)
                                                               |
                                               Response: 201 Created -> User
```

---

## Test Cases

| Feature | Test Case | Expected Result |
|---|---|---|
| Register | Valid new user data | 201 Created + JWT returned |
| Register | Duplicate email | 409 Conflict |
| Login | Valid credentials | 200 OK + JWT |
| Login | Wrong password | 401 Unauthorized |
| Create Post | Authenticated user with caption | 201 Created |
| Create Post | Unauthenticated request | 401 Unauthorized |
| Like Post | Like a post | likeCount + 1 |
| Unlike Post | Unlike an already liked post | likeCount - 1 |
| Follow User | Follow a new user | 200 OK, isFollowing = true |
| Unfollow | Unfollow a followed user | 200 OK, isFollowing = false |
| Send Message | Valid sender + receiver | 201 Created |
| Feed | Fetch feed for user with followings | Returns posts from followed users |
| Notification | Like event triggers | Notification created for post owner |

---

## Team Members & Contributions

| Name | Contribution |
|---|---|
| Vaageesh | Overall system architecture and design, defined the layered MVC structure, designed all class hierarchies and relationships, implemented backend controllers and service layer, applied SOLID principles across the codebase, led the use of Factory and Observer design patterns |
| Shivansh | Frontend development using React and TypeScript, implemented component-based architecture (Abstraction and Encapsulation in UI layer), handled client-side routing and state management, ensured separation of concerns between UI and business logic |
| Arun | Designed the complete ER diagram and relational database schema, normalized database structure to eliminate redundancy, defined all primary key and foreign key relationships, integrated ORM for model-to-database mapping, contributed to the UML class diagram |
| Pratham | Designed and implemented the authentication and session management system, applied the Singleton pattern for auth service, built middleware pipeline using Chain of Responsibility pattern, implemented JWT-based stateless auth to support horizontal scalability |
| Nav | Designed the Feed generation system using fan-out model, implemented the Notification system using the Observer pattern and event-driven architecture, integrated real-time updates via WebSockets, wrote and documented test cases covering all major features |

---

## Deployment

The project is currently running on local machines. All five team members can run the application locally by following the setup instructions above. Production deployment — including cloud hosting, environment configuration, and CI/CD pipeline setup — is planned as part of Milestone 2, once Milestone 1 is reviewed and approved.

---

## Future Enhancements

- Caching layer (Redis) for feed and session data
- CDN integration for fast media delivery
- Search functionality for users and posts
- Story feature (24-hour expiring posts)
- Post saves and bookmarks
- Rate limiting to prevent API abuse
- Microservices migration for independent scaling of Feed, Notification, and Messaging services

---

## License

This project is developed for academic purposes as part of a System Design course — 2026
