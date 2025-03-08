import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const toggleSignup = () => {
    setIsSignup(!isSignup);
    setErrorMessage("");
  };

  const signupUser = async () => {
    setErrorMessage("");
    const userData = {
      firstName: firstNameRef.current?.value,
      lastName: lastNameRef.current?.value,
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/signUp",
        userData
      );
      console.log("Signup Response:", response.data);
      alert("Signup successful");
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Signup failed");
    }
  };

  const loginUser = async () => {
    setErrorMessage("");
    const userData = {
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/loginUser",
        userData,
        {
          withCredentials: true,
        }
      );
      console.log("Login Response:", response.data);
      alert("Login successful");
      navigate("/myprofile");
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Login failed");
    }
  };

  const handleSubmit = () => {
    isSignup ? signupUser() : loginUser();
  };

  return (
    <motion.div
      className="flex justify-center items-center p-7"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-secondary max-w-sm w-full shadow-lg p-6 rounded-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl text-black font-semibold text-center mb-4">
          {isSignup ? "Sign Up" : "Login"}
        </h2>

        {isSignup && (
          <>
            <motion.input
              type="text"
              placeholder="First Name"
              ref={firstNameRef}
              className="input input-bordered bg-gray-100 text-black w-full mb-4 py-2"
              whileFocus={{ scale: 1.05 }}
            />
            <motion.input
              type="text"
              placeholder="Last Name"
              ref={lastNameRef}
              className="input input-bordered bg-gray-100 text-black w-full mb-4 py-2"
              whileFocus={{ scale: 1.05 }}
            />
          </>
        )}

        <motion.input
          type="email"
          placeholder="Email"
          ref={emailRef}
          className="input input-bordered bg-gray-100 text-black w-full mb-4 py-2"
          whileFocus={{ scale: 1.05 }}
        />

        <div className="relative w-full mb-4">
          <motion.input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            ref={passwordRef}
            className="input input-bordered bg-gray-100 text-black w-full py-2 pr-10"
            whileFocus={{ scale: 1.05 }}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="text-gray-600"
            />
          </button>
        </div>

        {errorMessage && (
          <motion.p
            className="text-red-500 text-sm text-center mb-3 p-2 bg-red-100 rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {errorMessage}
          </motion.p>
        )}

        <motion.button
          className="btn btn-primary bg-primary text-white w-full py-2"
          onClick={handleSubmit}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSignup ? "Sign Up" : "Login"}
        </motion.button>

        <p
          className="text-center text-black mt-4 cursor-pointer hover:underline"
          onClick={toggleSignup}
        >
          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Login;
