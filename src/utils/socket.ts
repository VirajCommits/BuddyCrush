import { io, Socket } from "socket.io-client";

// Create a singleton instance of the Socket.IO client
const socket: Socket = io({
  withCredentials: true,
  transports: ["polling", "websocket"],
  reconnectionAttempts: 5,
});

export default socket;
