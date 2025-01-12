import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './Auth/Auth';
import Landing from './Landing';
import Dashboard from './route/Dashboard';
import SendBlog from './route/SendBlog';
import Comment from './route/Comment';
import 'material-icons/iconfont/material-icons.css';
import Admin from './route/Admin';
import SearchBlog from './route/SearchBlog';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on initial render
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  
  
  return (
    <>
      
      <Router>
        <Routes >
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/blog" element={<SendBlog />} />
          
          <Route path="/blog/:blogId"  element={<Comment />} />
          <Route path="/admin"  element={<Admin />} />
          <Route path="/search"  element={<SearchBlog />} />
          
          </Routes>
      </Router>
    </>
  );
};

export default App;
