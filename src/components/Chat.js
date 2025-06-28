import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { socket } from "../utils/socket";
import { useOnlineUsers } from "../context/OnlineUsersContext";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const Chat = () => {
  const { id: receiverUserId } = useParams();
  const { currentUser, token } = useSelector((state) => state.users);
  const authToken = token || localStorage.getItem("token");

  const [chat, setChat] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { onlineUsers } = useOnlineUsers();
  const isOnline = onlineUsers.includes(receiverId);

  const messagesEndRef = useRef(null);

  const receiverName =
    chat && receiverId
      ? chat.users.find((u) => u._id === receiverId)?.firstName || "Friend"
      : "Friend";

  const accessChat = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/accessChat",
        { userId: receiverUserId },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setChat(data);
      const otherUser = data.users.find((u) => u._id !== currentUser._id);
      setReceiverId(otherUser?._id);
    } catch (err) {
      console.error("❌ [accessChat] Error:", err.response?.data || err.message);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8000/api/message/${chatId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setMessages(data);
    } catch (err) {
      console.error("❌ [fetchMessages] Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !authToken || !receiverId || !chat?._id) return;
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/message/newChat",
        {
          content: newMessage,
          chatId: chat._id,
          receiverId,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
      setShowEmojiPicker(false);
      socket.emit("new message", data);
    } catch (err) {
      console.error("❌ [sendMessage] Error:", err.response?.data || err.message);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socket.connected || !chat) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", chat._id);
    }

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      socket.emit("stop typing", chat._id);
      setIsTyping(false);
    }, 2000);

    setTypingTimeout(timeout);
  };

  useEffect(() => {
    if (!currentUser) return;
    socket.emit("setup", currentUser);
    socket.on("connected", () => {
      console.log("✅ Socket connected");
    });
    return () => socket.off("connected");
  }, [currentUser]);

  useEffect(() => {
    if (chat?._id) socket.emit("join chat", chat._id);
  }, [chat]);

  useEffect(() => {
    socket.on("message received", (newMsg) => {
      if (chat && newMsg.chat._id === chat._id) {
        setMessages((prev) => [...prev, newMsg]);
      }
    });
    return () => socket.off("message received");
  }, [chat]);

  useEffect(() => {
    socket.on("typing", () => setOtherUserTyping(true));
    socket.on("stop typing", () => setOtherUserTyping(false));
    return () => {
      socket.off("typing");
      socket.off("stop typing");
    };
  }, []);

  useEffect(() => {
    if (authToken && receiverUserId && currentUser) accessChat();
  }, [receiverUserId, authToken, currentUser]);

  useEffect(() => {
    if (chat?._id) fetchMessages(chat._id);
  }, [chat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-full flex flex-col p-4 bg-base-100 rounded-md shadow-md">
      <div className="mb-4 pb-2 text-center">
        <h2 className="text-2xl font-semibold text-primary flex items-center justify-center gap-2">
          Chat with {receiverName}
          {isOnline && (
            <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          )}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 bg-base-200 p-4 rounded">
        {loading ? (
          <div className="flex justify-center items-center h-[40vh]">
            <span className="loading loading-dots loading-lg text-primary"></span>
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-400">No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`chat ${
                msg.sender._id === currentUser._id ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-bubble">
                {msg.content}
                {msg.sender._id === currentUser._id && (
                  <div className="text-[10px] mt-1 text-right text-gray-400">
                    {msg.seenBy?.length > 1 ? "Seen ✅✅" : "Sent ✅"}
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-400">{msg.sender.firstName}</div>
            </div>
          ))
        )}
        {otherUserTyping && (
          <div className="text-sm italic text-gray-400 px-4">Typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 flex items-end gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            className="input input-bordered w-full pr-10 text-sm h-12"
            placeholder="Type your message..."
            value={newMessage}
            onChange={handleTyping}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-xl"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            😊
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-14 right-0 z-10">
              <Picker
                data={data}
                onEmojiSelect={(emoji) =>
                  setNewMessage((prev) => prev + emoji.native)
                }
                theme="light"
              />
            </div>
          )}
        </div>
        <button
          className="btn btn-primary px-4 py-2 h-12 text-sm min-w-[64px]"
          onClick={sendMessage}
          disabled={!newMessage.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;