import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRequests, removeRequest } from "../redux/requestSlice";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faXmark,
  faCircleUser,
  faInbox,
  faRotateRight,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import api from "../utils/api";

const fadeIn = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const ReceiveRequests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.requests.receiveRequests);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const res = await api.get("/request/receiverAllConnectionReq");
      dispatch(setRequests(res.data.receiveRequest || []));
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleRequestUpdate = async (requestId, status) => {
    if (processingId) return;

    setProcessingId(requestId);

    try {
      await api.post(`/request/update/${status}/${requestId}`, {});
      dispatch(removeRequest(requestId));
    } catch (err) {
      console.error(`Error updating request (${status}):`, err);
    } finally {
      setProcessingId(null);
    }
  };

  // ===============================
  // Loading
  // ===============================
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <span className="loading loading-dots loading-lg text-yellow-400" />
          <p className="text-xs">Loading requests...</p>
        </div>
      </div>
    );
  }

  // ===============================
  // Error
  // ===============================
  if (error) {
    return (
      <div className="h-full flex items-center justify-center px-4">
        <div className="w-[320px] rounded-2xl border border-white/10 bg-[#07111f]/60 backdrop-blur-xl shadow-2xl px-6 py-8 text-center">
          <div className="w-11 h-11 mx-auto rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faInbox} className="text-yellow-400 text-lg" />
          </div>
          <h2 className="text-white text-lg font-semibold mb-1">
            Couldn't load requests
          </h2>
          <p className="text-gray-400 text-xs mb-5">
            Something went wrong. Please try again.
          </p>
          <button
            type="button"
            onClick={fetchRequests}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-semibold transition"
          >
            <FontAwesomeIcon icon={faRotateRight} className="text-[10px]" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  // ===============================
  // Empty
  // ===============================
  if (requests.length === 0) {
    return (
      <div className="h-full flex items-center justify-center px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center"
        >
          <div className="w-12 h-12 mx-auto rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faInbox} className="text-yellow-400 text-xl" />
          </div>
          <h2 className="text-white text-base font-semibold mb-1">
            No requests yet
          </h2>
          <p className="text-gray-400 text-xs">
            When someone's interested in connecting, you'll see it here.
          </p>
        </motion.div>
      </div>
    );
  }

  // ===============================
  // Requests
  // ===============================
  return (
    <div className="px-4 sm:px-6 py-6">
      <h2 className="text-lg font-semibold text-white text-center mb-5">
        Received Requests
      </h2>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="flex flex-wrap justify-center gap-4 max-w-6xl mx-auto"
      >
        {requests.map((request) => {
          const sender = request.sender;
          const initials = `${sender?.firstName?.[0] || ""}${
            sender?.lastName?.[0] || ""
          }`.toUpperCase();
          const isProcessing = processingId === request._id;

          return (
            <motion.div
              key={request._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full sm:w-[280px] rounded-2xl border border-white/10 bg-[#07111f]/60 backdrop-blur-xl shadow-lg p-4 flex flex-col"
            >
              <div className="flex items-center gap-3">
                {sender?.profileImage?.trim() ? (
                  <img
                    src={sender.profileImage}
                    alt={sender.firstName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-yellow-400/40 shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-yellow-400/10 border-2 border-yellow-400/40 flex items-center justify-center shrink-0">
                    {initials ? (
                      <span className="text-yellow-400 text-sm font-semibold">
                        {initials}
                      </span>
                    ) : (
                      <FontAwesomeIcon icon={faCircleUser} className="text-yellow-400 text-xl" />
                    )}
                  </div>
                )}

                <div className="min-w-0">
                  <h3 className="text-white text-sm font-semibold truncate">
                    {sender?.firstName ?? "Unknown"} {sender?.lastName ?? ""}
                  </h3>
                  <p className="text-[11px] text-gray-400">Wants to connect</p>
                </div>
              </div>

              <div className="mt-3">
                {sender?.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {sender.skills.slice(0, 5).map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] px-2 py-1 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No skills added</p>
                )}
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
                <button
                  disabled={isProcessing}
                  onClick={() => handleRequestUpdate(request._id, "rejected")}
                  className="flex-1 h-8 rounded-lg border border-red-400/30 bg-red-400/5 hover:bg-red-400/10 text-red-300 text-[11px] font-medium transition flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <FontAwesomeIcon icon={faSpinner} spin className="text-[10px]" />
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faXmark} className="text-[10px]" />
                      Reject
                    </>
                  )}
                </button>

                <button
                  disabled={isProcessing}
                  onClick={() => handleRequestUpdate(request._id, "accepted")}
                  className="flex-1 h-8 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black text-[11px] font-semibold transition flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <FontAwesomeIcon icon={faSpinner} spin className="text-[10px]" />
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
                      Accept
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ReceiveRequests;