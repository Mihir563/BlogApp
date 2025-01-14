import React, { useState, useEffect } from 'react';


const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check login status on initial render
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);


    const handleLogout = () => {
        setIsLoggedIn(false)
        window.location.href = '/login'
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
    } 

  return (
    <div>
          <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
              <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                  <div className="flex items-center">
                      <a href="/" className="font-bold text-xl text-gray-900">
                          BlogApp
                      </a>
                  </div>
                  <div className="flex items-center space-x-4">
                      {!isLoggedIn ? (
                          <>
                              <p className="text-xs sm:text-sm text-red-400 ml-2 sm:ml-4">
                                  (*You can create a fake account or anything you want; authorization is not that important)
                              </p>
                              <a href="/login" className="text-gray-700 hover:text-gray-900 text-sm sm:text-base">
                                  SignUp/Login
                              </a>
                          </>
                      ) : (
                          <div className="flex items-center space-x-2 sm:space-x-4">
                              <a
                                  href="/search"
                                  className="text-gray-700 hover:text-gray-900"
                                  title="Search"
                              >
                                  <span className="material-icons-round">search</span>
                              </a>
                              <a
                                  href="/blog"
                                  className="text-gray-700 hover:text-gray-900"
                                  title="Upload Blog"
                              >
                                  <span className="material-icons-round">send</span>
                              </a>
                              <a
                                  href="/dashboard"
                                  className="text-gray-700 hover:text-gray-900"
                                  title="Dashboard"
                              >
                                  <span className="material-icons-round">home</span>
                              </a>
                              <a
                                  href="/admin"
                                  className="text-gray-700 hover:text-gray-900"
                                  title="Profile"
                              >
                                  <span className="material-icons-round">person</span>
                              </a>
                              {/* Uncomment this if you want a logout button */}
                              {/* <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-gray-900"
          >
              Logout
          </button> */}
                          </div>
                      )}
                  </div>
              </nav>
          </header>

    </div>
  )
}

export default Header