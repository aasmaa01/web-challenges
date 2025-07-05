// Header.jsx
import React, { useState } from 'react';
// Assuming you have an SVG for search icon or similar
// import { SearchIcon, UserIcon, MenuIcon } from '@heroicons/react/outline'; // Example if using heroicons

const Header = ({ isAuthenticated, user, onSignInClick, onSignUpClick, onSignOutClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Placeholder for user avatar or dropdown
  const UserAvatar = () => (
    <div className="relative group">
      <button className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
        {user?.initials || 'UN'} {/* Display user initials or default */}
      </button>
      {/* Dropdown menu (hidden by default, shown on group-hover or click) */}
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out origin-top-right">
        <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
        <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
        <button onClick={onSignOutClick} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100">Sign Out</button>
      </div>
    </div>
  );

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
        {/* Logo or Title */}
        <a href="/" className="flex items-center group"> {/* Added an 'a' tag for clickability */}
          {/* Optional: Add a simple SVG icon here */}
          <svg className="h-6 w-6 mr-2 text-blue-600 group-hover:text-blue-700 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h1 className="text-2xl font-extrabold text-blue-700 tracking-tight group-hover:text-blue-800 transition-colors duration-200">
            CollabNote
          </h1>
        </a>

        {/* Right-aligned actions */}
        <nav className="flex items-center gap-3 sm:gap-4">
          {/* Optional Search Bar - Visible on larger screens */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search notes..."
              className="pl-9 pr-3 py-1.5 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 text-sm w-48 lg:w-64 transition-all duration-200"
            />
            {/* SVG for search icon */}
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>

          {/* Conditional rendering for authentication state */}
          {isAuthenticated ? (
            <UserAvatar />
          ) : (
            <>
              <button
                onClick={onSignInClick}
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition duration-200 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Sign In
              </button>
              <button
                onClick={onSignUpClick}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Sign Up
              </button>
            </>
          )}

          {/* Mobile Hamburger Menu (hidden on desktop) */}
          <button
            className="md:hidden text-gray-600 hover:text-blue-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {/* Hamburger Icon */}
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white py-4 border-t border-gray-200 shadow-md">
          <nav className="flex flex-col items-start px-4 gap-3">
            {isAuthenticated ? (
              <>
                <a href="/profile" className="block text-gray-700 hover:text-blue-600 w-full py-2">Profile</a>
                <a href="/settings" className="block text-gray-700 hover:text-blue-600 w-full py-2">Settings</a>
                <button onClick={onSignOutClick} className="block text-left text-gray-700 hover:text-blue-600 w-full py-2">Sign Out</button>
              </>
            ) : (
              <>
                <button onClick={onSignInClick} className="block text-gray-700 hover:text-blue-600 w-full py-2">Sign In</button>
                <button onClick={onSignUpClick} className="block bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md text-left px-3">Sign Up</button>
              </>
            )}
            {/* Optional: Mobile Search */}
            <div className="relative w-full mt-2">
              <input
                type="text"
                placeholder="Search notes..."
                className="pl-9 pr-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 text-sm w-full"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;