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

function userColor(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 72%, 58%)`;
}

function broadcastOnlineCount() {
  io.emit("online-count", Object.keys(users).length);
}

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.emit("fetch-users", users);
  socket.emit("online-count", Object.keys(users).length);

  socket.on("new-user", (data) => {
    const text = String(data?.text ?? "")
      .trim()
      .slice(0, 10);

    if (!text || users[socket.id]) return;

    const newUser = {
      id: socket.id,
      text,
      color: userColor(socket.id),
    };

    users[socket.id] = newUser;

    io.emit("new-user", newUser);
    broadcastOnlineCount();
  });

  socket.on("mousemove", (coordinates) => {
    if (!users[socket.id]) return;

    socket.broadcast.emit("mousemove", {
      id: socket.id,
      coordinates,
    });
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);

    if (!users[socket.id]) return;

    delete users[socket.id];

    io.emit("user-left", { id: socket.id });
    broadcastOnlineCount();
  });
});

const PORT = process.env.PORT || 3000;

if (!process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = server;
