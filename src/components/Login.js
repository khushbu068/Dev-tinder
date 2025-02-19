import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Login failed");
    }
  };

  const handleSubmit = () => {
    isSignup ? signupUser() : loginUser();
  };

  return (
    <div className="flex justify-center items-center p-7">
      <div className="card bg-base-100 w-96 shadow-2xl p-6">
        <h2 className="text-xl font-semibold text-center mb-4">
          {isSignup ? "Sign Up" : "Login"}
        </h2>
        {isSignup && (
          <>
            <input
              type="text"
              placeholder="First Name"
              ref={firstNameRef}
              className="input input-bordered w-full mb-3"
            />
            <input
              type="text"
              placeholder="Last Name"
              ref={lastNameRef}
              className="input input-bordered w-full mb-3"
            />
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          ref={emailRef}
          className="input input-bordered w-full mb-3"
        />
        <div className="relative w-full mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            ref={passwordRef}
            className="input input-bordered w-full"
          />
          <button
            type="button"
            className="absolute right-3 top-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm text-center mb-3">
            {errorMessage}
          </p>
        )}
        <button className="btn btn-primary w-full" onClick={handleSubmit}>
          {isSignup ? "Sign Up" : "Login"}
        </button>
        <p className="text-center mt-3 cursor-pointer" onClick={toggleSignup}>
          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </p>
      </div>
    </div>
  );
};

export default Login;