const express = require("express");
const cors = require("cors");
const socketIo = require("socket.io");
const http = require("http");

const app = express();
app.use(cors());
const server = http.createServer(app);
const port = process.env.PORT;

const io = socketIo(server);

const users = [];

io.on("connection", async (socket) => {
  console.log("connected");
  await socket.on("new-user", async ({ user }) => {
    users[socket.id] = user;
    await socket.emit("joined", {
      message: `${users[socket.id]} welcome to the chat`,
    });
    await io.emit("onlineUser", { user });
    // await socket.broadcast.emit("joined-message", {
    //   mesage: `${users[socket.id]}  joins the chat`,
    // });
  });

  socket.on("message", ({ message, id }) => {
    console.log("message from frontend", message, "id", id, "users", users[id]);
    io.emit("send-message", { user: users[id], message, id });
  });
  socket.on("disconnect", () => {
    //   socket.broadcast.emit("leave", {
    //     message: `${users[socket.id]}  has left`,
    //   });
    //   console.log(`user left`);
  });
});

server.listen(port, () => {
  console.log(`Server is running to the port ${port}`);
});
