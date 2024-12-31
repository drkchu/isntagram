import React, { useState } from "react";
import api from "../api/axios";

const PostModal = ({ onClose }) => {
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState("PUBLIC");
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", content);
    formData.append("privacy", privacy);
    formData.append("image", image);


    
    try {
      const response = await api.post("/posts", formData);

      if (response.status === 201) {
        alert("Post created successfully!");
        onClose();
      } else {
        alert("Failed to create post");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the post");
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle absolute right-2 top-2"
        >
          ✕
        </button>
        <h3 className="font-bold text-lg mb-4">Create Post</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="textarea textarea-bordered w-full"
            required
          ></textarea>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Privacy</span>
            </label>
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value.toUpperCase())}
              className="select select-bordered w-full"
            >
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Upload Image</span>
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="file-input file-input-bordered w-full"
              required
            />
          </div>

          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Post
            </button>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostModal;
