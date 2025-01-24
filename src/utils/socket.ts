import { io, Socket } from "socket.io-client";

// Create a singleton instance of the Socket.IO client
// const socket: Socket = io("https://buddy-board-88fd54c902d8.herokuapp.com", {
const socket: Socket = io("http://127.0.0.1:5000", {
  withCredentials: true, // Allows cookies for session management
  transports: ["websocket"], // Use WebSocket for better performance
  reconnectionAttempts: 5, // Retry up to 5 times on disconnect
});

export default socket;
