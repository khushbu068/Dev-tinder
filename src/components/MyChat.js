import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useOnlineUsers } from "../context/OnlineUsersContext";

const MyChat = () => {
  const { currentUser, token } = useSelector((state) => state.users);
  const authToken = token || localStorage.getItem("token");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { onlineUsers } = useOnlineUsers();

  const fetchChats = async () => {
    try {
      console.log(" [MyChat] Fetching user chats...");
      setLoading(true);
      const { data } = await axios.get("http://localhost:8000/api/fetchChat", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log(" [MyChat] Chats fetched:", data);
      setChats(data);
    } catch (err) {
      console.error(" [MyChat] Failed to fetch chats:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken && currentUser) fetchChats();
  }, [authToken, currentUser]);

  return (
    <div className="p-4 min-h-[60vh]">
      <h2 className="text-2xl font-semibold mb-4 text-center">Your Chats</h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-40">
          <span className="loading loading-dots loading-lg text-primary"></span>
          <p className="mt-2 text-gray-400">Loading chats...</p>
        </div>
      ) : chats.length === 0 ? (
        <p className="text-gray-500 text-center">No chats yet.</p>
      ) : (
        <div className="grid gap-4">
          {chats.map((chat) => {
            if (!chat.users || chat.users.length < 2) return null;

            const otherUser = chat.users.find((u) => u._id !== currentUser._id);
            if (!otherUser) return null;

            const isOnline = onlineUsers.includes(otherUser._id);
            const unseen = chat.latestMessage?.seenBy
              ? !chat.latestMessage.seenBy.includes(currentUser._id)
              : false;

            return (
              <div
                key={chat._id}
                onClick={() => navigate(`/chat/${otherUser._id}`)}
                className="flex items-center bg-base-200 p-4 rounded cursor-pointer hover:bg-base-300 transition relative"
              >
                <div className="relative mr-4">
                  <img
                    src={
                      otherUser.profileImage?.trim()
                        ? otherUser.profileImage
                        : "https://via.placeholder.com/40"
                    }
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {isOnline && (
                    <span
                      className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-base-200 rounded-full"
                      title="Online"
                    />
                  )}
                </div>
                <div>
                  <p className="font-medium">{otherUser.firstName}</p>
                  <p className="text-sm text-gray-500">{otherUser.email}</p>
                </div>
                {unseen && (
                  <span className="absolute top-2 right-4 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                    New
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyChat;