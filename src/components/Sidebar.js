import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faSearch,
  faPlus,
  faEnvelope,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import SearchModal from "./SearchModal";
import PostModal from "./PostModal";

function Sidebar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPostOpen, setIsPostOpen] = useState(false);

  return (
    <div className="p-4 flex flex-col gap-12 h-screen">
      <Link to="/" className="btn btn-ghost text-2xl">
        <FontAwesomeIcon icon={faHome} />
      </Link>
      {/* Search Button */}
      <button
        onClick={() => setIsSearchOpen(true)}
        className="btn btn-ghost text-2xl"
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>
      {/* Create a post */}
      <button
        onClick={() => setIsPostOpen(true)}
        className="btn btn-ghost text-2xl"
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <Link to="/" className="btn btn-ghost text-2xl">
        <FontAwesomeIcon icon={faEnvelope} />
      </Link>
      <Link to="/profile/self" className="btn btn-ghost text-2xl">
        <FontAwesomeIcon icon={faUser} />
      </Link>

      {/* Search Modal */}
      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
      {/* Post Modal */}
      {isPostOpen && <PostModal onClose={() => setIsPostOpen(false)} />}
    </div>
  );
}

export default Sidebar;
