import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // My backend URL

export default socket;
