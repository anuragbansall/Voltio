import { io } from "socket.io-client";
import { loadAuth } from "../utils/authStorage";

let socket;
let connectionPromise;

export const connectSocket = async () => {
  if (socket?.connected) {
    return socket;
  }

  if (socket?.active) {
    return socket;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    const { token } = await loadAuth();

    socket = io("https://z4d31p2n-3000.inc1.devtunnels.ms", {
      auth: {
        token,
      },
      transports: ["websocket"], // Important for RN
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("Socket error:", err.message);
    });

    return socket;
  })();

  try {
    return await connectionPromise;
  } finally {
    connectionPromise = null;
  }
};

export const getSocket = () => socket;
