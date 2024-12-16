import React, { useEffect, useState, useContext } from "react";

import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

const CommentSection = ({ postId }) => {
  const { user } = useContext(AuthContext);     // So I know who the current user is
  const [comments, setComments] = useState([]); // Local state for comments
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);     // Error state

  // Fetch comments when the component mounts
  const fetchComments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/comments/${postId}`);
      setComments(response.data); // Update local state with fetched comments
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(); // Initial fetch
  }, [postId]);

  // Add a new comment
  const handleAddComment = async (newContent) => {
    try {
      await api.post(`/comments/${postId}`, { content: newContent });
      fetchComments(); // Refetch comments after adding a new one
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment. Please try again.");
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      fetchComments(); // Refetch comments after deletion
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment. Please try again.");
    }
  };

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <CommentList comments={comments} currentUserId={jwtDecode(user).id} onDelete={handleDeleteComment} />
      <CommentForm onSubmit={handleAddComment} />
    </div>
  );
};

export default CommentSection;
