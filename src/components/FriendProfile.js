import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const FriendProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendProfile = async () => {
      try {
        console.log("Friend ID from URL params:", id);
        if (!id) {
          console.error("Invalid friend ID");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:8000/api/request/getFriendProfile/${id}`,
          { withCredentials: true }
        );

        // Correctly set friend data based on response
        setFriend(response.data.user); // Update to use `user` from the response
      } catch (error) {
        console.error("Error fetching friend's profile:", error);
      }
      setLoading(false);
    };

    if (id) {
      fetchFriendProfile();
    }
  }, [id]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!friend) return <div className="text-center mt-5">Friend not found.</div>;

  return (
    <div className="flex justify-center items-center p-7 mt-14">
      <div className="card bg-white w-96 shadow-lg">
        <figure>
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Friend's profile"
            className="rounded-lg"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-left mr-1 text-xl font-bold">
            {friend.firstName} {friend.lastName}
          </h2>
          <p className="text-left mr-1 text-gray-700">
            <strong>Skills:</strong> {friend.skills.length > 0
              ? friend.skills.join(", ")
              : "No skills added"}
          </p>
          <div className="card-actions flex justify-end mr-2 mb-2">
              <button
                className="btn btn-primary bg-primary text-white hover:bg-blue-700 rounded-lg"
                onClick={() =>  navigate(`/chat/${friend._id}`)} // Navigate to friend's profile on click
              >
                Start Chat
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FriendProfile;
