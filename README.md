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

**Socket.io needs a long-running Node server** (WebSockets). Plain Vercel static hosting will show `socket.io.js` 404 and `io is not defined`.

| Platform | Works? |
|----------|--------|
| Local `npm run dev` | Yes |
| [Render](https://render.com) (use `render.yaml` in repo) | Yes — recommended |
| Railway, Fly.io, VPS | Yes |
| Vercel serverless only | No — use Render instead |

### Deploy on Render (free)

1. Push this repo to GitHub.
2. [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint** → connect repo (uses `render.yaml`).
3. Or **New Web Service** → Node → Build: `npm install` → Start: `npm start`.
4. Set **Node 24** if asked. Open the Render URL (not Vercel) for the live app.

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
