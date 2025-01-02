import React, { useState } from "react";
import ConversationsList from "../components/ConversationsList";
import ChatWindow from "../components/ChatWindow";

const MessagesPage = () => {
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  return (
    <div className="flex h-screen">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-700">
        <ConversationsList onSelectConversation={setSelectedConversationId} />
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        {selectedConversationId ? (
          <ChatWindow conversationId={selectedConversationId} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              Select a conversation to start chatting :)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
