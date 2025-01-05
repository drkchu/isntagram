import { io } from "socket.io-client";

const socket = io("https://isntagram-api.onrender.com"); // My backend URL

export default socket;
