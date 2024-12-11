import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignupPage from './pages/LoginSignupPage';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login-signup" element={<LoginSignupPage />} />
      </Routes>
    </Router>
  );
};

export default App;
