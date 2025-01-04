"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { constitutionLink, forumLink, homeLink, sectionSublinks, Central_ActsLink } from '@/constants/navLinks';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Create a reference for the dropdown menu's <li> element
  const dropdownRef = useRef<HTMLLIElement | null>(null);

  // Toggle mobile menu visibility
  const handleMenuClick = () => {
    setIsOpen(prev => !prev);
  };

  // Toggle dropdown menu visibility
  const handleDropdownClick = () => {
    setIsDropdownOpen(prev => !prev);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    // Function to handle click outside the dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    // Add event listener for clicks
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="flex flex-col md:flex-row items-center justify-between w-full h-auto p-4 bg-gray-800">
      <div>
        <Image
          src="/reshot-icon-law-Q7HKRPSXMY.svg"
          height={48}
          width={48}
          alt="Logo"
          priority
        />
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={handleMenuClick}
        className="md:hidden flex items-center px-2 py-1 rounded hover:bg-gray-700 focus:outline-none"
        aria-label="Toggle navigation"
      >
        {isOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        )}
      </button>

      {/* Navigation Links */}
      <div
        className={`md:flex flex-col md:flex-row items-center w-full md:justify-center ${isOpen ? 'block' : 'hidden'}`}
      >
        <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 bg-teal-500 md:bg-gray-800 p-4 mt-2 md:p-0 rounded md:rounded-none">
          <li>
            <Link href={homeLink.path} className="text-yellow-200 hover:text-teal-300">
              {homeLink.name}
            </Link>
          </li>
          <li>
            <Link href={Central_ActsLink.path} className="text-yellow-200 hover:text-teal-300">
              {Central_ActsLink.name}
            </Link>
          </li>
          <li>
            <Link href={constitutionLink.path} className="text-yellow-200 hover:text-teal-300">
              {constitutionLink.name}
            </Link>
          </li>

          {/* Dropdown Trigger */}
          <li className="relative" ref={dropdownRef}>
            <button
              onClick={handleDropdownClick}
              className="text-yellow-200 hover:text-teal-300 focus:outline-none"
              aria-label="Toggle dropdown menu"
            >
              Sections
              <svg
                className={`w-4 h-4 ml-1 inline-block transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            {isDropdownOpen && (
              <ul className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
                {sectionSublinks.map((sublink, index) => (
                  <li key={index}>
                    <Link href={sublink.path} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-teal-800">
                      {sublink.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li>
            <Link href={forumLink.path} className="text-yellow-200 hover:text-teal-300">
              {forumLink.name}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
