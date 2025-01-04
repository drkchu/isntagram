import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function SuggestedAccounts() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/users/suggestions`);
        setSuggestions(data);
      } catch (err) {
        console.error("Failed to fetch suggested accounts:", err);
        setError("Failed to fetch suggested accounts.");
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  // Redirect to the user's profile page when clicked
  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`); // Redirects to profile page
  };

  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h3 className="font-bold mb-4">Suggested Accounts</h3>

      {loading ? (
        <p>Loading suggestions...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : suggestions.length === 0 ? (
        <p>No suggestions available right now.</p>
      ) : (
        suggestions.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-4 mb-2 cursor-pointer hover:bg-gray-200 p-2 rounded-lg transition-all"
            onClick={() => handleUserClick(user.id)} // Click handler for redirection
          >
            <img
              src={user.avatarUrl || "anonymous.jpeg"}
              alt={user.username}
              className="w-8 h-8 rounded-full"
            />
            <p className="text-lg">{user.username}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default SuggestedAccounts;
