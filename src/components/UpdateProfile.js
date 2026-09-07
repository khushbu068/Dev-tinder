import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCamera,
  faSpinner,
  faCircleUser,
  faEye,
  faEyeSlash,
  faLock,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import api from "../utils/api";

const CLOUD_NAME = "dst2ejsyk";
const UPLOAD_PRESET = "chat-app";

const fadeIn = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const UpdateProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    skills: "",
    about: "",
    profileImage: "",
  });

  const [loading, setLoading] = useState(true);
  const [picLoading, setPicLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Password change is opt-in and kept separate from formData
  // so it's never accidentally included in a normal profile save.
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // =========================
  // FETCH PROFILE
  // =========================

  const fetchUserProfile = useCallback(async () => {
    try {
      const { data } = await api.get("/userProfile");
      const { password, ...safeUser } = data.user || {};

      setFormData((prev) => ({ ...prev, ...safeUser }));
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Couldn't load your profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // =========================
  // CLOUDINARY UPLOAD
  // =========================

  const postDetails = (file) => {
    if (!file) {
      toast.error("Please select an image.");
      return;
    }

    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      toast.error("Please select a JPG or PNG image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB.");
      return;
    }

    setPicLoading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);

    fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.url) throw new Error("No URL returned");
        setFormData((prev) => ({ ...prev, profileImage: res.url }));
        toast.success("Image uploaded!");
      })
      .catch((err) => {
        console.error("Upload error:", err);
        toast.error("Failed to upload image.");
      })
      .finally(() => {
        setPicLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      });
  };

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const toggleChangingPassword = () => {
    setChangingPassword((prev) => !prev);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  // =========================
  // VALIDATION
  // =========================

  const validate = () => {
    const next = {};

    if (!formData.firstName?.trim()) next.firstName = "Required";
    if (!formData.lastName?.trim()) next.lastName = "Required";

    if (!formData.email?.trim()) {
      next.email = "Required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      next.email = "Invalid email";
    }

    if (formData.age && (formData.age < 18 || formData.age > 100)) {
      next.age = "18–100 only";
    }

    setErrors(next);

    let passwordOk = true;

    if (changingPassword) {
      if (newPassword.length < 6) {
        setPasswordError("Password must be at least 6 characters.");
        passwordOk = false;
      } else if (newPassword !== confirmPassword) {
        setPasswordError("Passwords do not match.");
        passwordOk = false;
      } else {
        setPasswordError("");
      }
    }

    return Object.keys(next).length === 0 && passwordOk;
  };

  // =========================
  // UPDATE PROFILE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting || picLoading) return;

    if (!validate()) {
      if (Object.keys(errors).length) {
        toast.error("Please fix the highlighted fields.");
      }
      return;
    }

    try {
      setSubmitting(true);

      const payload = { ...formData };
      if (changingPassword) payload.password = newPassword;

      await api.put("/updateUserProfile", payload);

      toast.success("Profile updated!");
      navigate("/myprofile");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error.response?.data?.error || "Failed to update profile."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="h-full flex justify-center items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="flex flex-col items-center gap-3 text-gray-400"
        >
          <span className="loading loading-dots loading-lg text-yellow-400" />
          <p className="text-[10px] md:text-[11px] lg:text-xs">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  const busy = submitting || picLoading;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Toaster position="bottom-center" />

      <button
        type="button"
        onClick={() => navigate(-1)}
        disabled={busy}
        className="pt-3 px-4 pb-2 flex items-center gap-1.5 text-[12px] font-semibold text-gray-200 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="text-[12px]" />
        Back
      </button>

      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="flex-1 flex justify-center items-center px-4 py-2 min-h-0"
      >
        <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#07111f]/60 backdrop-blur-xl shadow-2xl px-6 py-2">

          <h2 className="text-lg font-semibold text-white text-center mb-4">
            Update Profile
          </h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="flex gap-5">

              {/* Avatar */}
              <div className="shrink-0 flex flex-col items-center pt-1">
                <div className="relative">
                  {formData.profileImage ? (
                    <img
                      src={formData.profileImage}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-2 border-yellow-400/40"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-yellow-400/10 border-2 border-yellow-400/40 flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faCircleUser}
                        className="text-yellow-400 text-3xl"
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-yellow-400 text-black flex items-center justify-center shadow-lg hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Change profile photo"
                  >
                    {picLoading ? (
                      <FontAwesomeIcon icon={faSpinner} spin className="text-[10px]" />
                    ) : (
                      <FontAwesomeIcon icon={faCamera} className="text-[10px]" />
                    )}
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={(e) => postDetails(e.target.files[0])}
                  />
                </div>
              </div>

              {/* Fields */}
              <div className="flex-1 space-y-1">

                <div className="grid grid-cols-3 gap-1.5">
                  <Field
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    disabled={busy}
                  />
                  <Field
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    disabled={busy}
                  />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    disabled={busy}
                  />
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <Field
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={busy}
                  />
                  <Field
                    label="Age"
                    name="age"
                    type="number"
                    min="18"
                    max="100"
                    value={formData.age}
                    onChange={handleChange}
                    error={errors.age}
                    disabled={busy}
                  />
                  <div>
                    <label className="text-[10px] text-gray-400 mb-1 block">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender || ""}
                      onChange={handleChange}
                      disabled={busy}
                      className="w-full h-7 px-2.5 rounded-lg border border-white/15 bg-white/10 text-white text-[10px] md:text-[11px] lg:text-xs outline-none focus:border-cyan-400/60 focus:bg-white/[0.14] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="" disabled className="text-black">
                        Select
                      </option>
                      <option value="male" className="text-black">Male</option>
                      <option value="female" className="text-black">Female</option>
                      <option value="other" className="text-black">Other</option>
                    </select>
                  </div>
                </div>

                <Field
                  label="Skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  disabled={busy}
                  hint="Comma-separated, e.g. React, Node.js, SQL"
                />

                <div>
                  <label className="text-[10px] text-gray-400 mb-1 block">
                    About
                  </label>
                  <textarea
                    name="about"
                    rows={2}
                    maxLength={280}
                    value={formData.about || ""}
                    onChange={handleChange}
                    disabled={busy}
                    placeholder="Tell other developers about yourself"
                    className="w-full px-3 py-1 rounded-lg border border-white/15 bg-white/10 text-white text-[10px] md:text-[11px] lg:text-xs placeholder:text-gray-500 outline-none focus:border-cyan-400/60 focus:bg-white/[0.14] transition resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

              </div>
            </div>

            {/* Password change */}
            <div className="mt-1.5 pt-1.5 border-t border-white/10">
              {!changingPassword ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={toggleChangingPassword}
                  className="text-[10px] md:text-[11px] lg:text-xs text-cyan-300 hover:text-cyan-200 transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faLock} className="text-[10px]" />
                  Change password
                </button>
              ) : (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] md:text-[11px] lg:text-xs text-gray-300 flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faLock} className="text-[10px]" />
                        New password
                      </span>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={toggleChangingPassword}
                        className="text-gray-400 hover:text-white transition disabled:opacity-50"
                        aria-label="Cancel password change"
                      >
                        <FontAwesomeIcon icon={faXmark} className="text-[10px] md:text-[11px] lg:text-xs" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="New password"
                          value={newPassword}
                          disabled={busy}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            if (passwordError) setPasswordError("");
                          }}
                          className={`w-full h-7 px-3 pr-8 rounded-lg border bg-white/10 text-white text-[10px] md:text-[11px] lg:text-xs placeholder:text-gray-500 outline-none focus:bg-white/[0.14] transition disabled:opacity-50 disabled:cursor-not-allowed ${
                            passwordError
                              ? "border-red-400/60 focus:border-red-400"
                              : "border-white/15 focus:border-cyan-400/60"
                          }`}
                        />
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => setShowNewPassword((p) => !p)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition disabled:opacity-50"
                        >
                          <FontAwesomeIcon
                            icon={showNewPassword ? faEyeSlash : faEye}
                            className="text-[10px]"
                          />
                        </button>
                      </div>

                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Confirm password"
                          value={confirmPassword}
                          disabled={busy}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (passwordError) setPasswordError("");
                          }}
                          className={`w-full h-7 px-3 pr-8 rounded-lg border bg-white/10 text-white text-[10px] md:text-[11px] lg:text-xs placeholder:text-gray-500 outline-none focus:bg-white/[0.14] transition disabled:opacity-50 disabled:cursor-not-allowed ${
                            passwordError
                              ? "border-red-400/60 focus:border-red-400"
                              : "border-white/15 focus:border-cyan-400/60"
                          }`}
                        />
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => setShowConfirmPassword((p) => !p)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition disabled:opacity-50"
                        >
                          <FontAwesomeIcon
                            icon={showConfirmPassword ? faEyeSlash : faEye}
                            className="text-[10px]"
                          />
                        </button>
                      </div>
                    </div>

                    {passwordError && (
                      <p className="text-[10px] text-red-400 mt-1.5">
                        {passwordError}
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-center">
            <motion.button
              type="submit"
              disabled={busy}
              whileHover={!busy ? { scale: 1.01 } : {}}
              whileTap={!busy ? { scale: 0.98 } : {}}
              className={`w-3/12 h-7 mt-4 rounded-lg text-black text-[10px] md:text-[11px] lg:text-xs font-semibold transition flex items-center justify-center gap-2 shadow-lg ${
                busy
                  ? "bg-yellow-400/60 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-300"
              }`}
            >
              {submitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="text-[10px]" />
                  Saving...
                </>
              ) : picLoading ? (
                "Uploading image..."
              ) : (
                "Save Changes"
              )}
            </motion.button>
</div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const Field = ({ label, name, error, hint, ...rest }) => (
  <div>
    <label className="text-[10px] text-gray-400 mb-1 block" htmlFor={name}>
      {label}
    </label>
    <input
      id={name}
      name={name}
      {...rest}
      className={`w-full h-7 px-3 rounded-lg border bg-white/10 text-white text-[10px] md:text-[11px] lg:text-xs placeholder:text-gray-500 outline-none focus:bg-white/[0.14] transition disabled:opacity-50 disabled:cursor-not-allowed ${
        error
          ? "border-red-400/60 focus:border-red-400"
          : "border-white/15 focus:border-cyan-400/60"
      }`}
    />
    {error && <p className="text-[10px] text-red-400 mt-1">{error}</p>}
    {hint && !error && <p className="text-[10px] text-gray-500 mt-1">{hint}</p>}
  </div>
);

export default UpdateProfile;