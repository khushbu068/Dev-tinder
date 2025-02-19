import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchProfileData = async () => {
    try {
      setErrorMessage("");
      const profileData = await axios.get("http://localhost:8000/api/userProfile", {
        withCredentials: true,
      });
      console.log(profileData)
      if (profileData.data) {
        setUser(profileData.data);
      } else {
        alert("No user found! Please log in.");
        navigate("/login");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Error in fetching your profile");
      alert("Please try again later");
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="card bg-base-100 shadow-xl p-6 w-96">
        <h2 className="text-xl font-semibold text-center mb-4">My Profile</h2>
        {user ? (
          <>
            <div className="mb-3"><strong>First Name:</strong> {user.firstName}</div>
            <div className="mb-3"><strong>Last Name:</strong> {user.lastName}</div>
            <div className="mb-3"><strong>Email:</strong> {user.email}</div>
            {errorMessage && (
              <p className="text-red-500 text-sm text-center mb-3">{errorMessage}</p>
            )}
            <button className="btn btn-primary w-full mt-4" onClick={() => navigate("/update-profile")}>
              Update Profile
            </button>
          </>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
