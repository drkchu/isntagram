import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Navbar from "../components/Sidebar";
import Posts from "../components/Posts";
import SuggestedAccounts from "../components/SuggestedAccounts";

function HomePage() {
  const [tab, setTab] = useState("recents"); // recents or following
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

      if (decodedToken.exp && decodedToken.exp < currentTime) { // The token has expired
        console.error("Token has expired");
        logout(); // Clear the user from context
        navigate("/login-signup"); // Redirect to login-signup page
      }
    } catch (err) {
      console.error("Invalid token:", err.message);
      logout();
      navigate("/login-signup"); // Redirect to login-signup page
    }
  }, [navigate, logout]);


  return (
    <div className="flex flex-col md:flex-row h-screen">
        <Navbar />
      {/* Main Content */}
      <main className="flex flex-col w-full md:w-2/3 pt-4">
        {/* Toggle Buttons */}
        <div className="flex justify-center mb-4 gap-4">
          <button
            className={`btn ${tab === "recents" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setTab("recents")}
          >
            Recents
          </button>
          <button
            className={`btn ${
              tab === "following" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setTab("following")}
          >
            Following
          </button>
        </div>

        {/* Posts */}
        <div className="flex-1 overflow-y-auto scroll-container">
          <Posts tab={tab} />
        </div>
      </main>

      {/* Suggested Accounts */}
      <aside className="hidden md:block w-1/3 p-4 border-gray-800 border-l">
        <SuggestedAccounts />
      </aside>
    </div>
  );
}

export default HomePage;
