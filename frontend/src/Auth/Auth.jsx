import React, { useState } from "react";
import axios from "axios";
import {jwtDecode} from 'jwt-decode'
import Header from "../route/Header";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isLogin
        ? "https://blogapp-api-yzwv.onrender.com/api/auth/login"
        : "https://blogapp-api-yzwv.onrender.com/api/auth/register";

      const userData = isLogin
        ? { username, password }
        : { username, email, password };

      const responce = await axios.post(url, userData);

      if (isLogin) {
        localStorage.setItem("token", responce.data.token);
        const getUserIdFromToken = () => {
          const token = localStorage.getItem('token'); // Retrieve the token from localStorage
          if (!token) return null;

          try {
            const decodedToken = jwtDecode(token); // Decode the token
            return decodedToken.id; // Access the `id` field from the token payload
          } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
          }
        };
        const userId = getUserIdFromToken() 
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);

        alert("Login Successful");
        window.location.href = "/dashboard";
      } else {
        localStorage.setItem("token", responce.data.token);
        const getUserIdFromToken = () => {
          const token = localStorage.getItem('token'); // Retrieve the token from localStorage
          if (!token) return null;

          try {
            const decodedToken = jwtDecode(token); // Decode the token
            return decodedToken.id; // Access the `id` field from the token payload
          } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
          }
        };
        const userId = getUserIdFromToken()
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
        alert("Registration Successful");
        window.location.href = "/dashboard";
      }
    } catch (error) {
      alert(error.message || "Something went Wrong");
    }
  };

  const toggleAuth = (e) => {
    e.preventDefault(); // Prevent default navigation
    setIsLogin((prev) => !prev);
  };
  

  return (
    <>
    <Header/>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            {isLogin ? "Login to Your Account" : "Create Your Account"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent my-3"
              />
            </div>
            {!isLogin && (
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                />
              </div>
            )}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-600 text-center">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={toggleAuth}
              className="text-blue-500 hover:underline"
            >
              {isLogin ? "Sign Up here" : "Login here"}
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default Auth;
