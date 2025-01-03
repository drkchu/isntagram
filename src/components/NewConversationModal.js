import React, { useState } from "react";
import api from "../api/axios";

const NewConversationModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (participants.length === 0) {
      setError("Please select at least one participant.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/chats", {
        isGroup: participants.length > 1,
        name: name || null,
        participants,
      });
      onCreate(data); // Pass the new conversation back to the parent
    } catch (err) {
      setError("Failed to create conversation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="modal-box">
        <h2 className="text-xl font-bold mb-4">Create a New Conversation</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Group Name (optional)</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Participants</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter user IDs, separated by commas"
              onChange={(e) =>
                setParticipants(e.target.value.split(",").map((id) => id.trim()))
              }
            />
          </div>
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
              className={`p-2 bg-blue-500 text-white rounded ${loading && "opacity-50"}`}
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
