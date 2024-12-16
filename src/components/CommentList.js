import React from "react";

const CommentList = ({ comments }) => {
  if (comments.length === 0) {
    return <p>No comments yet. Be the first to comment!</p>;
  }

  return (
    <ul>
      {comments.map((comment) => (
        <li key={comment.id} style={{ marginBottom: "10px" }}>
          <strong>{comment.user?.username || "Anonymous"}</strong>: {comment.content}
        </li>
      ))}
    </ul>
  );
};

export default CommentList;
