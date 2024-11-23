# Pencraft Backend

The backend of **Pencraft** is a RESTful API built with **Node.js** and **Express.js**. It handles user authentication, blog post management, and AI summarization using the Gemini API.

---

## Features

- JWT-based secure authentication.
- RESTful routes for managing posts and users.
- Proxy for secure communication with the Gemini API.
- MongoDB for database storage.

---

## Technologies Used

- **Framework**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **API Integration**: Gemini API for generative summarization.

---

## Setup Instructions

### Prerequisites
- Node.js (16+)
- MongoDB instance
- Gemini API Key

### Environment Variables
Create a `.env` file in the root directory with the following values:

```plaintext
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mounicasruthi/pencraft-backend.git
   cd pencraft-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. The API will be available at [http://localhost:5000](http://localhost:5000).

---

## Available Routes

### Authentication (`/auth`)
- `POST /signup`: Register a new user.
- `POST /login`: Authenticate a user and return a JWT.

### Posts (`/posts`)
- `GET /`: Retrieve all posts.
- `POST /`: Create a new post (requires JWT).
- `GET /:id`: Retrieve a specific post by ID.
- `GET /users/me/posts`:  Get all posts created by the currently logged-in user.

### AI Summarization (`/gemini/summarize`)
- `POST /`: Summarize content using the Gemini API.

---

## Key Functionalities

### AI Summarization
Summarization requests are proxied through the `/gemini/summarize` route, ensuring secure API key usage.

### Database Schemas
- **User**: Stores username, email, password hash, and optional profile images.
- **Post**: Stores post title, content, author reference, and timestamps.

---

## Future Enhancements

- Rate Limiting and Throttling - Protect sensitive routes like login and summarization with rate limiting and IP-based request throttling.
- Advanced Caching Mechanisms - Use Redis for caching frequently accessed posts and summaries to improve performance.
- Enhanced User Profiles - Add bio, social links, and activity metrics with options for profile customization.
- Real-Time Features - Enable live notifications and collaborative post editing using WebSockets or SSE.
- Improved AI Integration - Expand AI tools for multi-language summarization and advanced features like keyword extraction.

---
