import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
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

      {userProfile === "self" ||
      userProfile === jwtDecode(localStorage.getItem("token")).id ? ( // In case a user gets to their own profile page via their userId, not the self route
        <Link to="/profile/edit" className="btn btn-primary mt-4">
          Edit Profile
        </Link>
      ) : (
        <button
          onClick={isFollowing ? handleUnfollow : handleFollow}
          className={`btn mt-4 ${isFollowing ? "btn-danger" : "btn-primary"}`}
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
            following
          </button>
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
                  src={user.avatarUrl || "/default-avatar.png"} // !!! Change later
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />
                <Link to={`/profile/${user.id}`} className="font-medium">
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
