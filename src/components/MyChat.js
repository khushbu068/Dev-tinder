import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faCommentDots,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import api from "../utils/api";
import { useOnlineUsers } from "../context/OnlineUsersContext";

// Small relative-time formatter — avoids pulling in a date library
// just for "2m ago" / "Yesterday" style labels.
const formatRelativeTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDays = Math.floor(diffHr / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const MyChat = () => {
  const { currentUser } = useSelector((state) => state.users);

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  const { onlineUsers } = useOnlineUsers();

  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const { data } = await api.get("/fetchChat");
      setChats(data);
    } catch (err) {
      console.error("[MyChat] Failed to fetch chats:", err.response?.data || err.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchChats();
    }
  }, [currentUser, fetchChats]);

  const openChat = (otherUserId) => navigate(`/chat/${otherUserId}`);

  // ===============================
  // Loading
  // ===============================
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <span className="loading loading-dots loading-lg text-yellow-400" />
          <p className="text-xs">Loading your chats...</p>
        </div>
      </div>
    );
  }

  // ===============================
  // Error
  // ===============================
  if (error) {
    return (
      <div className="h-full flex items-center justify-center px-4">
        <div className="w-[320px] rounded-2xl border border-white/10 bg-[#07111f]/60 backdrop-blur-xl shadow-2xl px-6 py-8 text-center">
          <div className="w-11 h-11 mx-auto rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faCommentDots} className="text-yellow-400 text-lg" />
          </div>
          <h2 className="text-white text-lg font-semibold mb-1">
            Couldn't load your chats
          </h2>
          <p className="text-gray-400 text-xs mb-5">
            Something went wrong. Please try again.
          </p>
          <button
            type="button"
            onClick={fetchChats}
            className="h-9 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-semibold transition"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // ===============================
  // Build display rows
  // ===============================
  const rows = chats
    .map((chat) => {
      if (!chat.users || chat.users.length < 2) return null;

      const otherUser = chat.users.find((u) => u._id !== currentUser._id);
      if (!otherUser) return null;

      return { chat, otherUser };
    })
    .filter(Boolean);

  // ===============================
  // Empty state
  // ===============================
  if (rows.length === 0) {
    return (
      <div className="h-full flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#07111f]/60 backdrop-blur-xl shadow-2xl px-6 py-8 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faCommentDots} className="text-yellow-400 text-xl" />
          </div>

          <h2 className="text-white text-lg font-semibold mb-1">
            No chats yet
          </h2>

          <p className="text-gray-400 text-xs mb-5">
            Start a conversation with one of your connections.
          </p>

          <button
            type="button"
            onClick={() => navigate("/friends")}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-semibold transition"
          >
            <FontAwesomeIcon icon={faUserGroup} className="text-[10px]" />
            View your friends
          </button>
        </div>
      </div>
    );
  }

  // ===============================
  // Chat list
  // ===============================
  return (
    <div className="px-4 sm:px-6 py-6">
      <h2 className="text-lg font-semibold text-white text-center mb-4">
        Your Chats
      </h2>

      <div className="max-w-xl mx-auto space-y-2">
        {rows.map(({ chat, otherUser }) => {
          const isOnline = onlineUsers.includes(otherUser._id);
          const initials = `${otherUser.firstName?.[0] || ""}${
            otherUser.lastName?.[0] || ""
          }`.toUpperCase();

          const lastMessage = chat.latestMessage;
          const unseen = lastMessage?.seenBy
            ? !lastMessage.seenBy.includes(currentUser._id)
            : false;

          const isMine = lastMessage?.sender === currentUser._id;
          const preview = lastMessage?.content
            ? `${isMine ? "You: " : ""}${lastMessage.content}`
            : "Say hi to start the conversation";

          return (
            <button
              key={chat._id}
              type="button"
              onClick={() => openChat(otherUser._id)}
              className="w-full flex items-center gap-3 rounded-xl border border-white/10 bg-[#07111f]/60 backdrop-blur-xl px-3.5 py-3 text-left hover:border-yellow-400/30 hover:bg-white/[0.04] transition"
            >
              <div className="relative shrink-0">
                {otherUser.profileImage?.trim() ? (
                  <img
                    src={otherUser.profileImage}
                    alt={otherUser.firstName}
                    className="w-11 h-11 rounded-full object-cover border border-yellow-400/40"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-yellow-400/10 border border-yellow-400/40 flex items-center justify-center">
                    {initials ? (
                      <span className="text-yellow-400 text-xs font-semibold">
                        {initials}
                      </span>
                    ) : (
                      <FontAwesomeIcon icon={faCircleUser} className="text-yellow-400 text-sm" />
                    )}
                  </div>
                )}

                {isOnline && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-400 border-2 border-[#07111f] rounded-full" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm truncate ${unseen ? "text-white font-semibold" : "text-gray-200 font-medium"}`}>
                    {otherUser.firstName} {otherUser.lastName}
                  </p>

                  {lastMessage?.createdAt && (
                    <span className="text-[10px] text-gray-500 shrink-0">
                      {formatRelativeTime(lastMessage.createdAt)}
                    </span>
                  )}
                </div>

                <p className={`text-xs truncate mt-0.5 ${unseen ? "text-gray-200" : "text-gray-500"}`}>
                  {preview}
                </p>
              </div>

              {unseen && (
                <span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MyChat;