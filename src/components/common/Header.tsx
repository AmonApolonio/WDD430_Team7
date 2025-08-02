"use client";

// Header component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faUser, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../ui/Button';
import { SearchBar } from '../ui/SearchBar';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b-2 border-gray-300 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <img
              src="/images/icon.png"
              alt="Handcrafted Haven Logo"
              className="w-12 h-12 rounded"
            />
            <div className="ml-1">
              <h1 className="text-xl font-bold text-gray-800">Handcrafted Haven</h1>
            </div>
          </Link>
        </div>

        {/* Search Bar and Filter */}
        <div className="flex-1 max-w-2xl mx-8 flex gap-2">
          <SearchBar
            placeholder="Search for handcrafted items..."
            className="flex-1"
          />
          <Button
            variant="outline"
            className="h-10"
          >
            <FontAwesomeIcon icon={faFilter} className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Account and Cart Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-10"
          >
            <FontAwesomeIcon icon={faUser} className="h-4 w-4 mr-2" />
            My Account
          </Button>
          <Button
            variant="outline"
            className="h-10"
          >
            <FontAwesomeIcon icon={faShoppingCart} className="h-4 w-4 mr-2" />
            Cart
          </Button>
        </div>
      </div>
    </header>
  );
}
