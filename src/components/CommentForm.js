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
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginTop: "10px",
      }}
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        rows="3"
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "5px",
          border: "1px solid",
        }}
        required
      ></textarea>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="submit"
          className="btn btn-primary"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
