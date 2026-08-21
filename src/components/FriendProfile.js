import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../utils/api";

const FriendProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendProfile = async () => {
      try {
        if (!id) {
          console.error("Invalid friend ID");
          setLoading(false);
          return;
        }

        const response = await api.get(
          `/request/getFriendProfile/${id}`
        );

        setFriend(response.data.user);
      } catch (error) {
        console.error(
          "Error fetching friend's profile:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFriendProfile();
  }, [id]);

  if (loading) {
    return (
      <motion.div
        className="flex justify-center items-center h-[60vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span className="loading loading-dots loading-lg text-primary" />
      </motion.div>
    );
  }

  if (!friend) {
    return (
      <motion.div
        className="text-center mt-5 text-gray-400 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Friend not found.
      </motion.div>
    );
  }

  return (
    <motion.div className="flex justify-center items-center pt-5">
      <motion.div className="card w-96 bg-base-100 shadow-xl">
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
          <h2 className="card-title text-left">
            {friend.firstName} {friend.lastName}
          </h2>

          <p className="text-left text-gray-700">
            <strong>About:</strong>{" "}
            {friend.about || "No bio provided"}
          </p>

          <p className="text-left text-gray-700">
            <strong>Skills:</strong>{" "}
            {friend.skills?.length > 0
              ? friend.skills.join(", ")
              : "No skills added"}
          </p>

          <motion.button
            className="btn btn-primary bg-primary text-white w-full mt-3 hover:bg-primary-dark hover:shadow-lg"
            onClick={() => {
              if (friend._id) {
                navigate(`/chat/${friend._id}`);
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Chat with {friend.firstName}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FriendProfile;