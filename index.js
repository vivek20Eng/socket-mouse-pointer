const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const users = {};

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // Send existing users to new client
  socket.emit("fetch-users", users);

  // New user joined
  socket.on("new-user", (data) => {
    const newUser = {
      id: socket.id,
      text: data.text,
    };

    users[socket.id] = newUser;

    io.emit("new-user", newUser);
  });

  // Mouse movement
  socket.on("mousemove", (coordinates) => {
    io.emit("mousemove", {
      id: socket.id,
      coordinates,
    });
  });

  // User disconnected
  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);

    delete users[socket.id];

    io.emit("user-left", {
      id: socket.id,
    });
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
