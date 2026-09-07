import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUsers } from "../redux/userSlice";
import api from "../utils/api";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faHeart,
  faUserGroup,
  faRotateRight,
  faCompass,
} from "@fortawesome/free-solid-svg-icons";
import SwipeCard from "./SwipeCard";

const fadeIn = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Connections = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { users } = useSelector((state) => state.users);

  const [feedLoading, setFeedLoading] = useState(true);
  const [checkingFriends, setCheckingFriends] = useState(false);
  const [friendsCount, setFriendsCount] = useState(null);
  const [redirectIn, setRedirectIn] = useState(null);

  const topCardRef = useRef(null);
  const redirectTimer = useRef(null);

  const displayedUser = users[0] || null;
  const nextUser = users[1] || null;
  const feedEmpty = !feedLoading && users.length === 0;

  // ===============================
  // Fetch feed
  // ===============================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setFeedLoading(true);
        const response = await api.get("/feed");
        dispatch(setUsers(response.data.feedUsers || []));
      } catch (error) {
        console.error("Error fetching users:", error);
        dispatch(setUsers([]));
        toast.error("Couldn't load new profiles.");
      } finally {
        setFeedLoading(false);
      }
    };

    fetchUsers();
  }, [dispatch]);

  // ===============================
  // If the feed is empty, check whether the user already has
  // friends worth showing them instead of a dead-end screen.
  // ===============================
  useEffect(() => {
    if (!feedEmpty) return;

    let cancelled = false;

    const checkFriends = async () => {
      setCheckingFriends(true);
      try {
        const res = await api.get("/request/getAllUserFriends");
        if (cancelled) return;

        const count = (res.data.data || []).length;
        setFriendsCount(count);

        if (count > 0) setRedirectIn(4);
      } catch (err) {
        console.error("Error checking friends:", err);
        if (!cancelled) setFriendsCount(0);
      } finally {
        if (!cancelled) setCheckingFriends(false);
      }
    };

    checkFriends();

    return () => {
      cancelled = true;
    };
  }, [feedEmpty]);

  // ===============================
  // Countdown + auto-redirect to /friends
  // ===============================
  useEffect(() => {
    if (redirectIn === null) return;

    if (redirectIn <= 0) {
      navigate("/friends");
      return;
    }

    redirectTimer.current = setTimeout(() => {
      setRedirectIn((c) => c - 1);
    }, 1000);

    return () => clearTimeout(redirectTimer.current);
  }, [redirectIn, navigate]);

  const cancelRedirect = () => {
    clearTimeout(redirectTimer.current);
    setRedirectIn(null);
  };

  // ===============================
  // Swipe / action handling
  // ===============================
  const handleSwipeComplete = useCallback(
    async (actionType) => {
      const swipedUser = users[0];
      if (!swipedUser) return;

      // Optimistic removal — the card has already animated off screen
      dispatch(setUsers(users.slice(1)));

      try {
        await api.post(`/request/send/${actionType}/${swipedUser._id}`, {});
      } catch (error) {
        console.error(`Failed to ${actionType} user:`, error.response?.data || error);
        toast.error("That didn't save — please try again later.");
      }
    },
    [users, dispatch]
  );

  const triggerSwipe = (direction) => {
    topCardRef.current?.swipe(direction);
  };

  // ===============================
  // Loading state
  // ===============================
  if (feedLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="flex flex-col items-center gap-3 text-gray-400"
        >
          <span className="loading loading-dots loading-lg text-yellow-400" />
          <span className="text-sm">Finding people for you...</span>
        </motion.div>
      </div>
    );
  }

  // ===============================
  // Empty state
  // ===============================
  if (feedEmpty) {
    return (
      <div className="h-full flex items-center justify-center px-4">
        <Toaster position="bottom-center" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#07111f]/60 backdrop-blur-xl shadow-2xl px-6 py-8 text-center"
        >
          <div className="w-12 h-12 mx-auto rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faCompass} className="text-yellow-400 text-xl" />
          </div>

          <h2 className="text-white text-lg font-semibold mb-1">
            You're all caught up
          </h2>

          <p className="text-gray-400 text-xs mb-5">
            No new developers to show right now — check back soon for fresh profiles.
          </p>

          {checkingFriends ? (
            <span className="loading loading-dots loading-sm text-yellow-400" />
          ) : friendsCount > 0 ? (
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs text-gray-300 mb-3">
                {redirectIn !== null
                  ? `Taking you to your friends in ${redirectIn}s...`
                  : "You already have connections waiting."}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate("/friends")}
                  className="flex-1 h-9 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <FontAwesomeIcon icon={faUserGroup} className="text-[10px]" />
                  View Friends
                </button>

                {redirectIn !== null && (
                  <button
                    onClick={cancelRedirect}
                    className="h-9 px-3 rounded-lg border border-white/15 text-gray-300 hover:bg-white/10 text-xs transition"
                  >
                    Stay
                  </button>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-white/15 text-gray-200 hover:bg-white/10 text-xs font-medium transition"
            >
              <FontAwesomeIcon icon={faRotateRight} className="text-[10px]" />
              Refresh
            </button>
          )}
        </motion.div>
      </div>
    );
  }

  // ===============================
  // Card stack
  // ===============================
  return (
    <div className="h-full flex flex-col items-center justify-center px-4 py-4">
      <Toaster position="bottom-center" />

      <div className="relative w-full max-w-sm h-[460px] sm:h-[500px]">
        {nextUser && (
          <SwipeCard
            key={nextUser._id}
            user={nextUser}
            isTop={false}
            onSwipeComplete={() => {}}
            style={{ scale: 0.96, y: 12, opacity: 0.6, zIndex: 0 }}
          />
        )}

        {displayedUser && (
          <SwipeCard
            key={displayedUser._id}
            ref={topCardRef}
            user={displayedUser}
            isTop
            onSwipeComplete={handleSwipeComplete}
            style={{ zIndex: 1 }}
          />
        )}
      </div>

      <div className="flex items-center gap-6 mt-6">
        <button
          onClick={() => triggerSwipe("ignored")}
          aria-label="Pass"
          className="w-14 h-14 rounded-full bg-white/5 border border-white/15 text-red-400 flex items-center justify-center hover:bg-white/10 hover:scale-105 transition"
        >
          <FontAwesomeIcon icon={faXmark} className="text-xl" />
        </button>

        <button
          onClick={() => triggerSwipe("interested")}
          aria-label="Interested"
          className="w-14 h-14 rounded-full bg-yellow-400 text-black flex items-center justify-center hover:bg-yellow-300 hover:scale-105 transition shadow-lg"
        >
          <FontAwesomeIcon icon={faHeart} className="text-xl" />
        </button>
      </div>

      <p className="text-[11px] text-gray-500 mt-3">
        Swipe or tap to respond
      </p>
    </div>
  );
};

export default Connections;