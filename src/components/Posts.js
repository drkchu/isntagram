import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import api from "../api/axios";

function Posts({ tab }) {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const endpoint = tab === "following" ? "/posts/following" : "/posts";
        const { data } = await api.get(endpoint);

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
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchPosts();
  }, [tab]);

  return (
    <div className="grid gap-4">
      {message && (
        <div className="text-center p-4 rounded-lg">
          <p>{message}</p>
        </div>
      )}
      {posts.map((post) => (
        //
        <div key={post.id} className="border-gray-800 rounded-lg p-4 shadow-md">
          {/* Post owner */}
          <h3 className="font-bold">{post.user.username}</h3>
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
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.content}
              className="w-full h-auto mt-2"
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default Posts;
