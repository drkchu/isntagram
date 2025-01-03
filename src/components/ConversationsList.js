import React, { useEffect, useState } from "react";
import { fetchConversations, deleteConversation } from "../services/messagesService";
import { jwtDecode } from "jwt-decode";
import NewConversationModal from "./NewConversationModal";

const ConversationsList = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const currentUserId = jwtDecode(localStorage.getItem("token")).id;
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await fetchConversations();
        setConversations(data);
      } catch (err) {
        setError("Failed to load conversations.");
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  const handleNewConversation = async (newConversation) => {
    setConversations((prev) => [newConversation, ...prev]);
    setShowModal(false);
  };

  const handleDeleteConversation = async (chatId) => {
    if (!window.confirm("Are you sure you want to delete this conversation?")) {
      return;
    }
    try {
      await deleteConversation(chatId);
      setConversations((prev) =>
        prev.filter((conversation) => conversation.id !== chatId)
      );
    } catch (err) {
      alert("Failed to delete the conversation.");
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading conversations...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {loading && <p>Loading conversations...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className="p-4 hover:bg-gray-800 cursor-pointer"
            onClick={() => onSelectConversation(conversation.id)}
          >
            <p className="font-semibold">
              {conversation.isGroup
                ? conversation.name
                : conversation.participants.filter(
                    (p) => !p.userId.includes(currentUserId)
                  )[0]?.user?.username || "Unnamed Conversation"}
            </p>
            <p className="text-sm text-gray-400">
              {conversation.messages[0]?.content || "No messages yet"}
            </p>
            {/* Delete Button */}
            <button
              className="p-2 text-red-500 hover:text-red-700"
              onClick={() => handleDeleteConversation(conversation.id)}
            >
              Delete conversation
            </button>
          </div>
        ))}
      </div>

      {/* New Conversation Button */}
      <button
        className="p-4 bg-blue-500 text-white hover:bg-blue-600"
        onClick={() => setShowModal(true)}
      >
        + New Conversation
      </button>

      {/* Modal for creating a new conversation */}
      {showModal && (
        <NewConversationModal
          onClose={() => setShowModal(false)}
          onCreate={handleNewConversation}
        />
      )}
    </div>
  );
};

export default ConversationsList;
