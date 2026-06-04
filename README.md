# AI Customer Support Ticket Analyzer

Full-stack AI-powered support ticket management system built with Angular, Node.js, Express.js, MongoDB, JWT authentication, role-based access, AI ticket analysis, and chatbot support.

## Features

- User registration and login
- JWT authentication
- Role-based access for user, support, and admin
- Create and manage support tickets
- Ticket replies
- AI ticket category detection
- AI priority detection
- Sentiment analysis
- AI summary and suggested reply
- AI chatbot support
- Create ticket from chatbot
- Admin/support ticket management
- Assign ticket to support/admin
- Search, filter, and pagination

## Tech Stack

Frontend:
- Angular
- TypeScript
- Angular Router
- Angular Forms
- HTTP Interceptor
- CSS

Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Run Backend

cd backend
npm install
npm run dev

## Run Frontend

cd frontend
npm install
ng serve

## Environment Variables

Create a .env file inside backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d

## Note

This project currently uses rule-based AI logic for ticket analysis and chatbot responses. It can be upgraded with OpenAI or Gemini API for LLM-based responses.
