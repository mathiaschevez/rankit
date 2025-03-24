// hooks/useSocket.ts
"use client";
import { getSocket } from "@/socket";
import { useEffect, useState } from "react";


export default function useSocket() {
  const socket = getSocket();
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.connect();

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);

      // Disconnect the socket ONLY if no other components use it
      if (socket.listeners("connect").length === 0) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return { socket, isConnected };
};
