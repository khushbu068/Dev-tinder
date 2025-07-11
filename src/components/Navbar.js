import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { useSelector } from "react-redux";
import { socket } from "../utils/socket";

const fadeIn = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [unseenCount, setUnseenCount] = useState(0);

  const navigate = useNavigate();
  const receiveRequests = useSelector((state) => state.requests.receiveRequests);
  const { token } = useSelector((state) => state.users);
  const authToken = token || localStorage.getItem("token");

  const fetchUnseenCount = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/message/unseen-count", {
        headers: { Authorization: `Bearer ${authToken}` },
        withCredentials: true,
      });
      setUnseenCount(data.count || 0);
    } catch (err) {
      console.error(" [Navbar] Unseen message fetch failed:", err.message);
    }
  };

  useEffect(() => {
    if (authToken) fetchUnseenCount();
    socket.on("new message", fetchUnseenCount);
    return () => socket.off("new message", fetchUnseenCount);
  }, [authToken]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/logOut", {}, { withCredentials: true });
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
      className="bg-[#205781] text-white shadow-md py-3 px-6 flex items-center justify-between relative"
    >
     =
      <div className="relative">
        <button onClick={() => setMenuOpen(!menuOpen)} className="btn btn-ghost">
          <FontAwesomeIcon icon={faBars} className="h-6 w-6 text-white" />
        </button>
        {menuOpen && (
          <ul className="absolute left-0 mt-2 w-48 bg-[#4F959D] text-white shadow-lg rounded-md overflow-hidden transition-transform duration-200 z-10">
            <li
              className="hover:bg-[#98D2C0] px-4 py-2 cursor-pointer"
              onClick={() => {
                navigate("/login");
                setMenuOpen(false);
              }}
            >
              Home
            </li>
            <li
              className="hover:bg-[#98D2C0] px-4 py-2 cursor-pointer"
              onClick={() => {
                navigate("/myprofile");
                setMenuOpen(false);
              }}
            >
              My Profile
            </li>
            <li
              className="hover:bg-[#98D2C0] px-4 py-2 cursor-pointer"
              onClick={() => {
                navigate("/friends");
                setMenuOpen(false);
              }}
            >
              Friends
            </li>
            <li className="hover:bg-red-500 px-4 py-2 cursor-pointer" onClick={handleLogout}>
              Logout
            </li>
          </ul>
        )}
      </div>

     
      <h1 className="text-xl font-semibold tracking-wide">My App</h1>

      <div className="flex items-center gap-4">
        <button className="hover:bg-[#4F959D] p-2 rounded-md transition">
          <FontAwesomeIcon icon={faSearch} className="h-5 w-5 text-white" />
        </button>

        <button
          className="hover:bg-[#4F959D] p-2 rounded-md transition"
          onClick={() => navigate("/myprofile")}
        >
          <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-white" />
        </button>

        <Link to="/receive-requests" className="relative">
          <FontAwesomeIcon
            icon={faBell}
            className="h-6 w-6 text-white hover:text-gray-300 transition"
          />
          {receiveRequests?.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {receiveRequests.length > 9 ? "9+" : receiveRequests.length}
            </span>
          )}
        </Link>

        <Link to="/connections" className="relative">
          <FontAwesomeIcon
            icon={faUserGroup}
            className="h-6 w-6 text-white hover:text-gray-300 transition"
          />
        </Link>

      
        <Link to="/myChat" className="relative">
          <FontAwesomeIcon
            icon={faComments}
            className="h-6 w-6 text-white hover:text-gray-300 transition"
          />
          {unseenCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-pulse">
              {unseenCount > 9 ? "9+" : unseenCount}
            </span>
          )}
        </Link>
      </div>
    </motion.nav>
  );
};

export default Navbar;