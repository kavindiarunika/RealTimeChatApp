# Interview Preparation: Real-Time Chat Application

This document provides potential interview questions and answers based on this project to help you prepare for your interview.

## Project Overview
A full-stack real-time chat application allowing users to sign up, log in, update their profiles, and chat with other users in real-time.

### Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Axios, React Router, Socket.io-client, React Hot Toast.
- **Backend**: Node.js, Express, Socket.io, MongoDB (Mongoose), JWT, bcryptjs, Cloudinary.
- **State Management**: React Context API.

---

## 1. General & Architecture

### Q1: Can you explain the overall architecture of your project?
**A:** This is a MERN (MongoDB, Express, React, Node.js) stack application.
- The **Frontend** is a Single Page Application (SPA) built with React and Vite. It communicates with the backend via RESTful APIs (Axios) and WebSockets (Socket.io).
- The **Backend** is an Express server that handles authentication, database operations, and real-time events.
- **MongoDB** stores user and message data.
- **Socket.io** enables bi-directional, real-time communication between the client and server.

### Q2: Why did you choose Vite instead of Create React App (CRA)?
**A:** Vite is significantly faster than CRA. It uses ES modules for development, which means it doesn't need to bundle the entire app before starting the dev server. This leads to near-instantaneous startup and Hot Module Replacement (HMR).

---

## 2. Frontend (React)

### Q3: How do you handle state management in this application?
**A:** I used the **React Context API**. I created two main contexts:
1. `AuthContext`: Manages user authentication state (login, logout, checkAuth) and the global Socket.io connection.
2. `ChatContext`: Manages chat-related data like the list of users, messages for the selected user, and unseen message counts.
This approach avoids "prop drilling" and makes the code more maintainable.

### Q4: How do you handle real-time updates on the frontend?
**A:** I use `socket.io-client`. When a user logs in, a socket connection is established in the `AuthContext`. In the `ChatContext`, I use a `useEffect` hook to listen for the `newMessage` event. When a message arrives, I update the `messages` state if the chat with that sender is currently open; otherwise, I increment the "unseen messages" count.

---

## 3. Backend (Node.js & Express)

### Q5: How do you secure your API routes?
**A:** I implemented a `protectRoute` middleware. It:
1. Checks for a JWT token in the request headers.
2. Verifies the token using `jsonwebtoken` and a secret key.
3. Retrieves the user from the database (excluding the password).
4. Attaches the user object to the request (`req.user`) and calls `next()`. If the token is missing or invalid, it returns an error.

### Q6: How do you handle file/image uploads?
**A:** I use **Cloudinary**. When a user updates their profile picture or sends an image in a chat, the image (usually in base64 format from the frontend) is sent to the server. The server uploads it to Cloudinary and then stores the returned `secure_url` in the MongoDB database.

---

## 4. Database (MongoDB & Mongoose)

### Q7: Describe your User and Message schemas.
**A:**
- **User Schema**: Stores `email` (unique), `fullName`, `password` (hashed), `profilePic`, and `bio`.
- **Message Schema**: Stores `senderId` and `receiverId` (both as `ObjectId` referencing the `User` model), `text`, `image` (URL), and a `seen` (boolean) flag.
Both use `timestamps: true` to automatically track `createdAt` and `updatedAt`.

### Q8: How do you ensure password security?
**A:** I never store passwords in plain text. I use `bcryptjs` to hash passwords during signup with a salt (e.g., 10 rounds). During login, I use `bcrypt.compare()` to verify if the provided password matches the stored hash.

---

## 5. Real-Time Communication (Socket.io)

### Q9: How does the server know which user is online?
**A:** On the server, I maintain a `userSocketMap` (a plain JavaScript object). When a client connects, they pass their `userId` in the handshake query. The server maps this `userId` to the `socket.id`. When a user disconnects, their entry is removed. The server then emits the updated list of online user IDs to all connected clients.

### Q10: Walk me through the flow of sending a private message.
**A:**
1. The **Client** sends a POST request to `/api/messages/send/:id` with the message content.
2. The **Server** saves the message to MongoDB.
3. The **Server** checks the `userSocketMap` for the `receiverId`.
4. If the receiver is online (has an active `socket.id`), the server uses `io.to(socketId).emit("newMessage", message)` to send it instantly.
5. The **Receiver's Client** listens for `newMessage` and updates its UI.

---

## 6. Behavioral & Improvements

### Q11: What was the most difficult part of building this project?
**A:** *[Personal Answer Suggestion]*: Implementing the "unseen messages" logic was tricky. It required coordinating between the database (to fetch initial counts) and Socket.io (to update counts in real-time when the user isn't looking at a specific chat).

### Q12: If you had more time, what features would you add?
**A:**
- **Group Chats**: Allowing multiple users in a single conversation.
- **Typing Indicators**: Using socket events to show "User is typing...".
- **Message Status**: Adding "Delivered" and "Read" receipts more explicitly.
- **Unit Testing**: Adding tests for controllers and React components using Vitest and React Testing Library.
