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
        {},
        { withCredentials: true }
      );

      console.log("API Response:", response.data);
      dispatch(sendRequest({ userId: currentUser._id, actionType }));
    } catch (error) {
      console.error(`Failed to ${actionType} user:`, error.response?.data || error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
      <h2 className="text-2xl font-semibold mb-6">Feed</h2>

      {currentUser ? (
  <div className="card w-80 bg-base-100 shadow-xl">
    <figure className="h-40 overflow-hidden">
      <img
        src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
        alt={`${currentUser.firstName} ${currentUser.lastName}`}
        className="object-cover w-full h-full"
      />
    </figure>

    <div className="card-body p-4">
      <h2 className="card-title text-lg capitalize">
        {currentUser.firstName} {currentUser.lastName}
      </h2>
      <p className="text-sm text-gray-600">
        {currentUser.email || "No email provided"}
      </p>

      <div className="card-actions mt-3 flex justify-between">
        <button
          onClick={() => handleAction("ignored")}
          className="btn bg-red-500 hover:bg-red-600 text-white w-5/12 rounded-md"
        >
          Ignored
        </button>
        <button
          onClick={() => handleAction("interested")}
          className="btn bg-green-500 hover:bg-green-600 text-white w-5/12 rounded-md"
        >
          Interested
        </button>
      </div>
    </div>
  </div>
) : (
  <p className="text-gray-500 text-center">No users left to show.</p>
)}

    </div>
  );
};

export default Connections;
