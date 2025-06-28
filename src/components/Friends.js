import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const Friends = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/request/getAllUserFriends",
          { withCredentials: true }
        );
        setFriends(response.data.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const handleProfileClick = (friendId) => {
    navigate(`/friendProfile/${friendId}`);
  };

  if (loading) {
    return (
      <motion.div
        className="flex justify-center items-center h-[60vh]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="loading loading-dots loading-lg text-primary"></span>
      </motion.div>
    );
  }

  if (friends.length === 0) {
    return (
      <motion.div
        className="text-center mt-5 text-gray-400 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        No friends found.
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-wrap justify-center gap-6 pt-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {friends.map((friend, index) => (
        <motion.div
          key={friend._id}
          className="card bg-base-100 w-96 shadow-sm hover:shadow-md transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <figure>
            <img
              src={
                friend.profileImage?.trim()
                  ? friend.profileImage
                  : "https://via.placeholder.com/150"
              }
              alt={`${friend.firstName}'s profile`}
              className="w-32 h-32 rounded-full object-cover m-4 border shadow"
            />
          </figure>

          <div className="card-body">
            <h2 className="card-title">
              {friend.firstName} {friend.lastName}
            </h2>
            <p>
              <strong>About:</strong> {friend.about || "No bio provided"}
            </p>

            <div className="card-actions flex gap-x-12 justify-end">
              <button
                className="btn btn-primary"
                onClick={() => handleProfileClick(friend._id)}
              >
                View Profile
              </button>

              <button
                className="btn btn-primary bg-primary text-white hover:bg-primary-dark hover:shadow-lg"
                onClick={() => navigate(`/chat/${friend._id}`)}
              >
                Chat with {friend.firstName}
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Friends;