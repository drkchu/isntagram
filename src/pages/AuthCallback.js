import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthCallback = () => {
  const { login } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      login(token); // Use the existing login function to authenticate the user
    } else {
      navigate('/login-signup');
    }
  }, [location, login, navigate]);

  return <div>Loading...</div>;
};

export default AuthCallback;
