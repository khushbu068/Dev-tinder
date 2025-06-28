import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRequests, removeRequest } from "../redux/requestSlice";
import axios from "axios";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ReceiveRequests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.requests.receiveRequests);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/request/receiverAllConnectionReq",
        { withCredentials: true }
      );
      dispatch(setRequests(res.data.receiveRequest || []));
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestUpdate = async (requestId, status) => {
    try {
      await axios.post(
        `http://localhost:8000/api/request/update/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(requestId));
    } catch (error) {
      console.error(`Error updating request (${status}):`, error);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center mt-0 p-8"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <span className="loading loading-dots loading-lg text-primary"></span>
        </div>
      ) : requests.length === 0 ? (
        <p className="text-xl font-semibold text-white">
          No received requests yet.
        </p>
      ) : (
        <>
          <h2 className="text-xl font-bold text-white mb-6">
            Received Requests
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16 w-full max-w-full">
            {requests.map((request) => (
              <motion.div
                key={request._id}
                className="card w-full shadow-2xl p-6 bg-transparent text-gray-300 backdrop-blur-md border border-gray-600 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <figure>
                  <img
                    src={
                      request.sender?.profileImage?.trim()
                        ? request.sender.profileImage
                        : "https://via.placeholder.com/150"
                    }
                    alt="User"
                    className="rounded-t-xl w-full h-48 object-cover"
                  />
                </figure>
                <div className="card-body p-4">
                  <h2 className="card-title">
                    {request.sender?.firstName ?? "Unknown"}{" "}
                    {request.sender?.lastName ?? ""}
                  </h2>
                  <p>
                    <strong>Email:</strong> {request.sender?.email || "N/A"}
                  </p>
                  <div>
                    <strong>Skills:</strong>{" "}
                    {request.sender?.skills && request.sender.skills.length > 0
                      ? request.sender.skills.join(", ")
                      : "No skills added"}
                  </div>

                  <div className="card-actions justify-between mt-4">
                    <button
                      onClick={() =>
                        handleRequestUpdate(request._id, "accepted")
                      }
                      className="btn bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleRequestUpdate(request._id, "rejected")
                      }
                      className="btn bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ReceiveRequests;