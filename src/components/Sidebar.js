import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faPlus, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';

function Sidebar() {
  return (
    <div className="p-4 flex flex-col gap-12 h-screen">
      <Link to="/" className="btn btn-ghost text-2xl">
        <FontAwesomeIcon icon={faHome} />
      </Link>
      <Link to="/" className="btn btn-ghost text-2xl">
        <FontAwesomeIcon icon={faSearch} />
      </Link>
      <Link to="/" className="btn btn-ghost text-2xl">
        <FontAwesomeIcon icon={faPlus} />
      </Link>
      <Link to="/" className="btn btn-ghost text-2xl">
        <FontAwesomeIcon icon={faEnvelope} />
      </Link>
      <Link to="/profile" className="btn btn-ghost text-2xl">
        <FontAwesomeIcon icon={faUser} />
      </Link>
    </div>
  );
}

export default Sidebar;
