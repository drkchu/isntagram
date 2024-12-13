import React, { useEffect, useState } from "react";
import api from "../api/axios";

function SuggestedAccounts() {
  const [suggestions, setSuggestions] = useState([]);

//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       const { data } = await api.get("users/self"); // TODO: CHANGE TO ACTUAL SUGGESTIONS ENDPOINT
//       setSuggestions(data);
//     };

//     fetchSuggestions();
//   }, []);

  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h3 className="font-bold mb-4">Suggested Accounts</h3>
      {suggestions.map((user) => (
        <div key={user.id} className="flex items-center gap-4 mb-2">
          <img
            src={user.avatarUrl || "/default-avatar.png"}
            alt={user.username}
            className="w-8 h-8 rounded-full"
          />
          <p>{user.username}</p>
          <button className="btn btn-primary btn-sm">Follow</button>
        </div>
      ))}
    </div>
  );
}

export default SuggestedAccounts;
