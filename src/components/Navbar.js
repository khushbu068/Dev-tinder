import React, { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSearch,
  faUser,
  faBell,
  faUserGroup,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../utils/api";
import { socket } from "../utils/socket";

const fadeIn = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [unseenCount, setUnseenCount] = useState(0);

  const navigate = useNavigate();

  // Reference for hamburger menu area
  const menuRef = useRef(null);

  const receiveRequests = useSelector(
    (state) => state.requests.receiveRequests
  );

  const { token } = useSelector((state) => state.users);

  const authToken = token || localStorage.getItem("token");

  // ===============================
  // Fetch unseen messages
  // ===============================

  const fetchUnseenCount = useCallback(async () => {
    if (!authToken) return;

    try {
      const { data } = await api.get("/message/unseen-count", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setUnseenCount(data.count || 0);
    } catch (err) {
      console.error(
        "[Navbar] Unseen message fetch failed:",
        err.message
      );
    }
  }, [authToken]);

  // ===============================
  // Socket listener
  // ===============================

  useEffect(() => {
    if (!authToken) return;

    fetchUnseenCount();

    socket.on("new message", fetchUnseenCount);

    return () => {
      socket.off("new message", fetchUnseenCount);
    };
  }, [authToken, fetchUnseenCount]);

  // ===============================
  // Close menu when clicking outside
  // ===============================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ===============================
  // Close menu with Escape
  // ===============================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  // ===============================
  // Navigation helper
  // ===============================

  const handleNavigation = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  // ===============================
  // Logout
  // ===============================

  const handleLogout = async () => {
    try {
      await api.post("/logOut", {});

      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      setMenuOpen(false);

      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="bg-[#205781] text-white shadow-md py-1 px-4 sm:px-6 flex items-center justify-between relative"
    >
      {/* ===============================
          LEFT - Hamburger
      =============================== */}

      <div
        ref={menuRef}
        className="relative"
      >
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          className="p-2 rounded-md hover:bg-[#4F959D] transition-colors duration-200"
        >
          <FontAwesomeIcon
            icon={faBars}
            className="h-4 w-4"
          />
        </button>

        {/* ===============================
            Dropdown Menu
        =============================== */}

        {menuOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-2 w-28 bg-[#4F959D] text-white shadow-xl rounded-lg overflow-hidden z-50 border border-white/10"
          >
            <li>
              <button
                type="button"
                onClick={() => handleNavigation("/login")}
                className="w-full text-left text-xs px-2  py-1.5 hover:bg-[#98D2C0] hover:text-gray-900 transition-colors duration-200"
              >
                Home
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={() =>
                  handleNavigation("/myprofile")
                }
                className="w-full text-left text-xs px-2  py-1.5 hover:bg-[#98D2C0] hover:text-gray-900 transition-colors duration-200"
              >
                My Profile
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={() =>
                  handleNavigation("/friends")
                }
                className="w-full text-left text-xs px-2  py-1.5 hover:bg-[#98D2C0] hover:text-gray-900 transition-colors duration-200"
              >
                Friends
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left text-xs px-2 text-red-500 py-1.5 hover:bg-red-100 transition-colors duration-200"
              >
                Logout
              </button>
            </li>
          </motion.ul>
        )}
      </div>

      {/* ===============================
          CENTER - App Name
      =============================== */}

      {/* <h1 className="text-lg sm:text-xl font-semibold tracking-wide">
        My App
      </h1> */}

      {/* ===============================
          RIGHT - Navigation Icons
      =============================== */}

      <div className="flex items-center gap-1 sm:gap-1.5">

        {/* Search */}
        <button
          type="button"
          aria-label="Search"
          className="p-2 rounded-md hover:bg-[#4F959D] transition-colors duration-200"
        >
          <FontAwesomeIcon
            icon={faSearch}
            className="h-4 w-4"
          />
        </button>

        {/* Profile */}
        <button
          type="button"
          aria-label="Profile"
          onClick={() => navigate("/myprofile")}
          className="p-2 rounded-md hover:bg-[#4F959D] transition-colors duration-200"
        >
          <FontAwesomeIcon
            icon={faUser}
            className="h-4 w-4"
          />
        </button>

        {/* Notifications */}
        <Link
          to="/receive-requests"
          aria-label="Connection requests"
          className="relative p-2 rounded-md hover:bg-[#4F959D] transition-colors duration-200"
        >
          <FontAwesomeIcon
            icon={faBell}
            className="h-4 w-4"
          />

          {receiveRequests?.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full px-1">
              {receiveRequests.length > 9
                ? "9+"
                : receiveRequests.length}
            </span>
          )}
        </Link>

        {/* Connections */}
        <Link
          to="/connections"
          aria-label="Connections"
          className="relative p-2 rounded-md hover:bg-[#4F959D] transition-colors duration-200"
        >
          <FontAwesomeIcon
            icon={faUserGroup}
            className="h-4 w-4"
          />
        </Link>

        {/* Chat */}
        <Link
          to="/myChat"
          aria-label="Messages"
          className="relative p-2 rounded-md hover:bg-[#4F959D] transition-colors duration-200"
        >
          <FontAwesomeIcon
            icon={faComments}
            className="h-4 w-4"
          />

          {unseenCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full px-1 animate-pulse">
              {unseenCount > 9
                ? "9+"
                : unseenCount}
            </span>
          )}
        </Link>
      </div>
    </motion.nav>
  );
};

export default Navbar;