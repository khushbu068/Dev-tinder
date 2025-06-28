import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../utils/socket";

const OnlineUsersContext = createContext();
export const useOnlineUsers = () => useContext(OnlineUsersContext);

export const OnlineUsersProvider = ({ children, currentUser }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    socket.emit("setup", currentUser);

    socket.on("user online", (userId) => {
      setOnlineUsers((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
    });

    socket.on("user offline", (userId) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      socket.off("user online");
      socket.off("user offline");
    };
  }, [currentUser]);

  return (
    <OnlineUsersContext.Provider value={{ onlineUsers }}>
      {children}
    </OnlineUsersContext.Provider>
  );
};