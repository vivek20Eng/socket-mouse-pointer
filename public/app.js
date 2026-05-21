"use strict";

function colorFromId(id) {
   let hash = 0;
   for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
   }
   const hue = Math.abs(hash) % 360;
   return `hsl(${hue}, 72%, 58%)`;
}

function createParentContainer(id, color) {
   const div = document.createElement("div");
   div.className = "cursor-container";
   div.setAttribute("data-id", id);
   div.style.position = "absolute";
   div.style.pointerEvents = "none";
   div.style.color = color;
   return div;
}

function createMousePointer(color) {
   const iconElement = document.createElement("i");
   iconElement.classList.add("fas", "fa-mouse-pointer");
   iconElement.style.color = color;
   iconElement.style.fontSize = "22px";
   iconElement.style.filter = "drop-shadow(0 1px 3px rgba(0,0,0,0.6))";
   return iconElement;
}

function createUsername(data, color) {
   const span = document.createElement("span");
   span.classList.add("username-span");
   span.textContent = data;
   span.style.backgroundColor = color;
   return span;
}

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

const socketOptions = { transports: ["websocket", "polling"] };
const socketUrl = window.SOCKET_SERVER_URL || undefined;
const isVercelHost = /\.vercel\.app$/i.test(window.location.hostname);
const needsRenderBackend = isVercelHost && !socketUrl;

const socketStub = { connected: false, on() {}, emit() {} };

let socket;
if (typeof io === "undefined") {
   socket = socketStub;
} else if (needsRenderBackend) {
   socket = socketStub;
} else if (socketUrl) {
   socket = io(socketUrl, socketOptions);
} else {
   socket = io(socketOptions);
}

if (typeof io === "undefined") {
   setConnectionState("disconnected", "Socket.io missing");
   showError("Socket.io client failed to load. Check your network or ad blocker.");
} else if (needsRenderBackend) {
   setConnectionState("disconnected", "Setup required");
   showError(
      "Vercel only hosts the page — not the realtime server. 1) Deploy this repo on Render (Start: npm start). 2) Vercel → Settings → Environment Variables → SOCKET_SERVER_URL = your Render URL. 3) Redeploy Vercel."
   );
} else if (socketUrl) {
   setConnectionState("connecting", "Connecting to server…");
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
   if (socketUrl) {
      showError(
         `Cannot reach server at ${socketUrl}. Check Render is running and CORS_ORIGIN includes this site.`
      );
   } else if (isVercelHost) {
      showError(
         "Add SOCKET_SERVER_URL in Vercel (your Render URL), then Redeploy. Or use the Render URL directly instead of Vercel."
      );
   } else {
      showError("Cannot reach server. Run: npm run dev on your PC.");
   }
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
