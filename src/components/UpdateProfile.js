import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setFormData({ ...storedUser, phone: "", age: "", gender: "", skills: "" });
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify(formData));
    alert("Profile updated successfully!");
    navigate("/myprofile");
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="card w-full max-w-lg max-h-screen overflow-y-auto p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Update Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" name="firstName" value={formData.firstName} placeholder="First Name" className="input input-bordered w-full" onChange={handleChange} />
          <input type="text" name="lastName" value={formData.lastName} placeholder="Last Name" className="input input-bordered w-full" onChange={handleChange} />
          <input type="email" name="email" value={formData.email} placeholder="Email" className="input input-bordered w-full" onChange={handleChange} />
          <input type="text" name="phone" placeholder="Phone" className="input input-bordered w-full" onChange={handleChange} />
          <input type="number" name="age" placeholder="Age" className="input input-bordered w-full" onChange={handleChange} />
          <select name="gender" className="input input-bordered w-full" onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input type="password" name="password" placeholder="Password" className="input input-bordered w-full" onChange={handleChange} />
          <input type="text" name="skills" placeholder="Skills" className="input input-bordered w-full" onChange={handleChange} />

          <button type="submit" className="btn btn-primary w-full">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
