import React from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

const CommentList = ({ comments, currentUserId, onDelete }) => {
  if (comments.length === 0) {
    return <p>No comments yet. Be the first to comment!</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {comments.map((comment) => (
        <li
          key={comment.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
            borderBottom: "1px solid #333",
            paddingBottom: "5px",
          }}
        >
          <div>
            <div>
              <Link to={`/profile/${comment.userId}`} className="font-bold">
                {comment.user.username}
              </Link>:{" "}
              {comment.content}
            </div>
            {/* Display the friendly timestamp */}
            <small style={{ color: "#aaa" }}>
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </small>
          </div>

          {/* Delete button */}
          {comment.user?.id === currentUserId && (
            <button
              onClick={() => onDelete(comment.id)}
              style={{
                cursor: "pointer",
                fontSize: "1.2rem",
              }}
              aria-label="Delete comment"
            >
              <FaTrash />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default CommentList;
