import React, { useState } from "react";
import { sendMessage } from "../services/messagesService";

const MessageInput = ({ conversationId, onMessageSent }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return; // Prevent sending empty messages

    setSending(true);
    try {
      const newMessage = await sendMessage(conversationId, message.trim());
      setMessage("");
      if (onMessageSent) onMessageSent(newMessage); // Update parent component
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 border-t border-gray-700">
      <textarea
        className="flex-grow resize-none rounded-lg p-2"
        rows="1"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={sending}
      />
      <button
        className="btn btn-primary"
        onClick={handleSendMessage}
        disabled={sending}
      >
        {sending ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default MessageInput;
