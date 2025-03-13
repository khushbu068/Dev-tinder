import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUsers, nextUser, prevUser } from "../redux/userSlice";
import axios from "axios";

const Connections = () => {
  const dispatch = useDispatch();
  const { users, currentIndex } = useSelector((state) => state.users);

  console.log("Users in Redux:", users); // 🛠️ Debugging
  console.log("Current Index:", currentIndex); // 🛠️ Debugging

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/feed", {
          withCredentials: true,
        });
        console.log("Fetched Users:", response.data.feedUsers); // 🛠️ Debugging
        dispatch(setUsers(response.data.feedUsers)); // Store in Redux
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">Connections</h2>

      {users.length > 0 ? (
        <div className="w-96 p-6 bg-white shadow-lg rounded-lg text-center">
          <p className="text-xl font-bold">
            {users[currentIndex]?.firstName} {users[currentIndex]?.lastName}
          </p>
          <p className="text-gray-600">{users[currentIndex]?.email}</p>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => dispatch(prevUser())}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Previous
            </button>
            <button
              onClick={() => dispatch(nextUser())}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No users found.</p>
      )}
    </div>
  );
};

export default Connections;
