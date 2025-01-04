import React, { useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/axios";

const SearchModal = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await api.get(
        `/users/search?username=${searchQuery}&email=${searchQuery}` // working with how I did the api LOL
      );
      if (response.status === 200) {
        const data = response.data;
        setResults(data);
      } else {
        console.error("Failed to fetch search results");
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle absolute right-2 top-2"
        >
          ✕
        </button>
        <h3 className="font-bold text-lg mb-4">Search Users</h3>
        <div className="form-control mb-4">
          <input
            type="text"
            placeholder="Search by username or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full"
          />
          <button onClick={handleSearch} className="btn btn-primary mt-2">
            Search
          </button>
        </div>
        <div className="divider">Results</div>
        <ul>
          {results.length > 0 ? (
            results.map((user) => (
              <li key={user.id} className="flex items-center gap-2 mb-2">
                <img
                  src={user.profile?.avatarUrl || "/anonymous.jpeg"}
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />
                <Link to={`/profile/${user.id}`} className="font-bold">
                  {user.username}
                </Link>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No users found</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SearchModal;
