
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faStar, faFilter } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import { fetchCategoriesData } from '@/lib/api';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { SearchFilters } from '@/types/shopping';

interface FiltersDialogProps {
  open: boolean;
  onClose: () => void;
}

const categories = [
  { label: 'Kitchen & Dining' },
  { label: 'Home Decor' },
  { label: 'Art & Collectibles' },
  { label: 'Jewelry' },
  { label: 'Clothing' },
  { label: 'Toys & Games' },
];

const ratings = [
  { stars: 5, },
  { stars: 4, },
  { stars: 3, },
  { stars: 2, },
  { stars: 1, },
];


export const FiltersDialog: React.FC<FiltersDialogProps> = ({ open, onClose }) => {
  const PRICE_MIN = 20;
  const PRICE_MAX = 200;
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

  useEffect(() => {
    setCategories(fetchCategoriesData());
    const saved = sessionStorage.getItem('filters');
    if (saved) {
      try {
        const parsed: SearchFilters = JSON.parse(saved);
        if (parsed.priceRange && Array.isArray(parsed.priceRange)) setPriceRange(parsed.priceRange);
        if (parsed.selectedCategories && Array.isArray(parsed.selectedCategories)) setSelectedCategories(parsed.selectedCategories);
        if (parsed.selectedRatings && Array.isArray(parsed.selectedRatings)) setSelectedRatings(parsed.selectedRatings);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const filters: SearchFilters = {
      priceRange,
      selectedCategories,
      selectedRatings
    };
    sessionStorage.setItem('filters', JSON.stringify(filters));
  }, [priceRange, selectedCategories, selectedRatings]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
      <div
        className="fixed inset-0 z-40 cursor-default"
        aria-label="Close filters dialog overlay"
        tabIndex={-1}
        onClick={onClose}
        style={{ background: 'transparent' }}
      />
      <div
        className="relative z-50 bg-white rounded-lg shadow-md w-full max-w-xs sm:max-w-sm p-4 m-2 border border-gray-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute top-2 right-2 p-1 rounded focus:outline-none hover:bg-gray-100"
          aria-label="Close filters dialog"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faXmark} className="h-4 w-4 text-gray-500" />
        </button>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
          <FontAwesomeIcon icon={faFilter} className="h-4 w-4 text-orange-400" />
          Filters
        </h2>
        {/* Category */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-1 text-gray-700">Category</h3>
          <div className="flex flex-col gap-1">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  className="accent-orange-400 w-4 h-4 rounded border-gray-200"
                  checked={selectedCategories.includes(cat)}
                  onChange={e => {
                    setSelectedCategories(prev =>
                      e.target.checked
                        ? [...prev, cat]
                        : prev.filter(c => c !== cat)
                    );
                  }}
                />
                <span className="flex-1 text-gray-700">{cat}</span>
              </label>
            ))}
          </div>
        </div>
        {/* Price Range */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-1 text-gray-700">Price Range</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-400 text-xs">${PRICE_MIN}</span>
              <Slider
                range
                min={PRICE_MIN}
                max={PRICE_MAX}
                value={priceRange}
                onChange={(val) => {
                  if (Array.isArray(val) && val.length === 2) setPriceRange([val[0], val[1]]);
                }}
                allowCross={false}
                trackStyle={[{ backgroundColor: '#fb923c' }]}
                handleStyle={[
                  { borderColor: '#fb923c', backgroundColor: '#fff' },
                  { borderColor: '#fb923c', backgroundColor: '#fff' }
                ]}
                railStyle={{ backgroundColor: '#f3f4f6' }}
              />
              <span className="text-gray-400 text-xs">${PRICE_MAX}</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={PRICE_MIN}
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={e => {
                  const val = Math.min(Number(e.target.value), priceRange[1]);
                  setPriceRange([val, priceRange[1]]);
                }}
                className="w-12 border border-gray-200 rounded px-1 py-0.5 text-center text-xs"
              />
              <span className="text-gray-300">-</span>
              <input
                type="number"
                min={priceRange[0]}
                max={PRICE_MAX}
                value={priceRange[1]}
                onChange={e => {
                  const val = Math.max(Number(e.target.value), priceRange[0]);
                  setPriceRange([priceRange[0], val]);
                }}
                className="w-12 border border-gray-200 rounded px-1 py-0.5 text-center text-xs"
              />
            </div>
          </div>
        </div>
        {/* Customer Rating */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-1 text-gray-700">Customer Rating</h3>
          <div className="flex flex-col gap-1">
            {ratings.map((r) => (
              <label key={r.stars} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  className="accent-orange-400 w-4 h-4 rounded border-gray-200"
                  checked={selectedRatings.includes(r.stars)}
                  onChange={e => {
                    setSelectedRatings(prev =>
                      e.target.checked
                        ? [...prev, r.stars]
                        : prev.filter(s => s !== r.stars)
                    );
                  }}
                />
                <span className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={faStar}
                      className={i < r.stars ? 'text-yellow-400' : 'text-gray-200'}
                    />
                  ))}
                  <span className="ml-1 text-gray-400 text-xs">&amp; up</span>
                </span>
              </label>
            ))}
          </div>
        </div>
        <button
          className="w-full mt-2 py-2 rounded bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium border border-gray-100 transition text-sm"
          onClick={() => {
            setSelectedCategories([]);
            setSelectedRatings([]);
            setPriceRange([PRICE_MIN, PRICE_MAX]);
            sessionStorage.removeItem('filters');
            onClose();
          }}
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};
