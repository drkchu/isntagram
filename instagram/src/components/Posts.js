import React, { useEffect, useState } from "react";
import api from "../api/axios";

function Posts({ tab }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const endpoint = tab === "following" ? "/posts/following" : "/posts";
        const { data } = await api.get(endpoint);
        console.log("User data:", data);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchPosts();
  }, [tab]);

  return (
    <div className="grid gap-4">
      {posts.map((post) => (
        <div key={post.id} className="border-gray-800 rounded-lg p-4 shadow-md">
          <h3 className="font-bold">{post.user.username}</h3>
          <p>{post.content}</p>
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
