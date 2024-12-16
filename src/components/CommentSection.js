import React, { useEffect, useState } from "react";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import api from "../api/axios";

const CommentSection = ({ postId }) => {
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

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <CommentList comments={comments} />
      <CommentForm onSubmit={handleAddComment} />
    </div>
  );
};

export default CommentSection;
