import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faComment,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import api from "../utils/api";
import ProfilePhotoModal from "./ProfilePhotoModal";

const Friends = () => {
  const navigate = useNavigate();

  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zoomedPhoto, setZoomedPhoto] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await api.get("/request/getAllUserFriends");
        setFriends(response.data.data || []);
      } catch (error) {
        console.error("Error fetching friends:", error);
        setFriends([]);
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
      <div className="h-full flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-3 text-gray-400"
        >
          <span className="loading loading-dots loading-lg text-yellow-400" />
          <p className="text-xs">Loading your friends...</p>
        </motion.div>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="h-full flex justify-center items-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-11 h-11 mx-auto rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faUserGroup} className="text-yellow-400 text-lg" />
          </div>
          <h2 className="text-white text-base font-semibold mb-1">
            No friends yet
          </h2>
          <p className="text-gray-400 text-xs">
            Connect with developers to see them here.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap justify-center gap-4 max-w-6xl mx-auto"
      >
        {friends.map((friend, index) => {
          const initials = `${friend.firstName?.[0] || ""}${
            friend.lastName?.[0] || ""
          }`.toUpperCase();

          const openZoom = () =>
            setZoomedPhoto({
              src: friend.profileImage?.trim() || null,
              initials,
              alt: `${friend.firstName}'s profile`,
            });

          return (
            <motion.div
              key={friend._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index, 8) * 0.05 }}
              className="w-full sm:w-[280px] rounded-2xl border border-white/10 bg-[#07111f]/60 backdrop-blur-xl shadow-lg p-4 flex flex-col hover:border-yellow-400/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={openZoom}
                  aria-label={`View ${friend.firstName}'s photo`}
                  className="shrink-0 rounded-full hover:opacity-80 transition"
                >
                  {friend.profileImage?.trim() ? (
                    <img
                      src={friend.profileImage}
                      alt={`${friend.firstName}'s profile`}
                      className="w-14 h-14 rounded-full object-cover border-2 border-yellow-400/40"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-yellow-400/10 border-2 border-yellow-400/40 flex items-center justify-center">
                      <span className="text-yellow-400 text-sm font-semibold">
                        {initials || "?"}
                      </span>
                    </div>
                  )}
                </button>

                <div className="min-w-0">
                  <h3 className="text-white text-sm font-semibold truncate">
                    {friend.firstName} {friend.lastName}
                  </h3>
                  <p className="text-[11px] text-gray-400">Connected</p>
                </div>
              </div>

              <p className="text-xs text-gray-300 mt-3 leading-relaxed line-clamp-2">
                {friend.about || "No bio provided"}
              </p>

              <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
                <button
                  onClick={() => handleProfileClick(friend._id)}
                  className="flex-1 h-8 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-white text-[11px] font-medium transition flex items-center justify-center gap-1.5"
                >
                  <FontAwesomeIcon icon={faUser} className="text-[10px]" />
                  Profile
                </button>

                <button
                  onClick={() => navigate(`/chat/${friend._id}`)}
                  className="flex-1 h-8 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black text-[11px] font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <FontAwesomeIcon icon={faComment} className="text-[10px]" />
                  Chat
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <ProfilePhotoModal photo={zoomedPhoto} onClose={() => setZoomedPhoto(null)} />
    </div>
  );
};

export default Friends;