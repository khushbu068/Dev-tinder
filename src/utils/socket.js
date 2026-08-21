import { io } from "socket.io-client";

const API_URL = process.env.REACT_APP_API_URL;

export const socket = io(API_URL, {
  withCredentials: true,
});