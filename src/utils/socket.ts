import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "";

const socket: Socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["polling", "websocket"],
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
  reconnectionDelayMax: 10000,
  timeout: 10000,
  autoConnect: true,
});

socket.on("connect_error", (err) => {
  console.warn("Socket.IO connection error (falling back to polling):", err.message);
});

export default socket;
