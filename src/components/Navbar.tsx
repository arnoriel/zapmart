import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Heart, Menu, X, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { cartCount, setIsCartOpen, wishlist } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/catalog', label: 'Catalog' },
    { to: '/orders', label: 'My Orders' },
  ];

  return (
    <motion.nav
      initial={false}
      animate={{
        backgroundColor: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,1)',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.08)' : '0 1px 0 rgba(0,0,0,0.06)',
      }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Zap size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              ZapMart
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-semibold transition-colors relative group ${
                  location.pathname === link.to ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-orange-400 rounded-full transition-all duration-300 ${
                  location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search anything..."
                className="w-56 pl-4 pr-10 py-2 rounded-full border-2 border-gray-100 bg-gray-50 text-sm focus:outline-none focus:border-orange-300 focus:bg-white transition-all"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors">
                <Search size={16} />
              </button>
            </div>
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <Link to="/wishlist" className="relative p-2 rounded-xl hover:bg-pink-50 transition-colors group hidden sm:flex">
              <Heart size={20} className="text-gray-600 group-hover:text-pink-500 transition-colors" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl hover:bg-orange-50 transition-colors group"
            >
              <ShoppingCart size={20} className="text-gray-600 group-hover:text-orange-500 transition-colors" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-400 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md"
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-gray-100"
            >
              <div className="py-4 space-y-3">
                <form onSubmit={handleSearch} className="flex items-center">
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search anything..."
                      className="w-full pl-4 pr-10 py-2.5 rounded-full border-2 border-gray-100 bg-gray-50 text-sm focus:outline-none focus:border-orange-300 focus:bg-white"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Search size={16} />
                    </button>
                  </div>
                </form>
                {navLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`block px-2 py-2 font-semibold text-sm rounded-xl transition-colors ${
                      location.pathname === link.to
                        ? 'text-orange-500 bg-orange-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link to="/wishlist" className="flex items-center gap-2 px-2 py-2 font-semibold text-sm text-gray-700 hover:bg-gray-50 rounded-xl">
                  <Heart size={16} /> Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
