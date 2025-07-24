'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

export const UserMenuButton: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/login"
          className="text-gray-300 hover:text-white transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="px-4 py-2 border border-gray-400 hover:border-white rounded-lg text-gray-300 hover:text-white transition-colors"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white">
          {user?.name.charAt(0).toUpperCase()}
        </div>
        <span className="hidden md:inline-block">
          {user?.name}
        </span>
        <svg
          className={`h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#2a2a40] border border-[#4a4a70] rounded-lg shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-[#4a4a70]">
            <p className="text-sm text-white font-medium">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
          <Link
            href="/"
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#3a3a60] hover:text-white w-full text-left"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/account"
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#3a3a60] hover:text-white w-full text-left"
            onClick={() => setIsOpen(false)}
          >
            Account Settings
          </Link>
          <Link
            href="/subscriptions"
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#3a3a60] hover:text-white w-full text-left"
            onClick={() => setIsOpen(false)}
          >
            Subscription
          </Link>
          <button
            onClick={handleLogout}
            className="block px-4 py-2 text-sm text-red-400 hover:bg-red-600/20 hover:text-red-300 w-full text-left border-t border-[#4a4a70] mt-1"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}; 