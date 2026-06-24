const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const auth = require("./Routes.js/Authroute");
const userRoute = require("./Routes.js/UserRoute");
const conversationRoute = require("./Routes.js/Conversation");
const messageRoute = require("./Routes.js/MessageRoute");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const MONGO_CONNECTION = process.env.MONGO_URL;
const LOCAL_CLIENT_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const allowLocalClient = (origin, callback) => {
  callback(null, !origin || LOCAL_CLIENT_ORIGIN.test(origin));
};

app.use(
  cors({
    origin: allowLocalClient,
  }),
);

app.use(express.json({ limit: "5mb" }));

mongoose
  .connect(MONGO_CONNECTION)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });

const socketio = new Server(server, {
  cors: {
    origin: allowLocalClient,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", auth);
app.use("/api/users", userRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

socketio.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
  });

  socket.on("send_message", (data) => {
    socketio.to(data.conversationId).emit("receive_message", data);
  });

  socket.on("typing", (data) => {
    socket.to(data.conversationId).emit("typing", data);
  });

  socket.on("stop_typing", (data) => {
    socket.to(data.conversationId).emit("stop_typing", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
