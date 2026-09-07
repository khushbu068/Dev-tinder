import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPen,
  faUser,
  faEnvelope,
  faCircleUser,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import api from "../utils/api";

const fadeIn = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const MyProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await api.get("/userProfile");
      setUser(response.data.user);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const initials =
    `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase();

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
          <p className="text-xs">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  // ===============================
  // Error / Not Found
  // ===============================
  if (error || !user) {
    return (
      <div className="h-full flex justify-center items-center px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="w-[340px] rounded-2xl border border-white/10 bg-[#07111f]/60 backdrop-blur-xl shadow-2xl px-6 py-8 text-center"
        >
          <div className="w-11 h-11 mx-auto rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faUser} className="text-yellow-400 text-lg" />
          </div>

          <h2 className="text-white text-lg font-semibold mb-1">
            {error ? "Couldn't load your profile" : "Profile not found"}
          </h2>

          <p className="text-gray-400 text-xs mb-5">
            {error
              ? "Something went wrong while fetching your data."
              : "We couldn't find an account to show here."}
          </p>

          <button
            type="button"
            onClick={fetchUserProfile}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-semibold transition"
          >
            <FontAwesomeIcon icon={faRotateRight} className="text-[10px]" />
            Try again
          </button>
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
            {user.profileImage && !imgFailed ? (
              <img
                src={user.profileImage}
                alt={`${user.firstName || "User"}'s profile`}
                onError={() => setImgFailed(true)}
                className="w-20 h-20 rounded-full object-cover border-2 border-yellow-400/40"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-yellow-400/10 border-2 border-yellow-400/40 flex items-center justify-center">
                {initials ? (
                  <span className="text-yellow-400 text-xl font-semibold">
                    {initials}
                  </span>
                ) : (
                  <FontAwesomeIcon
                    icon={faCircleUser}
                    className="text-yellow-400 text-3xl"
                  />
                )}
              </div>
            )}

            <h2 className="text-white text-lg font-semibold mt-3">
              {[user.firstName, user.lastName].filter(Boolean).join(" ") ||
                "Unnamed Developer"}
            </h2>

            {user.email && (
              <p className="text-gray-400 text-xs flex items-center gap-1.5 mt-1">
                <FontAwesomeIcon icon={faEnvelope} className="text-[10px]" />
                {user.email}
              </p>
            )}
          </div>

          {/* About */}
          <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 mb-5">
            <p className="text-[11px] text-gray-400 mb-1">About</p>
            <p className="text-sm text-gray-200 leading-relaxed">
              {user.about || "No bio added yet."}
            </p>
          </div>

          {/* Update Button */}
          <motion.button
            type="button"
            onClick={() => navigate("/updateprofile")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full h-9 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-semibold transition flex items-center justify-center gap-2 shadow-lg"
          >
            <FontAwesomeIcon icon={faPen} className="text-[10px]" />
            Update Profile
          </motion.button>

          {/* Bottom Accent */}
          <div className="mt-5 flex items-center justify-center gap-2">
            <div className="h-px w-10 bg-white/10" />
            <span className="text-[9px] text-gray-500">DEV-TINDER</span>
            <div className="h-px w-10 bg-white/10" />
          </div>

        </motion.div>
      </motion.div>
    </div>
  );
};

export default MyProfile;