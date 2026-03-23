import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userroute from "./routes/userRouter.js";
import messageroute from "./routes/messageRouter.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);


// ✅ CORS (ONLY ONCE)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Body parser (increase limit)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));


// ✅ Socket.io
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

export const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected", userId);

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});


// ✅ Routes
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/user", userroute);      // ⚠️ make sure this matches frontend
app.use("/api/messages", messageroute);


// ✅ DB + Server start
const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  server.listen(PORT, () =>
    console.log("Server is running on port " + PORT)
  );
});