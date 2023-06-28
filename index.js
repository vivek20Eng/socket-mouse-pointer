const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

app.get("/", (req, res) => {
   res.sendFile("/index.html");
});

const user = {};
io.on("connection", (socket) => {
   socket.emit("fetch-users", user);

   socket.on("new-user", (data) => {
      const newUser = {
         id: socket.id,
         text: data.text,
      };
      user[socket.id] = newUser;

      io.emit("new-user", newUser);
   });

   socket.on("mousemmove", (coordinates) => {
      io.emit("mousemove", { coordinates, id: socket.id });
   });

   socket.on("disconnect", () => {
      delete user[socket.id];
      io.emit("user-left", { id: socket.id });
   });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(PORT));
