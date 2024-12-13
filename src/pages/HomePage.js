import React, { useState } from "react";
import Navbar from "../components/Sidebar";
import Posts from "../components/Posts";
import SuggestedAccounts from "../components/SuggestedAccounts";

function HomePage() {
  const [tab, setTab] = useState("recents"); // recents or following

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar (Navbar) */}
      <aside className="w-full md:w-2/12 p-4 border-gray-800 border-r">
        <Navbar />
      </aside>

      {/* Main Content */}
      <main className="flex flex-col w-full md:w-7/12 p-4">
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
      <aside className="hidden md:block w-3/12 p-4 border-gray-800 border-l">
        <SuggestedAccounts />
      </aside>
    </div>
  );
}

export default HomePage;
