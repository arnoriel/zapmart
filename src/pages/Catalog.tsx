import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X, Search, ChevronDown } from 'lucide-react';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';

const Catalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');

  const activeCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';

  const handleCategory = (cat: string) => {
    const params: Record<string, string> = {};
    if (cat !== 'All') params.category = cat;
    if (searchQuery) params.search = searchQuery;
    setSearchParams(params);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params: Record<string, string> = {};
    if (activeCategory !== 'All') params.category = activeCategory;
    if (localSearch.trim()) params.search = localSearch.trim();
    setSearchParams(params);
  };

  const filtered = useMemo(() => {
    let result = [...products];
    if (activeCategory !== 'All') result = result.filter(p => p.category === activeCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (searchParams.get('featured')) result = result.filter(p => p.featured);
    if (searchParams.get('new')) result = result.filter(p => p.isNew);
    if (searchParams.get('sale')) result = result.filter(p => p.originalPrice);
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-asc': return result.sort((a, b) => a.price - b.price);
      case 'price-desc': return result.sort((a, b) => b.price - a.price);
      case 'rating': return result.sort((a, b) => b.rating - a.rating);
      case 'reviews': return result.sort((a, b) => b.reviews - a.reviews);
      default: return result;
    }
  }, [activeCategory, searchQuery, searchParams, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative flex-1 min-w-48">
              <input
                type="text"
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-100 bg-gray-50 text-sm focus:outline-none focus:border-orange-300"
              />
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              {localSearch && (
                <button type="button" onClick={() => { setLocalSearch(''); setSearchParams({}); }} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X size={14} className="text-gray-400" />
                </button>
              )}
            </form>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 rounded-xl border-2 border-gray-100 bg-white text-sm font-semibold focus:outline-none focus:border-orange-300 cursor-pointer"
              >
                <option value="default">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="reviews">Most Reviewed</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-100 bg-white text-sm font-semibold hover:border-orange-300 transition-colors"
            >
              <SlidersHorizontal size={15} />
              Filters
            </button>

            <p className="text-sm text-gray-400 ml-auto hidden sm:block">
              {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-gray-100"
            >
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price Range</p>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={0}
                    max={500}
                    step={10}
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="flex-1 accent-orange-500"
                  />
                  <span className="text-sm font-bold text-gray-700 whitespace-nowrap">
                    ${priceRange[0]} – ${priceRange[1]}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md shadow-orange-200'
                  : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center mx-auto mb-4 text-4xl">
              🔍
            </div>
            <h3 className="font-black text-xl text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => { setSearchParams({}); setLocalSearch(''); setPriceRange([0, 500]); }}
              className="px-6 py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold rounded-2xl"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
