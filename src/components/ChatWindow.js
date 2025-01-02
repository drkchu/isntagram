import React, { useEffect, useState, useRef } from "react";
import { fetchMessages } from "../services/messagesService";
import { jwtDecode } from "jwt-decode";

import MessageInput from "./MessageInput";

const ChatWindow = ({ conversationId }) => {
  const currentUserId = jwtDecode(localStorage.getItem("token")).id;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null); // Ref for scrolling to the bottom

  // Function to scroll to the bottom of the message list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!conversationId) return;

    const loadMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMessages(conversationId);
        setMessages(data);
      } catch (err) {
        setError("Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom(); // Scroll to the bottom when messages change
  }, [messages]);

  if (!conversationId) {
    return (
      <div className="text-center py-4 p-4">
        Select a conversation to start chatting :)
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-4 p-4">Loading messages...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-2 rounded-lg max-w-xs ${
              message.sender.id === currentUserId
                ? "bg-blue-500 text-white ml-auto self-end"
                : "bg-gray-200 text-black self-start"
            }`}
          >
            <p className="text-sm">{message.sender.username}</p>
            <p>{message.content}</p>
            <p className="text-xs text-gray-500 text-right">
              {new Date(message.createdAt).toLocaleTimeString()}
            </p>
          </div>
        ))}
        {/* Scroll Anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <MessageInput
        conversationId={conversationId}
        onMessageSent={(newMessage) =>
          setMessages((prev) => [...prev, newMessage])
        }
      />
    </div>
  );
};

export default ChatWindow;
