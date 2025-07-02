import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const CLOUD_NAME = "dst2ejsyk";
const UPLOAD_PRESET = "chat-app";

const fadeIn = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    password: "",
    skills: "",
    about: "",
    profileImage: "",
  });

  const [loading, setLoading] = useState(true);
  const [picLoading, setPicLoading] = useState(false);

  const postDetails = (file) => {
    setPicLoading(true);
    if (!file) {
      toast.error("Please select an image.");
      setPicLoading(false);
      return;
    }

    if (file.type === "image/jpeg" || file.type === "image/png") {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", UPLOAD_PRESET);

      fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setFormData((prev) => ({ ...prev, profileImage: data.url }));
          toast.success("Image uploaded successfully!");
          setPicLoading(false);
        })
        .catch((err) => {
          console.error("Upload error:", err);
          toast.error("Failed to upload image.");
          setPicLoading(false);
        });
    } else {
      toast.error("Please select a JPG or PNG image.");
      setPicLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/userProfile", {
          withCredentials: true,
        });
        setFormData(data.user);
      } catch (error) {
        console.error("Fetch error:", error);
      }
      setLoading(false);
    };
    fetchUserProfile();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:8000/api/updateUserProfile", formData, {
        withCredentials: true,
      });
      toast.success("Profile updated!");
      navigate("/myprofile");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <motion.div
        className="flex justify-center items-center h-[60vh]"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <span className="loading loading-dots loading-lg text-primary"></span>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex justify-center items-center mt-20"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <Toaster position="bottom-center" />
      <div className="card bg-secondary shadow-xl p-8 rounded-lg w-96 text-white">
        <h2 className="text-xl font-semibold text-center mb-4">Update Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {["firstName", "lastName", "email", "phone", "age", "skills", "about"].map(
            (field) => (
              <input
                key={field}
                type={field === "email" ? "email" : "text"}
                name={field}
                placeholder={field[0].toUpperCase() + field.slice(1)}
                className="input input-bordered bg-white text-black w-full py-2 px-3 rounded-md"
                value={formData[field]}
                onChange={handleChange}
              />
            )
          )}

          <select
            name="gender"
            className="select select-bordered bg-white text-black w-full py-2 px-3 rounded-md"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="" disabled>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
            className="file-input file-input-bordered w-full max-w-xs"
          />

          <motion.button
            type="submit"
            disabled={picLoading}
            className="btn btn-primary w-full"
          >
            {picLoading ? "Uploading..." : "Save Changes"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default UpdateProfile;