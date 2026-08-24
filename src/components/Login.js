import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCode,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { loginSuccess, setUsers } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import api from "../utils/api";

const fadeIn = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      firstName: firstNameRef.current?.value.trim(),
      lastName: lastNameRef.current?.value.trim(),
      email: emailRef.current?.value.trim(),
      password: passwordRef.current?.value.trim(),
    };

    try {
      const response = await api.post("/SignUp", userData);

      console.log("Signup Response:", response.data);

      alert("Signup successful");

      setIsSignup(false);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.error || "Signup failed"
      );
    }
  };

  const loginUser = async () => {
    setErrorMessage("");

    const userData = {
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    };

    try {
      const response = await api.post(
        "/loginUser",
        userData
      );

      console.log("Login Response:", response.data);

      localStorage.setItem(
        "token",
        response.data.token
      );

      dispatch(
        loginSuccess({
          token: response.data.token,
          user: response.data.user,
        })
      );

      dispatch(setUsers([response.data.user]));

      alert("Login successful");

      navigate("/connections");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.error || "Login failed"
      );
    }
  };

  const handleSubmit = () => {
    isSignup ? signupUser() : loginUser();
  };

  return (

      <div className=" h-full">

  {/* Back Button - Outside Card */}
  <button
    type="button"
    onClick={() => navigate("/")}
    className="pt-4 px-4 pb-4 flex items-center gap-1.5 text-[13px] font-semibold text-gray-200 hover:text-white transition"
  >
    <FontAwesomeIcon
      icon={faArrowLeft}
      className="text-[12px] font-semibold"
    />
    Back
  </button>
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="relative  flex justify-center items-center px-4 py-2 "
    >
      {/* Login Card */}
  <motion.div
    initial={{
      y: -30,
      opacity: 0,
      scale: 0.95,
    }}
    animate={{
      y: 0,
      opacity: 1,
      scale: 1,
    }}
    transition={{
      duration: 0.5,
      delay: 0.1,
    }}
    className="relative w-[340px] sm:w-[360px] rounded-2xl border border-white/50 bg-[#07111f]/60 backdrop-blur-xl shadow-2xl px-6 py-6"
  >


        {/* Top Icon */}
        <div className="flex justify-center mb-4 mt-2">
          <div className="w-11 h-11 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center">
            <FontAwesomeIcon
              icon={faCode}
              className="text-yellow-400 text-lg"
            />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-5">
          <h2 className="text-xl font-semibold text-white">
            {isSignup
              ? "Create your account"
              : "Welcome back"}
          </h2>

          <p className="text-[11px] text-gray-400 mt-1">
            {isSignup
              ? "Join the developer community"
              : "Login to continue to Dev-Tinder"}
          </p>
        </div>

        {/* Signup Fields */}
        {isSignup && (
          <div className="grid grid-cols-2 gap-2 mb-2">
            <motion.input
              type="text"
              placeholder="First Name"
              ref={firstNameRef}
              className="w-full h-9 px-3 rounded-lg border border-white/15 bg-white/10 text-white text-xs placeholder:text-gray-300 placeholder:opacity-100 outline-none focus:border-cyan-400/60 focus:bg-white/[0.14] transition"
            />

            <motion.input
              type="text"
              placeholder="Last Name"
              ref={lastNameRef}
              className="w-full h-9 px-3 rounded-lg border border-white/15 bg-white/10 text-white text-xs placeholder:text-gray-300 placeholder:opacity-100 outline-none focus:border-cyan-400/60 focus:bg-white/[0.14] transition"
            />
          </div>
        )}

        {/* Email */}
        <motion.input
          type="email"
          placeholder="Email address"
          ref={emailRef}
          className="w-full h-9 px-3 rounded-lg border border-white/15 bg-white/10 text-white text-xs placeholder:text-gray-300 placeholder:opacity-100 outline-none focus:border-cyan-400/60 focus:bg-white/[0.14] transition mb-2"
        />

        {/* Password */}
        <div className="relative w-full mb-3">
          <motion.input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            ref={passwordRef}
            className="w-full h-9 px-3 pr-9 rounded-lg border border-white/15 bg-white/10 text-white text-xs placeholder:text-gray-300 placeholder:opacity-100 outline-none focus:border-cyan-400/60 focus:bg-white/[0.14] transition"
          />

          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition"
            onClick={() =>
              setShowPassword(!showPassword)
            }
          >
            <FontAwesomeIcon
              icon={
                showPassword
                  ? faEyeSlash
                  : faEye
              }
              className="text-xs"
            />
          </button>
        </div>

        {/* Error */}
        {errorMessage && (
          <motion.p
            className="text-red-400 text-[11px] text-center mb-3"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {errorMessage}
          </motion.p>
        )}

        {/* Submit */}
        <motion.button
          type="button"
          className="w-full h-9 rounded-lg bg-yellow-400 text-black text-xs font-semibold hover:bg-yellow-300 transition flex items-center justify-center gap-2 shadow-lg"
          onClick={handleSubmit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          {isSignup ? "Create Account" : "Login"}

          <FontAwesomeIcon
            icon={faArrowRight}
            className="text-[10px]"
          />
        </motion.button>

        {/* Toggle */}
        <div className="text-center mt-4">
          <p
            className="text-[11px] text-gray-300 cursor-pointer hover:text-cyan-300 transition"
            onClick={toggleSignup}
          >
            {isSignup
              ? "Already have an account? "
              : "Don't have an account? "}

            <span className="text-cyan-300 font-medium">
              {isSignup ? "Login" : "Sign Up"}
            </span>
          </p>
        </div>

        {/* Bottom Accent */}
        <div className="mt-5 flex items-center justify-center gap-2">
          <div className="h-px w-10 bg-white/10" />

          <span className="text-[9px] text-gray-500">
            DEV-TINDER
          </span>

          <div className="h-px w-10 bg-white/10" />
        </div>
      </motion.div>
    </motion.div>
      </div>

  );
};

export default Login;