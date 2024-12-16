import React, { useState } from "react";

const CommentForm = ({ onSubmit }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSubmit(content); // Call the parent function
    setContent("");    // Clear the form
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        rows="3"
        style={{ width: "100%", padding: "8px" }}
        required
      ></textarea>
      <button type="submit" style={{ marginTop: "5px" }}>
        Submit
      </button>
    </form>
  );
};

export default CommentForm;
