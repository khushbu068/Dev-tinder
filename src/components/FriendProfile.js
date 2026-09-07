import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faComment,
  faCircleUser,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import api from "../utils/api";
import ProfilePhotoModal from "./ProfilePhotoModal";

const fadeIn = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const FriendProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [zoomedPhoto, setZoomedPhoto] = useState(null);

  const fetchFriendProfile = async () => {
    if (!id) {
      console.error("Invalid friend ID");
      setError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const response = await api.get(`/request/getFriendProfile/${id}`);
      setFriend(response.data.user);
    } catch (error) {
      console.error("Error fetching friend's profile:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const initials = `${friend?.firstName?.[0] || ""}${
    friend?.lastName?.[0] || ""
  }`.toUpperCase();

  const openZoom = () => {
    if (!friend) return;
    setZoomedPhoto({
      src: friend.profileImage?.trim() || null,
      initials,
      alt: `${friend.firstName}'s profile`,
    });
  };

  // ===============================
  // Loading
  // ===============================
  if (loading) {
    return (
      <div className="h-full flex justify-center items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="flex flex-col items-center gap-3 text-gray-400"
        >
          <span className="loading loading-dots loading-lg text-yellow-400" />
          <p className="text-xs">Loading profile...</p>
        </motion.div>
      </div>
    );
  }

  // ===============================
  // Error / Not Found
  // ===============================
  if (error || !friend) {
    return (
      <div className="h-full flex justify-center items-center px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="w-[340px] rounded-2xl border border-white/10 bg-[#07111f]/60 backdrop-blur-xl shadow-2xl px-6 py-8 text-center"
        >
          <div className="w-11 h-11 mx-auto rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faCircleUser} className="text-yellow-400 text-lg" />
          </div>

          <h2 className="text-white text-lg font-semibold mb-1">
            {error ? "Couldn't load this profile" : "Friend not found"}
          </h2>

          <p className="text-gray-400 text-xs mb-5">
            {error
              ? "Something went wrong while fetching this profile."
              : "This user may no longer be in your friends list."}
          </p>

          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="h-9 px-4 rounded-lg border border-white/15 text-gray-200 hover:bg-white/10 text-xs font-medium transition"
            >
              Go back
            </button>

            {error && (
              <button
                type="button"
                onClick={fetchFriendProfile}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-semibold transition"
              >
                <FontAwesomeIcon icon={faRotateRight} className="text-[10px]" />
                Try again
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // ===============================
  // Profile
  // ===============================
  return (
    <div className="h-full">

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="pt-4 px-4 pb-4 flex items-center gap-1.5 text-[13px] font-semibold text-gray-200 hover:text-white transition"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="text-[12px]" />
        Back
      </button>

      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="flex justify-center items-center px-4 py-2"
      >
        <motion.div
          initial={{ y: -30, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-[340px] sm:w-[380px] rounded-2xl border border-white/10 bg-[#07111f]/60 backdrop-blur-xl shadow-2xl px-6 py-6"
        >

          {/* Avatar */}
          <div className="flex flex-col items-center mb-5 mt-2">
            <button
              type="button"
              onClick={openZoom}
              aria-label={`View ${friend.firstName}'s photo`}
              className="rounded-full hover:opacity-85 transition"
            >
              {friend.profileImage?.trim() ? (
                <img
                  src={friend.profileImage}
                  alt={`${friend.firstName}'s profile`}
                  className="w-20 h-20 rounded-full object-cover border-2 border-yellow-400/40"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-yellow-400/10 border-2 border-yellow-400/40 flex items-center justify-center">
                  {initials ? (
                    <span className="text-yellow-400 text-xl font-semibold">
                      {initials}
                    </span>
                  ) : (
                    <FontAwesomeIcon icon={faCircleUser} className="text-yellow-400 text-3xl" />
                  )}
                </div>
              )}
            </button>

            <h2 className="text-white text-lg font-semibold mt-3">
              {friend.firstName} {friend.lastName}
            </h2>

            <p className="text-[11px] text-gray-400 mt-0.5">Connected</p>
          </div>

          {/* About */}
          <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 mb-3">
            <p className="text-[11px] text-gray-400 mb-1">About</p>
            <p className="text-sm text-gray-200 leading-relaxed">
              {friend.about || "No bio provided"}
            </p>
          </div>

          {/* Skills */}
          <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 mb-5">
            <p className="text-[11px] text-gray-400 mb-1.5">Skills</p>

            {friend.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {friend.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] px-2 py-1 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No skills added</p>
            )}
          </div>

          {/* Chat Button */}
          <motion.button
            type="button"
            onClick={() => navigate(`/chat/${friend._id}`)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full h-9 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-semibold transition flex items-center justify-center gap-2 shadow-lg"
          >
            <FontAwesomeIcon icon={faComment} className="text-[10px]" />
            Chat with {friend.firstName}
          </motion.button>

        </motion.div>
      </motion.div>

      <ProfilePhotoModal photo={zoomedPhoto} onClose={() => setZoomedPhoto(null)} />
    </div>
  );
};

export default FriendProfile;