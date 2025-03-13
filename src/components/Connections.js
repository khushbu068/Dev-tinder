import React, { useEffect, useState } from "react";
import axios from "axios";

const Connections = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/feed", {
          withCredentials: true,
        });

        if (response.data.success && Array.isArray(response.data.feedUsers)) {
          setUsers(response.data.feedUsers);
        } else {
          setUsers([]); 
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Connections</h2>
      {users.length > 0 ? (
        <ul className="space-y-3">
          {users.map((user) => (
            <li
              key={user._id}
              className="p-4 border rounded-md shadow-sm bg-gray-100"
            >
              <p className="text-lg font-medium">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No users found.</p>
      )}
    </div>
  );
};

export default Connections;
