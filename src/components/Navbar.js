import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { faBars, faSearch, faUser, faBell } from "@fortawesome/free-solid-svg-icons"; // Added faBell
import { useNavigate, Link } from "react-router-dom"; 
import axios from "axios";

const fadeIn = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
      {/* Left Side - Toggle Menu */}
      <div className="relative">
        <button onClick={() => setMenuOpen(!menuOpen)} className="btn btn-ghost">
          <FontAwesomeIcon icon={faBars} className="h-6 w-6 text-white" />
        </button>

        {menuOpen && (
          <ul className="absolute left-0 mt-2 w-48 bg-[#4F959D] text-white shadow-lg rounded-md overflow-hidden transition-transform duration-200">
            <li className="hover:bg-[#98D2C0] px-4 py-2 cursor-pointer" onClick={() => { navigate("/home"); setMenuOpen(false); }}>
              Home
            </li>
            <li className="hover:bg-[#98D2C0] px-4 py-2 cursor-pointer" onClick={() => { navigate("/myprofile"); setMenuOpen(false); }}>
              My Profile
            </li>
            <li className="hover:bg-red-500 px-4 py-2 cursor-pointer" onClick={handleLogout}>
              Logout
            </li>
            <li className="hover:bg-[#98D2C0] px-4 py-2 cursor-pointer" onClick={() => { navigate("/friends"); }}>
              Friends
            </li>
          </ul>
        )}
      </div>

      {/* Middle - Branding */}
      <h1 className="text-xl font-semibold tracking-wide">My App</h1>

      {/* Right Side - Icons */}
      <div className="flex items-center gap-4">
        <button className="hover:bg-[#4F959D] p-2 rounded-md transition">
          <FontAwesomeIcon icon={faSearch} className="h-5 w-5 text-white" />
        </button>
        <button className="hover:bg-[#4F959D] p-2 rounded-md transition" onClick={() => navigate("/myprofile")}>
          <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-white" />
        </button>

        {/* Requests Button */}
        <Link to="/receive-requests" className="relative">
          <FontAwesomeIcon icon={faBell} className="h-6 w-6 text-white hover:text-gray-300 transition" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">!</span>
        </Link>

        {/* Connections Button */}
        <Link to="/connections" className="btn btn-outline">
          Connections
        </Link>
      </div>
    </motion.nav>
  );
};

export default Navbar;
