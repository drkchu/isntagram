import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

function EditProfilePage() {
  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    website: "",
    avatarUrl: "",
  });

  const userId = jwtDecode(localStorage.getItem("token")).id;
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current user's profile data
    const fetchProfile = async () => {
      try {
        const res = await api.get(`users/${userId}`);
        setFormData(res.data.user.profile);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/users/${userId}/profile`, formData);
      navigate(`/profile/self`);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-4">
      <label>
        Bio:
        <input
          type="text"
          name="bio"
          value={formData.bio || ""}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
      </label>

      <label>
        Location:
        <input
          type="text"
          name="location"
          value={formData.location || ""}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
      </label>

      <label>
        Website:
        <input
          type="url"
          name="website"
          value={formData.website || ""}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
      </label>

      <label>
        Avatar URL:
        <input
          type="url"
          name="avatarUrl"
          value={formData.avatarUrl || ""}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
      </label>

      <button type="submit" className="btn btn-primary mt-4">
        Save Changes
      </button>
    </form>
  );
}

export default EditProfilePage;
