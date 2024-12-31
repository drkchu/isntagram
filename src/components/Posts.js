import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import api from "../api/axios";
import CommentSection from "./CommentSection";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

// Icon stuff
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";

function Posts({ tab }) {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const { user } = useContext(AuthContext); // Get the current user from context

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const endpoint = tab === "following" ? "/posts/following" : "/posts";
        const { data } = await api.get(endpoint);
        console.log(data);

        if (data.length === 0) {
          if (tab === "following") {
            setMessage(
              "No posts from people you follow. Start following some interesting accounts!"
            );
          } else {
            setMessage("You have no posts yet. Start sharing something!");
          }
        } else {
          setMessage(""); // Clear message if posts are found
        }
        setPosts(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchPosts();
  }, [tab]);

  // Function to handle likes
  const handleLike = async (postId, isLiked) => {
    try {
      if (isLiked) {
        // Unlike the post
        await api.delete(`/posts/${postId}/like`);
      } else {
        // Like the post
        await api.post(`/posts/${postId}/like`);
      }

      // Update the post's likes locally
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !isLiked,
                _count: {
                  likes: isLiked
                    ? post._count.likes - 1
                    : post._count.likes + 1,
                },
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  // Function to handle post deletion
  const handleDeletePost = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId)); // Remove post from state
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="grid gap-4">
      {/* Display a message if there aren't any posts available */}
      {message && (
        <div className="text-center p-4 rounded-lg">
          <p>{message}</p>
        </div>
      )}
      {posts.map((post) => (
        //
        <div key={post.id} className="border-gray-800 rounded-lg p-4 shadow-md">
          {/* Post owner */}
          <div className="flex justify-between items-center">
            <Link to={`/profile/${post.userId}`} className="font-bold">
              {post.user.username}
            </Link>
            {/* Show delete button if the logged-in user is the post owner */}
            {post.userId === jwtDecode(user).id && (
              <button
                onClick={() => handleDeletePost(post.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "red",
                  cursor: "pointer",
                }}
                aria-label="Delete post"
              >
                Delete
              </button>
            )}
          </div>
          {/* Posts caption */}
          <p>{post.content}</p>
          {/* Post Time */}
          <span className="text-sm italic">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
          {/* Privacy badge */}
          <div className="flex flex-col items-center mb-2">
            <span className="rounded text-xs font-bold px-2 py-1">
              {post.privacy === "PUBLIC" ? "Public 🌍" : "Private 🔒"}
            </span>
          </div>
          {/* Post image */}
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.content}
              className="w-full h-auto mt-2"
            />
          )}
          {/* Like Section */}
          <div className="flex items-center mt-2">
            <button
              className="px-4 py-2 rounded"
              onClick={() => handleLike(post.id, post.isLiked)}
            >
              <FontAwesomeIcon
                icon={post.isLiked ? fullHeart : emptyHeart}
                className={`text-lg ${
                  post.isLiked ? "text-red-500" : "text-gray-500"
                }`}
              />
            </button>
            <span className="ml-2 text-sm">
              {post._count.likes} {post._count.likes === 1 ? "like" : "likes"}
            </span>
          </div>
          {/* Comments */}
          <CommentSection postId={post.id} />
        </div>
      ))}
    </div>
  );
}

export default Posts;
