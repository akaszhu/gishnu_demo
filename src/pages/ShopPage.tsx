import React, { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/catalog';
import { CategoryName, FabricLine } from '../types/store';
import { ProductCard } from '../components/ProductCard';

const CATEGORY_TABS: Array<{ label: string; value: CategoryName | '' }> = [
  { label: 'All Products', value: '' },
  { label: "Women's Scrubs", value: 'Women' },
  { label: "Men's Scrubs", value: 'Men' },
  { label: 'Lab Coats', value: 'Lab Coats' },
  { label: 'Stethoscopes', value: 'Stethoscopes' },
  { label: 'Footwear & Gear', value: 'Accessories' },
];

const LINE_FILTERS: Array<FabricLine | 'All'> = [
  'All',
  'ecoflex™',
  'ecoflex™ Lite',
  'Classic',
  'Chief',
  '6sense',
  'Drift',
  'Campus',
];

export function ShopPage() {
  const { selectedCategory, navigate, searchQuery, setSearchQuery } = useStore();

  const [selectedLine, setSelectedLine] = useState<FabricLine | 'All'>('All');
  const [priceRange, setPriceRange] = useState<'all' | 'under1500' | '1500to2500' | 'over2500'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    if (selectedCategory) {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (selectedLine !== 'All') {
      list = list.filter((p) => p.line === selectedLine);
    }

    if (priceRange === 'under1500') {
      list = list.filter((p) => p.price < 1500);
    } else if (priceRange === '1500to2500') {
      list = list.filter((p) => p.price >= 1500 && p.price <= 2500);
    } else if (priceRange === 'over2500') {
      list = list.filter((p) => p.price > 2500);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.line.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    }

    return list;
  }, [selectedCategory, selectedLine, priceRange, searchQuery, sortBy]);

  const resetAllFilters = () => {
    setSelectedLine('All');
    setPriceRange('all');
    setSearchQuery('');
    setSortBy('featured');
    navigate('shop', { category: '' });
  };

  const activeHeading =
    CATEGORY_TABS.find((t) => t.value === selectedCategory)?.label || 'All Products';

  return (
    <main className="bg-[#FAFBF9] min-h-screen pb-20">
      {/* Page Banner */}
      <div className="bg-[#0A2540] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#93C5FD] mb-2">
            Trade Meds Clinical Catalog
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white">{activeHeading}</h1>
          <p className="text-sm text-[#CBD5E1] mt-2 max-w-xl">
            Every uniform is shift-tested for breathability, pocket capacity, and zero-fade industrial laundering.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-[#E2E8F0]">
          {CATEGORY_TABS.map((tab) => {
            const active = selectedCategory === tab.value;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => navigate('shop', { category: tab.value })}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-[#0A2540] text-white'
                    : 'bg-white text-[#475569] border border-[#E2E8F0] hover:text-[#0A2540]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#64748B] inline-flex items-center gap-1.5 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Fabric / Line:</span>
            </span>
            {LINE_FILTERS.map((line) => (
              <button
                key={line}
                type="button"
                onClick={() => setSelectedLine(line)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedLine === line
                    ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold border border-[#BFDBFE]'
                    : 'bg-[#F8FAFC] text-[#475569] hover:text-[#0A2540]'
                }`}
              >
                {line}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Inline Search */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by keyword..."
                className="w-full sm:w-48 pl-9 pr-7 py-2 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#0A2540]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#64748B]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Price Filter */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value as typeof priceRange)}
              aria-label="Filter by price"
              className="px-3 py-2 text-xs font-medium border border-[#CBD5E1] rounded-lg bg-white text-[#0A2540] focus:outline-none focus:border-[#0A2540]"
            >
              <option value="all">All Prices</option>
              <option value="under1500">Under ₹1,500</option>
              <option value="1500to2500">₹1,500 – ₹2,500</option>
              <option value="over2500">Above ₹2,500</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              aria-label="Sort products"
              className="px-3 py-2 text-xs font-medium border border-[#CBD5E1] rounded-lg bg-white text-[#0A2540] focus:outline-none focus:border-[#0A2540]"
            >
              <option value="featured">Sort: Featured</option>
              <option value="rating">Sort: Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-5 text-xs text-[#64748B]">
          <span className="tabular-nums">
            Showing <strong className="text-[#0A2540]">{filteredProducts.length}</strong> clinical essentials
          </span>
          {(selectedCategory || selectedLine !== 'All' || priceRange !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="font-semibold text-[#2563EB] hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center">
            <p className="text-lg font-semibold text-[#0A2540] mb-2">No matching products found</p>
            <p className="text-sm text-[#64748B] mb-6">
              Try clearing your fabric line or price filter to view the full medical catalog.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="px-5 py-2.5 bg-[#0A2540] text-white text-sm font-semibold rounded-lg hover:bg-[#1E3A8A] transition-colors"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
