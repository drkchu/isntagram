import React, { useEffect, useState } from "react";
import { fetchConversations } from "../services/messagesService";
import { jwtDecode } from "jwt-decode";

const ConversationsList = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <div className="text-center py-4">Loading conversations...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="p-4 space-y-2">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className="card bg-base-100 shadow-md cursor-pointer"
          onClick={() => onSelectConversation(conversation.id)}
        >
          <div className="card-body p-4">
            <h2 className="card-title">
              {conversation.isGroup
                ? conversation.name
                : conversation.participants
                    .filter((p) => !p.userId.includes(currentUserId))[0]
                    ?.user.username || "Unnamed Conversation"}
            </h2>
            <p className="text-sm text-gray-500">
              {conversation.messages[0]?.content || "No messages yet"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationsList;
