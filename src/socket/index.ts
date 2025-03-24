import { io, Socket } from "socket.io-client";
import { env } from "@/env";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(env.NEXT_PUBLIC_API_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => console.log("Connected to socket:", socket?.id));
    socket.on("disconnect", () => console.log("Socket disconnected"));
    socket.on("connect_error", (err) => {
      // the reason of the error, for example "xhr poll error"
      console.log("Socket connection error", err.message);
    
      // some additional description, for example the status code of the initial HTTP response
      // console.log(err.description);
    
      // some additional context, for example the XMLHttpRequest object
      // console.log(err.context);
    });
  }

  return socket;
};
