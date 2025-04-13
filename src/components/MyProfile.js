import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const fadeIn = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const MyProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/userProfile",
          { withCredentials: true }
        );
        console.log("API Response:", response.data);
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
      setLoading(false);
    };
    fetchUserProfile();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!user) return <div className="text-center mt-5">User not found.</div>;

  return (
    <motion.div
      className="flex justify-center items-center mt-20"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="card bg-secondary shadow-xl p-6 w-96 text-white">
        <h2 className="text-xl font-semibold text-center mb-4">My Profile</h2>
        <div className="mb-3">
          <strong>First Name:</strong> {user.firstName || "N/A"}
        </div>
        <div className="mb-3">
          <strong>Last Name:</strong> {user.lastName || "N/A"}
        </div>
        <div className="mb-3">
          <strong>Email:</strong> {user.email || "N/A"}
        </div>
        <div className="mb-3">
          <strong>About:</strong> {user.about || "No skills added"}
        </div>
        <button
          className="btn btn-primary bg-primary text-white w-full mt-4"
          onClick={() => navigate("/updateprofile")}
        >
          Update Profile
        </button>
      </div>
    </motion.div>
  );
};

export default MyProfile;