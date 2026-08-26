# Insta Clone

## Database Design

### 1. users

- avatar
- username
- email
- password
- isEmailVerified
- emailVerificationToken
- emailVerificationExpiry
- resetPasswordToken
- resetPasswordTokenExpiry
- refreshToken
- createdAt
- updateAt

### 2. posts

- caption
- description
- mediaUrl
- mediaType
- thumbnailUrl
- userId
- createdAt
- updateAt

### 3. postStats

- postId
- viewsCount
- likesCount
- commentsCount
- sharesCount
- savesCount
- watchTime
- createdAt
- updateAt

### 4. follows

- follower
- followee
- status
- createdAt
- updateAt

### 5. comments

- userId
- postId
- content
- createdAt
- updateAt

### 6. likes

- userId
- postId
- createdAt
- updateAt

### 7. saves

- userId
- postId
- content
- createdAt
- updateAt

### 8. share post

- sharedBy
- sharedTo
- postId
- content
- createdAt
- updateAt

## Features

### Authentication

- login
- register
- logout
- token blacklisting
- account verification
- password reset
- forgot password

### post

- create post
- get a post
- feed
- get all posts
- delete post
- update post
- save a post

### comment

- post a comment
- delete comment
- like on comment
- comment reply
- edit comment
- see all comments

### like

- like/unlike a post

### follow

- follow/unfollow a user
