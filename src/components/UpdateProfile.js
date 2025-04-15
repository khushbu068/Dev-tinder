import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

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
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/userProfile", { withCredentials: true });
        setFormData(response.data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
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
      await axios.put("http://localhost:8000/api/updateUserProfile", formData, { withCredentials: true });
      console.log("Updated Data:", formData);
      navigate("/myprofile");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <motion.div
      className="flex justify-center items-center mt-20"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="card bg-secondary shadow-xl p-8 rounded-lg w-96 text-white">
        <h2 className="text-xl font-semibold text-center mb-4">Update Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="input input-bordered bg-white text-black w-full py-2 px-3 rounded-md"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="input input-bordered bg-white text-black w-full py-2 px-3 rounded-md"
            value={formData.lastName}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered bg-white text-black w-full py-2 px-3 rounded-md"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered bg-white text-black w-full py-2 px-3 rounded-md"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            className="input input-bordered bg-white text-black w-full py-2 px-3 rounded-md"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            type="text"
            name="age"
            placeholder="Age"
            className="input input-bordered bg-white text-black w-full py-2 px-3 rounded-md"
            value={formData.age}
            onChange={handleChange}
          />
          <select
            name="gender"
            className="select select-bordered bg-white text-black w-full py-2 px-3 rounded-md"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            type="text"
            name="skills"
            placeholder="Skills"
            className="input input-bordered bg-white text-black w-full py-2 px-3 rounded-md"
            value={formData.skills}
            onChange={handleChange}
          />
           <input
            type="text"
            name="about"
            placeholder="Bio"
            className="input input-bordered bg-white text-black w-full py-2 px-3 rounded-md"
            value={formData.about}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="btn btn-primary bg-primary text-white w-full py-2 rounded-md"
          >
            Save Changes
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default UpdateProfile;
