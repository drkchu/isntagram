import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // User doesn't have a token, take them back to the login-signup page
      navigate("/login-signup");
      return;
    }

    try {
      // Decode the token and check for expiration
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds

      if (decodedToken.exp && decodedToken.exp < currentTime) {
        // The token has expired
        console.error("Token has expired");
        logout(); // Clear the user from context
        navigate("/login-signup"); // Redirect to login-signup page
      }
    } catch (err) {
      console.error("Invalid token:", err.message);
      logout();
      navigate("/login-signup"); // Redirect to login-signup page
    }

    const userId = jwtDecode(localStorage.getItem('token')).id;

    // Fetch profile data using the custom Axios instance
    const fetchProfile = async () => {
      try {
        const profileRes = await api.get(`/users/${userId}`);
        setProfile(profileRes.data.user.profile);

        const followersRes = await api.get(`/users/${userId}/followers`);
        setFollowers(followersRes.data);

        const followingRes = await api.get(`/users/${userId}/following`);
        setFollowing(followingRes.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, [navigate, logout]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="p-8 flex flex-col items-center">
      {/* Avatar */}
      <img
        src={profile.avatarUrl}
        alt="Avatar"
        className="w-32 h-32 rounded-full object-cover mb-4"
      />

      {/* Profile Info */}
      <h2 className="text-2xl font-bold">{profile.bio || "No bio yet"}</h2>
      <p className="text-gray-500">{profile.location}</p>
      <a
        href={profile.website}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
      >
        {profile.website}
      </a>

      {/* Edit Profile Button */}
      <Link to="/profile/edit" className="btn btn-primary mt-4">
        Edit Profile
      </Link>

      {/* Follow Information */}
      <div className="flex gap-8 mt-6">
        <div>
          <p className="font-bold">{followers.length}</p>
          <p>Followers</p>
        </div>
        <div>
          <p className="font-bold">{following.length}</p>
          <p>Following</p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
