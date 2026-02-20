# ExpertConnect - Real-Time Expert Booking System

A premium Real-Time Expert Session Booking System built with the MERN stack.

## Features

- **Expert Discovery**: Search and filter experts by category and name.
- **Real-Time Availability**: Slots update instantly across all clients when booked.
- **Atomic Bookings**: Prevents double bookings using MongoDB atomic updates and unique indexes.
- **My Bookings**: Manage your sessions by email.
- **Premium UI**: Modern dark-themed design with Framer Motion animations and Glassmorphism.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Axios, Socket.io-client, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io, Express-validator.

## Prerequisites

- Node.js (v16+)
- MongoDB Atlas account or local MongoDB instance.

## Setup Instructions

### 1. Backend Setup
1. Navigate to the `backend` folder.
2. Create a `.env` file (one has been provided with a connection string).
3. Install dependencies:
   ```bash
   npm install
   ```
4. Seed the database with sample experts:
   ```bash
   node seed.js
   ```
5. Start the server:
   ```bash
   npm start
   ```

### 2. Frontend Setup
1. Navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Backend (Render)
1. Create a new **Web Service** on Render.
2. Connect this GitHub repository.
3. Set **Root Directory** to `backend`.
4. Set **Build Command** to `npm install`.
5. Set **Start Command** to `npm start`.
6. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `PORT`: 10000 (or leave default).
   - `NODE_ENV`: production.

### Frontend (Vercel/Netlify)
1. Deploy the `frontend` folder.
2. Set Environment Variables in your deployment dashboard:
   - `VITE_API_URL`: `https://expert-session-booking-system.onrender.com/api`
   - `VITE_SOCKET_URL`: `https://expert-session-booking-system.onrender.com`

## Key Implementations

### Race Condition Prevention
The system uses `mongoDB.findOneAndUpdate` with a query that checks `isBooked: false` before updating. This ensures that only one request can successfully "claim" a slot at a time. Additionally, a unique compound index on `(expertId, date, timeSlot)` in the `Booking` collection provides a second layer of security.

### Real-Time Updates
When a booking is confirmed, the backend emits a `slotBooked` event via Socket.io. The frontend listens for this event and updates the local state of slots in real-time, disabling the slot for all other users immediately.
