import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

const rootElement = document.getElementById("root");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <AuthProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </AuthProvider>
);
