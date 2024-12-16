import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginSignupPage from "./pages/LoginSignupPage";
import HomePage from "./pages/HomePage";
import AuthCallback from './pages/AuthCallback';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // For React Query v5+

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
    <Router>
      <Routes>
        <Route path="/login-signup" element={<LoginSignupPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
    </QueryClientProvider>
  );
};

export default App;
