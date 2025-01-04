import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

import api from "../api/axios";

const LoginSignupPage = () => {
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        const response = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        login(response.data.token);
      } else {
        const response = await api.post("/auth/register", {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        login(response.data.token); // Log in the user after successful signup
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  const handleGuestLogin = async () => {
    const response = await api.post("/auth/login", {
      email: "guest@gmail.com",
      password: "1q2w3e4r5t",
    });
    login(response.data.token);
  };

  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:3000/auth/github"; // Endpoint for GitHub OAuth
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br">
      <div className="w-full max-w-md bg-white p-8 shadow-xl rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-black">
          {isLogin ? "Welcome Back!" : "Create Your Account"}
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              required={!isLogin}
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
          <button type="submit" className="btn btn-primary w-full">
            {isLogin ? "Login" : "Signup"}
          </button>
          {isLogin && (
            <div className="btn btn-accent w-full" onClick={handleGuestLogin}>
              Login as a Guest
            </div>
          )}
        </form>
        <div className="divider">OR</div>
        <button
          className="btn btn-outline w-full flex items-center justify-center gap-2"
          onClick={handleGitHubLogin}
        >
          <FontAwesomeIcon icon={faGithub} className="text-lg" />
          Continue with GitHub
        </button>
        <p className="text-sm text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline"
          >
            {isLogin ? "Signup" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginSignupPage;
