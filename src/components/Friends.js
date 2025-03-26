import React, { useEffect, useState } from "react";
import axios from "axios";

const Friends = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/getallfriends", {
        withCredentials: true,
      });
      setFriends(res.data.data || []);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <h1 className="text-3xl font-bold text-white mb-4">My Friends</h1>
      {friends.length > 0 ? (
        friends.map((friend) => (
          <div
            key={friend._id}
            className="bg-gray-900 p-6 rounded-lg shadow-md w-96 text-white flex justify-between mb-4 border border-gray-700"
          >
            <span className="font-semibold">
              {friend.firstName} {friend.lastName}
            </span>
          </div>
        ))
      ) : (
        <p className="text-lg text-gray-400">No friends yet.</p>
      )}
    </div>
  );
};

export default Friends;