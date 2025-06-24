import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Chat = () => {
  const { id } = useParams();
  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriend = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/request/getFriendProfile/${id}`,
          { withCredentials: true }
        );
        setFriend(response.data.user); // ✅ use `user` from the response
      } catch (error) {
        console.error("Error fetching friend data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFriend();
    }
  }, [id]);

  if (loading)
    return <div className="text-center mt-5 text-white">Loading...</div>;
  if (!friend)
    return <div className="text-center mt-5 text-white">Friend not found.</div>;

  return (
    <div
      className="h-screen w-full px-4 py-6 bg-gray-900 text-white flex flex-col"
      style={{ boxSizing: "border-box" }}
    >
      {/* Header */}
      <h2 className="text-3xl font-bold mb-6 text-center">
        {friend.firstName}
      </h2>

      {/* Chats container - no scroll, full space */}
      <div className="flex-grow space-y-4">
        {/* Friend's message (left) */}
        <div className="chat chat-start max-w-xl">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                alt={friend.firstName}
                src={
                  friend.profileImage ||
                  "https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                }
              />
            </div>
          </div>
          <div className="chat-header font-bold">
            {friend.firstName}
            <time className="text-xs opacity-50 ml-2">12:45</time>
          </div>
          <div className="chat-bubble">You were the Chosen One!</div>
          <div className="chat-footer opacity-50">Delivered</div>
        </div>

        {/* Your message (right) */}
        <div className="chat chat-end max-w-xl ml-auto">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                alt="You"
                src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
              />
            </div>
          </div>
          <div className="chat-header font-bold">
            You
            <time className="text-xs opacity-50 ml-2">12:46</time>
          </div>
          <div className="chat-bubble">I hate you!</div>
          <div className="chat-footer opacity-50">Seen at 12:46</div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
