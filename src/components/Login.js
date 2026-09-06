import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCode,
  faArrowRight,
  faArrowLeft,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { loginSuccess, setUsers } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import api from "../utils/api";

const fadeIn = {
  hidden: {
    opacity: 0,
    y: -10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Toggle between Login and Signup
  const toggleSignup = () => {
    // Don't allow switching while API request is running
    if (loading) return;

    setIsSignup((prev) => !prev);
    setErrorMessage("");
    setShowPassword(false);
  };

  // Signup
  const signupUser = async () => {
    setErrorMessage("");

    const firstName = firstNameRef.current?.value.trim();
    const lastName = lastNameRef.current?.value.trim();
    const email = emailRef.current?.value.trim().toLowerCase();

    // Don't trim password
    // Spaces can technically be part of a password
    const password = passwordRef.current?.value;

    // Frontend validation
    if (!firstName || !lastName || !email || !password) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const userData = {
        firstName,
        lastName,
        email,
        password,
      };

      const response = await api.post("/SignUp", userData);

      console.log("Signup Response:", response.data);

      // Signup successful
      setIsSignup(false);
      setErrorMessage("");

      // Clear fields
      if (firstNameRef.current) {
        firstNameRef.current.value = "";
      }

      if (lastNameRef.current) {
        lastNameRef.current.value = "";
      }

      if (emailRef.current) {
        emailRef.current.value = "";
      }

      if (passwordRef.current) {
        passwordRef.current.value = "";
      }

      // Show message instead of alert
      setErrorMessage("Account created successfully! Please login.");

    } catch (err) {
      console.error("Signup error:", err);

      const error = err.response?.data;

      if (error?.code === "EMAIL_EXISTS") {
        setErrorMessage("Email is already in use. Please login.");
      } else {
        setErrorMessage(
          error?.error ||
            error?.message ||
            "Signup failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Login
  const loginUser = async () => {
    setErrorMessage("");

    const email = emailRef.current?.value.trim().toLowerCase();
    const password = passwordRef.current?.value;

    // Frontend validation
    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const userData = {
        email,
        password,
      };

   const response = await api.post("/loginUser", userData);

console.log("Login Response:", response.data);

dispatch(
  loginSuccess({
    user: response.data.user,
  })
);

navigate("/connections");

      // Navigate after successful login
      navigate("/connections");

    } catch (err) {
      console.error("Login error:", err);

      const error = err.response?.data;

      if (error?.code === "USER_NOT_FOUND") {
        setErrorMessage("Account not found. Please sign up first.");
      } else if (error?.code === "INVALID_PASSWORD") {
        setErrorMessage("Incorrect password. Please try again.");
      } else {
        setErrorMessage(
          error?.error ||
            error?.message ||
            "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Extra protection against duplicate requests
    if (loading) return;

    if (isSignup) {
      signupUser();
    } else {
      loginUser();
    }
  };

  return (
    <div className="h-full">

      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate("/")}
        disabled={loading}
        className="pt-4 px-4 pb-4 flex items-center gap-1.5 text-[13px] font-semibold text-gray-200 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="text-[12px]"
        />
        Back
      </button>

      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="relative flex justify-center items-center px-4 py-2"
      >

        {/* Login / Signup Card */}
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

          {/* FORM */}
          <form onSubmit={handleSubmit}>

            {/* Signup Fields */}
            {isSignup && (
              <div className="grid grid-cols-2 gap-2 mb-2">

                <motion.input
                  type="text"
                  placeholder="First Name"
                  ref={firstNameRef}
                  disabled={loading}
                  autoComplete="given-name"
                  className="w-full h-9 px-3 rounded-lg border border-white/15 bg-white/10 text-white text-xs placeholder:text-gray-300 placeholder:opacity-100 outline-none focus:border-cyan-400/60 focus:bg-white/[0.14] transition disabled:opacity-50 disabled:cursor-not-allowed"
                />

                <motion.input
                  type="text"
                  placeholder="Last Name"
                  ref={lastNameRef}
                  disabled={loading}
                  autoComplete="family-name"
                  className="w-full h-9 px-3 rounded-lg border border-white/15 bg-white/10 text-white text-xs placeholder:text-gray-300 placeholder:opacity-100 outline-none focus:border-cyan-400/60 focus:bg-white/[0.14] transition disabled:opacity-50 disabled:cursor-not-allowed"
                />

              </div>
            )}

            {/* Email */}
            <motion.input
              type="email"
              placeholder="Email address"
              ref={emailRef}
              disabled={loading}
              autoComplete="email"
              className="w-full h-9 px-3 rounded-lg border border-white/15 bg-white/10 text-white text-xs placeholder:text-gray-300 placeholder:opacity-100 outline-none focus:border-cyan-400/60 focus:bg-white/[0.14] transition mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {/* Password */}
            <div className="relative w-full mb-3">

              <motion.input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                ref={passwordRef}
                disabled={loading}
                autoComplete={
                  isSignup
                    ? "new-password"
                    : "current-password"
                }
                className="w-full h-9 px-3 pr-9 rounded-lg border border-white/15 bg-white/10 text-white text-xs placeholder:text-gray-300 placeholder:opacity-100 outline-none focus:border-cyan-400/60 focus:bg-white/[0.14] transition disabled:opacity-50 disabled:cursor-not-allowed"
              />

              {/* Eye Button */}
              <button
                type="button"
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() =>
                  setShowPassword((prev) => !prev)
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

            {/* Error / Success Message */}
            {errorMessage && (
              <motion.p
                className={`text-[11px] text-center mb-3 ${
                  errorMessage.includes("successfully")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
                initial={{
                  opacity: 0,
                  y: -5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
              >
                {errorMessage}
              </motion.p>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full h-9 rounded-lg text-black text-xs font-semibold transition flex items-center justify-center gap-2 shadow-lg ${
                loading
                  ? "bg-yellow-400/60 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-300 cursor-pointer"
              }`}
              whileHover={
                !loading
                  ? { scale: 1.02 }
                  : {}
              }
              whileTap={
                !loading
                  ? { scale: 0.97 }
                  : {}
              }
            >

              {loading ? (
                <>
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    className="text-[10px]"
                  />

                  {isSignup
                    ? "Creating Account..."
                    : "Logging in..."}
                </>
              ) : (
                <>
                  {isSignup
                    ? "Create Account"
                    : "Login"}

                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="text-[10px]"
                  />
                </>
              )}

            </motion.button>

          </form>

          {/* Toggle */}
          <div className="text-center mt-4">
            <button
              type="button"
              disabled={loading}
              onClick={toggleSignup}
              className="text-[11px] text-gray-300 hover:text-cyan-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSignup
                ? "Already have an account? "
                : "Don't have an account? "}

              <span className="text-cyan-300 font-medium">
                {isSignup ? "Login" : "Sign Up"}
              </span>
            </button>
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