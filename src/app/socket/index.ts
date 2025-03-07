import { env } from "@/env";
import { io } from "socket.io-client";

export const socket = io(env.NEXT_PUBLIC_API_URL, {
  transports: ['websocket'],
  withCredentials: true,
});

socket.on("connect", () => {
  console.log('user connected');
});

socket.on("connect_error", (err) => {
  // the reason of the error, for example "xhr poll error"
  console.log(err.message);

  // some additional description, for example the status code of the initial HTTP response
  // console.log(err.description);

  // some additional context, for example the XMLHttpRequest object
  // console.log(err.context);
});

export default socket;