import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../utils/socket";
import { useOnlineUsers } from "../context/OnlineUsersContext";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCircleUser,
  faFaceSmile,
  faPaperPlane,
  faRotateRight,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import api from "../utils/api";

const Chat = () => {
  const { id: receiverUserId } = useParams();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.users);

  const [chat, setChat] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const [receiverInfo, setReceiverInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [accessLoading, setAccessLoading] = useState(true);
  const [accessError, setAccessError] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { onlineUsers } = useOnlineUsers();
  const isOnline = onlineUsers.includes(receiverId);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const receiverName = receiverInfo?.firstName || "Friend";
  const initials = `${receiverInfo?.firstName?.[0] || ""}${
    receiverInfo?.lastName?.[0] || ""
  }`.toUpperCase();

  // ===============================
  // Access / Create Chat
  // ===============================
  const accessChat = useCallback(async () => {
    setAccessLoading(true);
    setAccessError(false);

    try {
      const { data } = await api.post("/accessChat", {
        userId: receiverUserId,
      });

      setChat(data);

      const otherUser = data.users.find((u) => u._id !== currentUser._id);
      setReceiverId(otherUser?._id);
      setReceiverInfo(otherUser || null);
    } catch (err) {
      console.error("[accessChat] Error:", err.response?.data || err.message);
      setAccessError(true);
    } finally {
      setAccessLoading(false);
    }
  }, [receiverUserId, currentUser]);

  // ===============================
  // Fetch Messages
  // ===============================

  const fetchMessages = async (chatId) => {
    try {
      setMessagesLoading(true);

      const { data } = await api.get(`/message/${chatId}`);
      setMessages(data);
    } catch (err) {
      console.error("[fetchMessages] Error:", err.response?.data || err.message);
    } finally {
      setMessagesLoading(false);
    }
  };

  // ===============================
  // Send Message
  // ===============================

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !receiverId || !chat?._id) {
      return;
    }

    try {
      const { data } = await api.post("/message/newChat", {
        content: newMessage,
        chatId: chat._id,
        receiverId,
      });

      setMessages((prev) => [...prev, data]);
      setNewMessage("");
      setShowEmojiPicker(false);

      socket.emit("new message", data);
    } catch (err) {
      console.error("[sendMessage] Error:", err.response?.data || err.message);
    }
  };

  // ===============================
  // Typing
  // ===============================

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socket.connected || !chat) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", chat._id);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop typing", chat._id);
      setIsTyping(false);
    }, 2000);
  };

  // ===============================
  // Socket Setup
  // ===============================

  useEffect(() => {
    if (!currentUser) return;

    socket.emit("setup", currentUser);
    socket.on("connected", () => {
      console.log("Socket connected");
    });

    return () => {
      socket.off("connected");
    };
  }, [currentUser]);

  // ===============================
  // Join Chat
  // ===============================

  useEffect(() => {
    if (chat?._id) {
      socket.emit("join chat", chat._id);
    }
  }, [chat]);

  // ===============================
  // Receive Message
  // ===============================

  useEffect(() => {
    const handleMessageReceived = (newMsg) => {
      if (chat && newMsg.chat._id === chat._id) {
        setMessages((prev) => [...prev, newMsg]);
      }
    };

    socket.on("message received", handleMessageReceived);

    return () => {
      socket.off("message received", handleMessageReceived);
    };
  }, [chat]);

  // ===============================
  // Typing Events
  // ===============================

  useEffect(() => {
    socket.on("typing", () => setOtherUserTyping(true));
    socket.on("stop typing", () => setOtherUserTyping(false));

    return () => {
      socket.off("typing");
      socket.off("stop typing");
    };
  }, []);

  // ===============================
  // Access Chat on Page Open
  // ===============================

  useEffect(() => {
    if (receiverUserId && currentUser) {
      accessChat();
    }
  }, [receiverUserId, currentUser, accessChat]);

  // ===============================
  // Fetch Messages
  // ===============================

  useEffect(() => {
    if (chat?._id) {
      fetchMessages(chat._id);
    }
  }, [chat]);

  // ===============================
  // Scroll to Bottom
  // ===============================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ===============================
  // Setting up the conversation
  // ===============================
  if (accessLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <span className="loading loading-dots loading-lg text-yellow-400" />
          <p className="text-xs">Opening conversation...</p>
        </div>
      </div>
    );
  }

  // ===============================
  // Couldn't open the chat
  // ===============================
  if (accessError) {
    return (
      <div className="h-full flex items-center justify-center px-4">
        <div className="w-[320px] rounded-2xl border border-white/10 bg-[#07111f]/60 backdrop-blur-xl shadow-2xl px-6 py-8 text-center">
          <div className="w-11 h-11 mx-auto rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faCommentDots} className="text-yellow-400 text-lg" />
          </div>

          <h2 className="text-white text-lg font-semibold mb-1">
            Couldn't open this chat
          </h2>

          <p className="text-gray-400 text-xs mb-5">
            Something went wrong while starting the conversation.
          </p>

          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="h-9 px-4 rounded-lg border border-white/15 text-gray-200 hover:bg-white/10 text-xs font-medium transition"
            >
              Go back
            </button>

            <button
              type="button"
              onClick={accessChat}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-semibold transition"
            >
              <FontAwesomeIcon icon={faRotateRight} className="text-[10px]" />
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===============================
  // Chat
  // ===============================
  return (
    <div className="h-full flex flex-col">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 shrink-0">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-gray-300 hover:text-white transition"
          aria-label="Back"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
        </button>

        <div className="relative shrink-0">
          {receiverInfo?.profileImage?.trim() ? (
            <img
              src={receiverInfo.profileImage}
              alt={receiverName}
              className="w-9 h-9 rounded-full object-cover border border-yellow-400/40"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-yellow-400/10 border border-yellow-400/40 flex items-center justify-center">
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

        <div className="min-w-0">
          <h2 className="text-white text-sm font-semibold truncate">
            {receiverName}
          </h2>
          <p className="text-[11px] text-gray-400">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messagesLoading ? (
          <div className="flex justify-center items-center h-full">
            <span className="loading loading-dots loading-md text-yellow-400" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-3">
              <FontAwesomeIcon icon={faCommentDots} className="text-yellow-400 text-lg" />
            </div>
            <h3 className="text-white text-sm font-semibold mb-1">
              No messages yet
            </h3>
            <p className="text-gray-400 text-xs max-w-[220px]">
              Say hi to {receiverName} and start the conversation.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender._id === currentUser._id;

            return (
              <div
                key={msg._id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? "bg-yellow-400 text-black rounded-br-sm"
                      : "bg-white/10 text-gray-100 border border-white/10 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>

                <div className="text-[10px] text-gray-500 mt-1 px-1">
                  {isMe
                    ? msg.seenBy?.length > 1
                      ? "Seen"
                      : "Sent"
                    : msg.sender.firstName}
                </div>
              </div>
            );
          })
        )}

        {otherUserTyping && (
          <div className="text-xs italic text-gray-400 px-1">
            {receiverName} is typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <div className="px-4 py-3 border-t border-white/10 shrink-0">
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={handleTyping}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="w-full h-11 pl-3.5 pr-10 rounded-full border border-white/15 bg-white/10 text-white text-sm placeholder:text-gray-500 outline-none focus:border-cyan-400/60 focus:bg-white/[0.14] transition"
            />

            <button
              type="button"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition"
              aria-label="Emoji picker"
            >
              <FontAwesomeIcon icon={faFaceSmile} className="text-base" />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-14 right-0 z-10">
                <Picker
                  data={data}
                  theme="dark"
                  onEmojiSelect={(emoji) =>
                    setNewMessage((prev) => prev + emoji.native)
                  }
                />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition ${
              newMessage.trim()
                ? "bg-yellow-400 hover:bg-yellow-300 text-black"
                : "bg-white/10 text-gray-500 cursor-not-allowed"
            }`}
            aria-label="Send message"
          >
            <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;