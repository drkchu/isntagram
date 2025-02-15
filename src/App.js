import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginSignupPage from "./pages/LoginSignupPage";
import AuthCallback from "./pages/AuthCallback";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // For React Query v5+
import MessagesPage from "./pages/MessagesPage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login-signup" element={<LoginSignupPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/profile/:userProfile" element={<ProfilePage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/" element={<HomePage />} />
          {/* Catch-All Route for 404 Pages */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
