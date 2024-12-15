import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginSignupPage from "./pages/LoginSignupPage";
import HomePage from "./pages/HomePage";
import AuthCallback from './pages/AuthCallback';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login-signup" element={<LoginSignupPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
