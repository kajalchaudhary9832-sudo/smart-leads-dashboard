# Smart Leads Dashboard

Full-stack Lead Management Dashboard built using MERN Stack with TypeScript.

## Tech Stack

Frontend: React, TypeScript, TailwindCSS  
Backend: Node.js, Express.js, TypeScript  
Database: MongoDB, Mongoose  
Auth: JWT, bcrypt

## Features

- User Register/Login
- JWT Authentication
- Protected Routes
- Create Lead
- View Leads
- Update Lead Status
- Delete Lead
- Search by Name/Email
- Filter by Status
- Filter by Source
- Sort Latest/Oldest
- Pagination
- CSV Export
- Responsive Dashboard UI

## Backend Setup

```bash
cd server
npm install
npm run dev
```

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

## Environment Variables

Create `.env` file inside server folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## API Endpoints

### Auth

POST `/api/auth/register`  
POST `/api/auth/login`

### Leads

GET `/api/leads`  
POST `/api/leads`  
PUT `/api/leads/:id`  
DELETE `/api/leads/:id`

## Author

Tushar Attri