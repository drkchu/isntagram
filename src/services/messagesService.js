import api from "../api/axios";

// Get all conversations for the current user
export const fetchConversations = async () => {
  try {
    const response = await api.get("/chats");
    return response.data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};

// Get messages for a specific conversation
export const fetchMessages = async (chatId) => {
  try {
    const response = await api.get(`/chats/${chatId}/messages`);
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

// Get a specific conversation
export const fetchConversation = async (chatId) => {
  try {
    const response = await api.get(`/chats/${chatId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching conversation:", error);
    throw error;
  }
};

// Create a new conversation
export const createConversation = async (
  participants,
  isGroup,
  name = null
) => {
  try {
    const response = await api.post("/chats", {
      participants,
      isGroup,
      name: isGroup ? name : null, // Only include name if it's a group chat
    });
    return response.data;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
};

export const deleteConversation = async (chatId) => {
  try {
    const response = await api.delete(`/chats/${chatId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting conversation:", error);
    throw error;
  }
};

// Send a message in a conversation
export const sendMessage = async (chatId, content) => {
  try {
    const response = await api.post(`/chats/${chatId}/messages`, { content });
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
