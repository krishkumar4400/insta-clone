# Social Media Backend

A social media backend inspired by Instagram, built with Node.js, Express, TypeScript, and MongoDB. The project focuses on user authentication, profile management, database design, and building reliable REST APIs.

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Backend Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcryptjs

## Features

### Currently in Development

- User model and database connection
- Environment variable configuration
- Password hashing with bcryptjs
- Password comparison for login
- JWT access and refresh token generation
- User profile fields and privacy settings

### Planned Features

- User registration and login APIs
- User profile management
- Follow and unfollow users
- Create, update, and delete posts
- Like and unlike posts
- Comments and replies
- Save and share posts
- User feed and pagination
- Image uploads
- Private account support
- Post and user statistics

> Features will be marked as completed as they are implemented and tested.

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- [MongoDB](https://www.mongodb.com/) or a MongoDB Atlas account
- Git

### Installation

**1. Clone the repository**

```bash
git clone <your-repository-url>
```

**2. Open the project directory**

```bash
cd <your-project-folder>
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Create a `.env` file in the project root.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/social_media

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=15m

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

NODE_ENV=development
```

Replace the example secrets with strong, randomly generated values.

**5. Start the development server**

Use the development command configured in your `package.json`. For example, if your project has a `dev` script:

```bash
npm run dev
```

> The exact scripts depend on your project configuration. Make sure the script exists in `package.json` before using it.

## Environment Variables

| Variable | Description |
| --- | --- |
| `PORT` | Port used by the Express server |
| `MONGO_URI` | MongoDB connection string |
| `ACCESS_TOKEN_SECRET` | Secret used to sign access tokens |
| `ACCESS_TOKEN_EXPIRY` | Access token lifetime |
| `REFRESH_TOKEN_SECRET` | Secret used to sign refresh tokens |
| `REFRESH_TOKEN_EXPIRY` | Refresh token lifetime |
| `NODE_ENV` | Application environment |

Never commit your `.env` file or expose your secret keys in the repository.

## Project Structure

The backend is organized into separate modules to keep database logic, request handling, and application configuration easy to maintain.

```text
src/
├── config/
│   ├── db.ts
│   └── env.ts
├── models/
│   └── user.model.ts
├── controllers/
├── routes/
├── middlewares/
├── services/
├── utils/
├── app.ts
└── server.ts
```

The structure may change as new features are added.

## Authentication

The project uses JSON Web Tokens for authentication and bcryptjs for password hashing.

- **Access tokens** are used to authenticate protected requests.
- **Refresh tokens** are intended to support issuing new access tokens.
- Passwords are hashed before being stored in the database.

Token expiry, storage, rotation, and revocation will be handled as part of the authentication implementation.

## Database

MongoDB is used to store application data, with Mongoose providing schemas, models, and database operations.

The user model includes fields for:

- Username and email
- Password hash
- Full name and bio
- Profile picture and website
- Account privacy and verification status
- Refresh token storage

Timestamps are enabled to track document creation and updates.

## API Documentation

API documentation will be added as the routes are implemented. Each endpoint will document its HTTP method, path, authentication requirements, request body, response format, and possible errors.

## Security

The project aims to follow these security practices:

- Store password hashes instead of plain-text passwords.
- Keep secrets in environment variables.
- Protect private routes with authentication middleware.
- Validate incoming request data.
- Handle duplicate usernames and email addresses.
- Use appropriate HTTP status codes and error responses.
- Protect sensitive user fields from unauthorized updates.

## Future Improvements

- Automated tests
- API documentation with Swagger/OpenAPI
- Image upload and media processing
- Efficient feed generation and cursor pagination
- Better database indexing
- Refresh token rotation and session management
- Rate limiting and additional security controls
- Docker-based development and deployment

## License

A license has not been selected yet. Add a `LICENSE` file before distributing the project under specific reuse terms.

---

Built as a hands-on backend engineering project to learn API development, authentication, database modeling, and scalable application design.
