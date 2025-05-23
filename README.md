# Investium

## Overview
Brief description of the system (e.g., "A user investment and wallet management platform").

## Features
- User registration & referral system
- Investment plans with returns
- Secure deposits and withdrawals
- Admin control for transactions

## Tech Stack
- Node.js + Express
- MongoDB (Mongoose ODM)
- Typescript
- [Other tools/frameworks if applicable]

## Folder Structure


├── app/

├── models/
│   └── models.types.ts  # Contains all Mongoose types
├── routes/
├── controllers/
├── services/
├── utils/
└── ...

## Security Practices
- Passwords and sensitive data are hashed
- Role-based access control
- Proof image verification system

## Run Locally
```
npm install
npm run dev
```

## Environment Variables
```
NEXT_PUBLIC_URL="http://localhost:3000"
JWT_SECRET="jwtsecret12345"
NEXT_PUBLIC_VAPID_PUBLIC_KEY="vapidpublickey12345"
VAPID_PRIVATE_KEY="-vapidkey12345"
MONGO_URI="mongodb+srv://hamid6426:<password/>@cluster0.jb1ci76.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
```