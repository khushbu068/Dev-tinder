import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Friends = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch friends data from the API
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/request/getAllUserFriends", { withCredentials: true });
        setFriends(response.data.data); // Assuming the response contains friends in 'data'
        setLoading(false);
      } catch (error) {
        console.error("Error fetching friends:", error);
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const handleProfileClick = (friendId) => {
    navigate(`/friendProfile/${friendId}`); // Navigate to friend's profile on button click
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (friends.length === 0) return <div className="text-center mt-5">No friends found.</div>;

  return (
    <div className="flex flex-wrap justify-center gap-4 pt-5">
      {friends.map((friend) => (
        <div
          key={friend._id}
          className="card bg-white w-96 shadow-sm hover:shadow-lg transition-all"
        >
          <figure>
            <img
              src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" // Replace with friend's profile image if available
              alt="Friend"
              className="rounded-t-lg w-full"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title mr-1">{friend.firstName} {friend.lastName}</h2>
            <p className="text-gray-700 mr-1">
              <strong>About:</strong> {friend.skills && Array.isArray(friend.skills) && friend.skills.length > 0 ? friend.skills.join(", ") : "No Bio"}
            </p>
            <div className="card-actions flex justify-end mr-2 mb-2">
              <button
                className="btn btn-primary bg-primary text-white hover:bg-blue-700 rounded-lg"
                onClick={() => handleProfileClick(friend._id)} // Navigate to friend's profile on click
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Friends;
