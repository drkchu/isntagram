import React, { useState, useEffect } from "react";
import Select from "react-select";
import api from "../api/axios";

const NewConversationModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch suggested users for the dropdown
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const { data } = await api.get("/users"); // Endpoint to get all usernames
        setSuggestedUsers(
          data.map((user) => ({ label: user.username, value: user.username }))
        );
      } catch (err) {
        console.error("Failed to fetch suggested users");
      }
    };

    fetchSuggestedUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedParticipants.length === 0) {
      setError("Please select at least one participant.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/chats", {
        isGroup: selectedParticipants.length > 1,
        name: name || null,
        participants: selectedParticipants.map((p) => p.value),
      });
      onCreate(data); // Pass the new conversation back to the parent
      onClose();
    } catch (err) {
      setError("Failed to create conversation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="modal-box rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Create a New Conversation</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* Group Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium">
              Group Name (optional)
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name"
            />
          </div>

          {/* Participants Selection using react-select */}
          <div className="mb-4">
            <label className="block text-sm font-medium">
              Add Participants
            </label>
            <Select
              isMulti
              options={suggestedUsers}
              value={selectedParticipants}
              onChange={setSelectedParticipants}
              placeholder="Search and select participants..."
            />
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end">
            <button
              type="button"
              className="p-2 bg-gray-500 text-white rounded mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewConversationModal;
