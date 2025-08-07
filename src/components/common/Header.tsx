"use client";

// Header component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faUser, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import { useState } from 'react';
import { Button } from '../ui/Button';
import { SearchBar } from '../ui/SearchBar';
import Link from 'next/link';
import Image from 'next/image';
import { FiltersDialog } from './FiltersDialog';


export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  return (
    <header className="bg-white border-b-2 border-orange-300/50 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/icon.png"
              alt="Handcrafted Haven Logo"
              width={40}
              height={40}
              className="w-10 h-10 rounded"
              priority
            />
            <div className="ml-1">
              <h1 className="text-lg md:text-xl font-bold text-gray-800">Handcrafted Haven</h1>
            </div>
          </Link>
        </div>

        {/* Hamburger button for mobile */}
        <button
          className="md:hidden ml-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
          aria-label="Open menu"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <svg className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Search Bar and Filter (responsive) */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8 gap-2">
          <SearchBar
            placeholder="Search for handcrafted items..."
            className="flex-1"
          />
          <Button
            variant="filled"
            className="h-10 px-3 py-1"
            grow={true}
            onClick={() => setFiltersOpen(true)}
          >
            <FontAwesomeIcon icon={faFilter} className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Account and Cart Buttons (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/account">
            <Button
              variant="filled"
              className="h-10 px-3 py-1"
              grow={true}
            >
              <FontAwesomeIcon icon={faUser} className="h-4 w-4 mr-2" />
              My Account
            </Button>
          </Link>
          <Link href="/cart">
            <Button
              variant="filled"
              className="h-10 px-3 py-1"
              grow={true}
            >
              <FontAwesomeIcon icon={faShoppingCart} className="h-4 w-4 mr-2" />
              Cart
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-transparent" onClick={() => setMobileMenuOpen(false)}></div>
      )}
      {/* Mobile menu panel */}
      <div
        className={`md:hidden fixed inset-0 z-50 w-full h-full bg-white shadow-lg transform transition-transform duration-200 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ willChange: 'transform' }}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-bold text-lg text-gray-800">Menu</span>
          <button
            className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-4 p-4">
          <SearchBar
            placeholder="Search for handcrafted items..."
            className="w-full"
          />
          <Button
            variant="filled"
            className="h-10 px-3 py-1 w-full"
            grow={true}
            onClick={() => { setFiltersOpen(true); setMobileMenuOpen(false); }}
          >
            <FontAwesomeIcon icon={faFilter} className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Link href="/account" onClick={() => setMobileMenuOpen(false)}>
            <Button
              variant="filled"
              className="h-10 px-3 py-1 w-full"
              grow={true}
            >
              <FontAwesomeIcon icon={faUser} className="h-4 w-4 mr-2" />
              My Account
            </Button>
          </Link>
          <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
            <Button
              variant="filled"
              className="h-10 px-3 py-1 w-full"
              grow={true}
            >
              <FontAwesomeIcon icon={faShoppingCart} className="h-4 w-4 mr-2" />
              Cart
            </Button>
          </Link>
        </div>
      </div>
      {/* Filters Dialog (modal) */}
      <FiltersDialog open={filtersOpen} onClose={() => setFiltersOpen(false)} />

    </header>
  );
}
