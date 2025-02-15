import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

import Navbar from "../components/Sidebar";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const { userProfile } = useParams();

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

    const userIdProfile =
      userProfile === "self"
        ? jwtDecode(localStorage.getItem("token")).id
        : userProfile;

    const userId = jwtDecode(localStorage.getItem("token")).id;

    // Fetch profile data using the custom Axios instance
    const fetchProfile = async () => {
      try {
        const profileRes = await api.get(`/users/${userIdProfile}`);
        setProfile(profileRes.data.user.profile);

        const followersRes = await api.get(`/users/${userIdProfile}/followers`);
        setFollowers(followersRes.data);

        const followingRes = await api.get(`/users/${userIdProfile}/following`);
        setFollowing(followingRes.data);

        const isFollowingUser = followersRes.data.some(
          (user) => user.id === userId // user.id is the one of the profile's
        );

        setIsFollowing(isFollowingUser);

        const postsRes = await api.get(`/posts/user/${userIdProfile}`);
        setPosts(postsRes.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, [userProfile, navigate, logout, isFollowing]);

  const handleFollow = async () => {
    try {
      await api.post(`/users/${profile.userId}/follow`);
      setIsFollowing(true);
      setFollowers((prev) => [...prev, { id: profile.userId }]); // Only adding the id, cuz we can always query the followers again
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await api.post(`/users/${profile.userId}/unfollow`);
      setIsFollowing(false);
      setFollowers((prev) => prev.filter((f) => f.id !== profile.userId));
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const openModal = (title, data) => {
    setModalTitle(title);
    setModalData(data);
    const modal = document.getElementById("modal-dialog");
    if (modal) modal.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById("modal-dialog");
    if (modal) modal.close();
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="flex">
      {/* Sidebar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow p-8 flex justify-center">
        <div className="flex flex-col items-center max-w-md w-full">
          {/* Avatar */}
          <img
            src={profile.avatarUrl || "/anonymous.jpeg"}
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
          {userProfile === "self" ||
          userProfile === jwtDecode(localStorage.getItem("token")).id ? (
            <Link to="/profile/edit" className="btn btn-primary mt-4">
              Edit Profile
            </Link>
          ) : (
            <button
              onClick={isFollowing ? handleUnfollow : handleFollow}
              className={`btn mt-4 ${
                isFollowing ? "btn-danger" : "btn-primary"
              }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}

          {/* Follow Information */}
          <div className="flex gap-8 mt-6">
            <div>
              <p className="font-bold">{followers.length}</p>
              <button onClick={() => openModal("Followers", followers)}>
                Followers
              </button>
            </div>
            <div>
              <p className="font-bold">{following.length}</p>
              <button onClick={() => openModal("Following", following)}>
                Following
              </button>
            </div>
          </div>
          {/* Posts Grid */}
          <div className="mt-8">
            <div className="grid grid-cols-3 gap-4">
              {posts.map((post) => (
                <div key={post.id} className="relative">
                  <img
                    src={post.imageUrl}
                    alt={post.content}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                    <p className="text-white text-sm">{post.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DaisyUI Dialog */}
      <dialog id="modal-dialog" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">{modalTitle}</h3>
          <ul className="py-4">
            {modalData.map((user) => (
              <li key={user.id} className="flex items-center gap-4 mb-4">
                <img
                  src={user.avatarUrl || "/anonymous.jpeg"}
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />
                <Link
                  to={`/profile/${user.id}`}
                  className="font-medium"
                  onClick={closeModal}
                >
                  {user.username}
                </Link>
              </li>
            ))}
          </ul>
          <div className="modal-action">
            <button className="btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}

export default ProfilePage;
