"use strict";
import {
   colorFromId,
   createParentContainer,
   createMousePointer,
   createUsername,
} from "/module.js";

const joinPanel = document.getElementById("join-panel");
const joinForm = document.getElementById("join-form");
const input = document.getElementById("username-input");
const erroMsg = document.getElementById("error-msg");
const onlineBadge = document.querySelector(".online-badge");
const connectionStatus = document.querySelector(".connection-status");
const joinedHint = document.getElementById("joined-hint");

let currentPlayer = false;
let userList = {};
let lastEmit = 0;
const THROTTLE_MS = 32;

function setConnectionState(state, label) {
   if (!connectionStatus) return;
   connectionStatus.dataset.state = state;
   connectionStatus.textContent = label;
}

function showError(msg) {
   erroMsg.style.display = "block";
   erroMsg.textContent = msg;
}

const socket =
   typeof io !== "undefined"
      ? io({ transports: ["websocket", "polling"] })
      : { connected: false, on() {}, emit() {} };

if (typeof io === "undefined") {
   setConnectionState("disconnected", "Socket.io missing");
   showError(
      "Realtime server not available on this host. Deploy to Render/Railway or run: npm run dev"
   );
}

function updateOnlineBadge(count) {
   if (!onlineBadge) return;

   const n = typeof count === "number" ? count : Object.keys(userList).length;

   if (!currentPlayer && n === 0) {
      onlineBadge.hidden = true;
      return;
   }

   onlineBadge.textContent = n === 1 ? "1 user online" : `${n} users online`;
   onlineBadge.hidden = false;
}

function showJoinPanel() {
   currentPlayer = false;
   joinPanel?.removeAttribute("hidden");
   joinedHint?.setAttribute("hidden", "");
}

function hideJoinPanel() {
   joinPanel?.setAttribute("hidden", "");
   joinedHint?.removeAttribute("hidden");
}

function addRemoteUser(user) {
   if (!user?.id || user.id === socket.id || userList[user.id]) return;

   const color = user.color || colorFromId(user.id);
   userList[user.id] = { ...user, color };

   const parentContainer = createParentContainer(user.id, color);
   parentContainer.appendChild(createMousePointer(color));
   parentContainer.appendChild(createUsername(user.text, color));
   document.body.appendChild(parentContainer);
}

function removeRemoteUser(id) {
   document.querySelector(`[data-id='${id}']`)?.remove();
   delete userList[id];
}

joinForm?.addEventListener("submit", (event) => {
   event.preventDefault();

   if (!socket.connected) {
      showError("Not connected to server. Start the app with: npm run dev");
      return;
   }

   const name = input.value.trim();
   if (name.length === 0) {
      validation();
      return;
   }
   if (name.length >= 10) {
      validation();
      return;
   }

   socket.emit("new-user", { text: name });
   currentPlayer = true;
   input.value = "";
   hideJoinPanel();
});

socket.on("connect", () => {
   setConnectionState("connected", "Connected");
   if (!currentPlayer) {
      updateOnlineBadge(0);
   }
});

socket.on("disconnect", () => {
   setConnectionState("disconnected", "Disconnected");
   showJoinPanel();
});

socket.on("connect_error", () => {
   setConnectionState("disconnected", "Server offline");
   showError(
      "Cannot reach realtime server. This app needs Node + WebSockets (use Render, Railway, or npm run dev — not static Vercel)."
   );
});

socket.on("fetch-users", (users) => {
   for (const user of Object.values(users)) {
      addRemoteUser(user);
   }
   updateOnlineBadge(Object.keys(users).length);
});

socket.on("new-user", (newUser) => {
   addRemoteUser(newUser);
});

socket.on("mousemove", (user) => {
   if (!userList[user.id] || user.id === socket.id) return;

   const container = document.querySelector(`[data-id='${user.id}']`);
   if (!container) return;

   container.style.left = user.coordinates.x + "px";
   container.style.top = user.coordinates.y + "px";
});

socket.on("user-left", (user) => {
   removeRemoteUser(user.id);
});

socket.on("online-count", (count) => {
   updateOnlineBadge(count);
});

function emitPointerPosition(x, y) {
   const now = Date.now();
   if (now - lastEmit < THROTTLE_MS) return;
   lastEmit = now;
   socket.emit("mousemove", { x, y });
}

document.addEventListener("mousemove", (event) => {
   if (currentPlayer && socket.connected) {
      emitPointerPosition(event.clientX, event.clientY);
   }
});

document.addEventListener(
   "touchmove",
   (event) => {
      if (currentPlayer && socket.connected && event.touches[0]) {
         event.preventDefault();
         emitPointerPosition(event.touches[0].clientX, event.touches[0].clientY);
      }
   },
   { passive: false }
);

input?.addEventListener("keyup", validation);

function validation() {
   const name = input.value.trim();
   if (name.length > 10) {
      input.style.border = "2px solid #ff6b6b";
      showError("Name must be less than 10 characters");
   } else if (name.length === 0) {
      input.style.border = "2px solid #ff6b6b";
      showError("Enter your name");
   } else {
      input.style.border = "2px solid #41e9b1";
      erroMsg.textContent = "";
      erroMsg.style.display = "none";
   }
}
