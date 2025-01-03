import React, { useEffect, useState, useRef } from "react";
import { fetchConversation } from "../services/messagesService";
import { jwtDecode } from "jwt-decode";
import socket from "../services/websocket";

import MessageInput from "./MessageInput";

const ChatWindow = ({ conversationId }) => {
  const currentUserId = jwtDecode(localStorage.getItem("token")).id;
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
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
        const data = await fetchConversation(conversationId);
        console.log(data);
        setMessages(data.messages);
        setParticipants(
          data.participants.filter(
            (participant) => participant.user.id !== currentUserId
          )
        );
      } catch (err) {
        setError("Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Join the WebSocket room for this conversation
    socket.emit("joinRoom", conversationId);

    // Listen for new messages in this room
    socket.on("newMessage", (newMessage) => {
      console.log("New message received via WebSocket:", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Cleanup: Leave the room and remove listeners when the component unmounts
    return () => {
      socket.emit("leaveRoom", conversationId); // Optional: Inform server when leaving
      socket.off("newMessage"); // Remove the listener
    };

  }, [conversationId, currentUserId]);

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
      {/* Participants Section */}
      <div className="p-4 bg-gray-800 text-white border-b border-gray-700">
        <p className="text-sm font-semibold">
          Chat with:{" "}
          {participants.map((p) => p.user.username).join(", ") ||
            "No participants"}
        </p>
      </div>
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-2 rounded-lg max-w-xs ${
              message.senderId === currentUserId
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
          socket.emit("sendMessage", {
            conversationId,
            content: newMessage,
            sender: { id: currentUserId, username: "You" }, // Include sender details
          })
        }
      />
    </div>
  );
};

export default ChatWindow;
