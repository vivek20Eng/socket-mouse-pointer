![Project Status](https://img.shields.io/badge/Status-In%20Progress-yellow)

## Socket Web App

[![Video Demo](https://img.youtube.com/vi/KxMaTZkxqqQ/0.jpg)](https://www.youtube.com/watch?v=KxMaTZkxqqQ)
## [LIVE 👁️](https://socket-mouse-pointer.vercel.app/)

 <video width="640" height="360" controls>
  <source src="./sceenshot/socket.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

# Real-Time Collaborative Mouse Pointer Application

Welcome to the Real-Time Collaborative Mouse Pointer Application! This application allows users to collaborate in real-time by sharing their names and seeing each other's mouse pointers move on the screen.

## Summary

The Real-Time Collaborative Mouse Pointer Application is a web-based application built using Socket.io for real-time communication. Users can join the application by typing their names, and once connected, they can see their own mouse pointer as well as the mouse pointers of other connected users. This collaborative environment enables users to interact with each other and collaborate seamlessly.

## Features

- **Real-Time Communication:** Utilizes Socket.io for real-time bidirectional communication between the server and clients.
- **User Identification:** Users can type their names to join the application, allowing them to identify themselves to others.
- **Mouse Pointer Visibility:** Users can see their own mouse pointer as well as the mouse pointers of other connected users, enabling real-time collaboration.

## Usage

### Joining the Application:

1. Open the application in your web browser.
2. Type your name in the provided input field and submit.

### Interacting with Others:

- Once connected, you'll see your mouse pointer on the screen.
- Move your mouse pointer to see it in action.
- You'll also see the mouse pointers of other connected users, identified by their names.

### Collaborating in Real-Time:

- Collaborate with other users by moving your mouse pointer and observing the movement of others.
- Use the application to work together on projects, brainstorm ideas, or simply have fun collaborating with others in real-time.

## Technologies Used

- **Socket.io:** Real-time bidirectional event-based communication library for enabling real-time collaboration.
- **HTML, CSS, JavaScript:** Frontend technologies for building the user interface and handling client-side logic.

## Demo / deployment

| Where | Command / setup |
|-------|------------------|
| **Local** | `npm run dev` → http://localhost:3000 |
| **Render only** | `npm start` — one URL, everything works |
| **Vercel + Render** | UI on Vercel, Socket.io on Render (see below) |

### Option A — One URL on Render (simplest)

1. [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint** → connect this repo.
2. Open your `https://….onrender.com` URL — cursors work.

### Option B — Vercel frontend + Render backend

**Step 1 — Backend on Render**

1. Deploy on Render (Blueprint or Web Service).
2. **Start command:** `npm start` · **Node:** 24
3. Copy your Render URL, e.g. `https://socket-mouse-pointer.onrender.com`

**Step 2 — Frontend on Vercel**

1. **Settings → Environment Variables** → add:
   - `SOCKET_SERVER_URL` = your Render URL (no trailing slash)
2. **Settings → General → Node.js Version** = **24.x**
3. **Build Command:** `npm run build` (or leave default; `vercel.json` sets this)
4. **Output Directory:** `public`
5. Redeploy.

Vercel builds `public/env.js` with your Render URL; the browser connects there for live cursors.

**Render env (optional):** set `CORS_ORIGIN` to your Vercel URL(s), comma-separated.

## Getting Started

To get started with the development of the Real-Time Collaborative Mouse Pointer Application, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/vivek20Eng/socket-mouse-pointer.git
   ```
2. Install dependencies:
    ```bash 
    cd socket-mouse-pointer
    npm install
    ```
3. Start the development server:
    ```bash 
    npm run dev
    ```
