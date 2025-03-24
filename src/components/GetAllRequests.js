import React, { useEffect, useState } from "react";
import axios from "axios";

const GetAllRequests = () => {
  const [receivedRequests, setReceivedRequests] = useState([]);

  // Fetch all received requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/request/receiverAllConnectionReq",
          { withCredentials: true }
        );
        console.log("API Response:", response.data); // Debugging
        setReceivedRequests(response.data.receiveRequest || []);
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };

    fetchRequests();
  }, []);

  // Handle accept/ignore actions
  const handleRequestAction = async (connectionRequestId, action) => {
    try {
        console.log("Updating request:", connectionRequestId, "Action:", action);
        const response = await axios.post(`http://localhost:8000/api/request/update/${action}/${connectionRequestId}`, {}, { withCredentials: true });
        console.log(response.data);
        alert("Request updated successfully");
    } catch (error) {
        console.error("Error updating request:", error.response?.data || error.message);
        alert("Failed to update request");
    }
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">Received Requests</h2>

      {receivedRequests.length > 0 ? (
        <div className="w-96 p-6 bg-white shadow-lg rounded-lg">
          {receivedRequests.map((request, index) => {
            console.log("Request Data:", request); // Debugging to check request._id
            return (
              <div key={request?._id || index} className="p-4 border-b border-gray-300">
                <p className="text-xl font-bold">
                  {request?.sender?.firstName} {request?.sender?.lastName}
                </p>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleRequestAction(request?._id, "accepted")}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    disabled={!request?._id} // Disable button if request ID is missing
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRequestAction(request?._id, "ignored")}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    disabled={!request?._id} // Disable button if request ID is missing
                  >
                    Ignore
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No received requests.</p>
      )}
    </div>
  );
};

export default GetAllRequests;
