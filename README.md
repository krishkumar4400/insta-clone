# Insta Clone

## Core Features

### MVP

👤 **Authentication**

- Signup
- Login
- Logout
- JWT authentication
- Password hashing (bcrypt)
- Email verification (optional)

👤 **User Profile**

- Profile photo
- Bio
- Followers / Following
- Edit profile
- View other users

📸 **Posts**

- Upload image/video
- Caption
- Like post
- Delete post
- View post

❤️ **Engagement**

- Like / Unlike
- Comments
- Reply to comments

📰 **Feed**

- Show posts from followed users
- Infinite scrolling
- Sorting by latest

🔍 **Search**

- Search users
- Search hashtags

👥 **Follow System**

- Follow user
- Unfollow user
- Followers list
- Following list

🔔 **Notifications**

- Someone liked your post
- Someone followed you
- Someone commented

### Advanced Features

- Stories
- Reels
- Real-time chat
- Typing indicators
- Push notifications
- Save posts
- Tag users
- Hashtags
- Explore page
- AI recommendation feed

### Tech Stack

Frontend

- React
- Tailwind CSS
- Redux / Zustand
- React Query

Backend

- Node.js
- Express.js

Database

- MongoDB

Media Storage

- Cloudinary
- AWS S3

Authentication

- JWT
- Cookies

Real-time

- Socket.io

Deployment

- Frontend → Vercel
- Backend → Render / AWS / Railway
- Database → MongoDB Atlas

## Database Design

***Users***

```json
users
{
  "_id": "ObjectId",
  "username": "krish",
  "email": "krish@gmail.com",
  "passwordHash": "hashed_password",
  "fullName": "Krish Kumar",
  "bio": "Software Engineer",
  "profilePicture": "url",
  "website": "optional",
  "isPrivate": false,
  "isVerified": false,
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

Indexes

```code
username (unique)
email (unique)
```

***user stats***

```json
user_stats
{
  _id: ObjectId,
  userId: ObjectId,
  followersCount: 120,
  followingCount: 90,
  postsCount: 34
}
```

***Follows Collection***

```json
follows
{
  _id: ObjectId,
  followerId: ObjectId,
  followingId: ObjectId,
  createdAt: Date
}
```

Indexes
followerId
followingId
followerId + followingId (unique)

***Posts***

```json
posts
{
  _id: ObjectId,
  userId: ObjectId,
  caption: "Beautiful sunset",
  location: "Delhi",
  mediaType: "image",
  mediaUrl: "cloudinary_url",
  createdAt: Date,
  updatedAt: Date
}
```

indexes
userId
createdAt

***post stats***
```json
post_stats
{
  _id: ObjectId,
  postId: ObjectId,
  likesCount: 230,
  commentsCount: 45,
  sharesCount: 12
}
```

***like***

```json
likes
{
  _id: ObjectId,
  userId: ObjectId,
  postId: ObjectId,
  createdAt: Date
}
```

index
postId
userId
postId + userId (unique)

***Comments***

```json
comments
{
  _id: ObjectId,
  postId: ObjectId,
  userId: ObjectId,
  text: "Nice photo!",
  parentCommentId: ObjectId | null,
  createdAt: Date
}
```

***Notifications***

```json
notifications
{
  _id: ObjectId,
  recipientId: ObjectId,
  senderId: ObjectId,
  type: "like" | "comment" | "follow",
  postId: ObjectId | null,
  isRead: false,
  createdAt: Date
}
```

***stories***
```json
stories
{
  _id: ObjectId,
  userId: ObjectId,
  mediaUrl: "url",
  mediaType: "image",
  expiresAt: Date,
  createdAt: Date
}
```

***messages***

```json
messages
{
  _id: ObjectId,
  conversationId: ObjectId,
  senderId: ObjectId,
  text: "Hello",
  mediaUrl: null,
  createdAt: Date
}
```

***conversation***
```json
conversations
{
  _id: ObjectId,
  participants: [userId1, userId2],
  createdAt: Date
}
```

**index**
users.username
users.email

posts.userId
posts.createdAt

likes.postId
likes.userId

comments.postId

follows.followerId
follows.followingId

notifications.recipientId

## API Design

***Auth***

```bash
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
```

***Users***

```bash
GET /api/users/:id
PUT /api/users/update
GET /api/users/search
```

***Posts***

```bash
POST /api/posts/create
GET /api/posts/feed
GET /api/posts/:id
DELETE /api/posts/:id
```

***Engagement***

```bash
POST /api/posts/:id/like
POST /api/posts/:id/comment
POST /api/users/:id/follow
```

## Folder Structure

```bash
backend
 ┣ controllers
 ┣ models
 ┣ routes
 ┣ middleware
 ┣ utils
 ┣ config
 ┣ app.js
 ┗ server.js

frontend
 ┣ components
 ┣ pages
 ┣ hooks
 ┣ services (API calls)
 ┣ context / redux
 ┗ App.jsx
```

## System Architecture

```code
Client (React)
      |
      |
API Requests
      |
Node.js / Express
      |
      |
Database (MongoDB)
      |
Media Storage (Cloudinary / S3)
```

## Advanced

- Rate limiting
- JWT refresh tokens
- Redis caching
- Feed algorithm
- Image compression
- Pagination
- Lazy loading
- CDN for images
- Background jobs (BullMQ)
