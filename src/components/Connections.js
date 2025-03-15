import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUsers, sendRequest } from "../redux/userSlice";
import axios from "axios";

const Connections = () => {
  const dispatch = useDispatch();
  const { users, currentIndex } = useSelector((state) => state.users);
  const currentUser = users.length > 0 ? users[currentIndex] : null;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/feed", {
          withCredentials: true,
        });
        dispatch(setUsers(response.data.feedUsers));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [dispatch]);

  const handleAction = async (actionType) => {
    if (!currentUser) return;
  
    try {
      const response = await axios.post(
        `http://localhost:8000/api/request/send/${actionType}/${currentUser._id}`,
        {}, // Empty body since params are in URL
        { withCredentials: true } // Ensure credentials are included
      );
  
      console.log("API Response:", response.data); // Debugging
      dispatch(sendRequest({ userId: currentUser._id, actionType }));
    } catch (error) {
      console.error(`Failed to ${actionType} user:`, error.response?.data || error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">Connections</h2>

      {currentUser ? (
        <div className="w-96 p-6 bg-white shadow-lg rounded-lg text-center">
          <p className="text-xl font-bold">
            {currentUser.firstName} {currentUser.lastName}
          </p>
          <p className="text-gray-600">{currentUser.email}</p>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => handleAction("ignored")}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Ignored
            </button>
            <button
              onClick={() => handleAction("interested")}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Interested
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No users left to show.</p>
      )}
    </div>
  );
};

export default Connections;
