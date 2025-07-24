'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { UserMenuButton } from '@/components/Auth/UserMenuButton';
import { useAuth } from '@/components/Auth/AuthContext';

export default function AppHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  // Track scroll position to change header style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation links
  const navLinks = [
    { name: 'Dashboard', href: '/' },
    { name: 'Predictions', href: '/predictions' },
    { name: 'API Docs', href: '/microservices' },
    // Only show pricing to non-authenticated users
    ...(isAuthenticated ? [] : [{ name: 'Pricing', href: '/pricing' }]),
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#1a1a2e]/80 backdrop-blur-md py-2 shadow-lg' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/cews-logo.png"
              alt="CEWS Logo"
              width={240}
              height={75}
              className="h-14 w-auto"
              priority
            />
          </Link>

          <div className="flex items-center">
            {/* Main Navigation */}
            <nav className="hidden md:flex space-x-1 mr-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    pathname === link.href
                      ? 'bg-indigo-600 text-white'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <UserMenuButton />
          </div>

          {/* Mobile Navigation Toggle (simplified for this example) */}
          <div className="md:hidden">
            <button 
              className="p-2 rounded-md text-white hover:bg-white/10"
              aria-label="Toggle menu"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16m-7 6h7" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 