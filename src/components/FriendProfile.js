import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

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

        const response = await axios.get(
          `http://localhost:8000/api/request/getFriendProfile/${id}`,
          { withCredentials: true }
        );

        setFriend(response.data.user);
      } catch (error) {
        console.error("Error fetching friend's profile:", error);
      }
      setLoading(false);
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
        <span className="loading loading-dots loading-lg text-primary"></span>
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
    <motion.div className="flex justify-center items-center  pt-5">
      <motion.div className="card w-96 bg-base-100 shadow-xl">
        <figure>
            <img
              src={
                friend.profileImage?.trim()
                  ? friend.profileImage
                  : "data:image/png;base64,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"
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
            <strong>About:</strong> {friend.about || "No bio provided"}
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
              } else {
                console.error("Friend ID is undefined, cannot navigate");
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