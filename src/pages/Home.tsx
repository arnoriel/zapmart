import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Truck, Shield, RotateCcw, Headphones, Star, Zap, TrendingUp, Gift } from 'lucide-react';
import { products, bannerSlides, categories } from '../data/products';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setSlideIndex(i => (i + 1) % bannerSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const featured = products.filter(p => p.featured);
  const newArrivals = products.filter(p => p.isNew);
  const onSale = products.filter(p => p.originalPrice);

  const perks = [
    { icon: Truck, label: 'Free Shipping', desc: 'On all orders' },
    { icon: Shield, label: 'Secure Payment', desc: '100% protected' },
    { icon: RotateCcw, label: 'Easy Returns', desc: '30-day policy' },
    { icon: Headphones, label: '24/7 Support', desc: 'Always here for you' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Slider */}
      <div className="relative h-[75vh] min-h-[500px] max-h-[700px] overflow-hidden">
        <AnimatePresence mode="wait">
          {bannerSlides.map((slide, i) => i === slideIndex && (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg} opacity-90`} />
              <img src={slide.image} alt={slide.title} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" />
              <div className="relative h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-sm font-semibold rounded-full mb-5 border border-white/30">
                      <Zap size={14} /> Limited Time Offer
                    </span>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-none mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-white/90 text-lg sm:text-xl font-medium mb-8 max-w-md">
                      {slide.subtitle}
                    </p>
                    <button
                      onClick={() => navigate('/catalog')}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 font-black rounded-2xl text-lg shadow-2xl hover:scale-105 active:scale-95 transition-transform"
                    >
                      {slide.cta}
                      <ArrowRight size={20} strokeWidth={2.5} />
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {bannerSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIndex(i)}
              className={`transition-all duration-300 rounded-full ${i === slideIndex ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/50'}`}
            />
          ))}
        </div>
        <button
          onClick={() => setSlideIndex(i => (i - 1 + bannerSlides.length) % bannerSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setSlideIndex(i => (i + 1) % bannerSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Perks Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {perks.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-orange-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Shop by Category</h2>
              <p className="text-gray-400 text-sm mt-1">Find exactly what you're looking for</p>
            </div>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {categories.filter(c => c !== 'All').map((cat, i) => {
              const emojis: Record<string, string> = {
                Electronics: '⚡', Fashion: '👗', 'Home & Living': '🏠',
                Beauty: '✨', Sports: '🏃', Books: '📚', Toys: '🎮',
              };
              const gradients = [
                'from-orange-400 to-pink-500', 'from-purple-400 to-indigo-500',
                'from-cyan-400 to-blue-500', 'from-emerald-400 to-teal-500',
                'from-amber-400 to-orange-500', 'from-rose-400 to-pink-500',
                'from-lime-400 to-green-500',
              ];
              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <Link
                    to={`/catalog?category=${cat}`}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${gradients[i]} flex items-center justify-center shadow-md group-hover:shadow-xl transition-shadow text-2xl`}>
                      {emojis[cat] || '🛍️'}
                    </div>
                    <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{cat}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">Hot Products</h2>
                <p className="text-gray-400 text-sm">Trending right now</p>
              </div>
            </div>
            <Link to="/catalog?featured=true" className="flex items-center gap-1 text-sm font-semibold text-orange-500 hover:gap-2 transition-all">
              See all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </section>

        {/* Promo Banner */}
        <section>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 p-8 md:p-12">
            <div className="absolute inset-0 opacity-10">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-24 h-24 rounded-full bg-white"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    opacity: Math.random() * 0.5,
                  }}
                />
              ))}
            </div>
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Gift size={20} className="text-yellow-300" />
                  <span className="text-yellow-300 font-bold text-sm">Special Offer</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                  Get 20% Off Your First Order
                </h2>
                <p className="text-white/80 text-base">Use code <span className="font-black bg-white/20 px-2 py-0.5 rounded-lg">ZAPNEW20</span> at checkout</p>
              </div>
              <Link
                to="/catalog"
                className="flex-shrink-0 px-8 py-4 bg-white text-violet-600 font-black rounded-2xl hover:scale-105 transition-transform shadow-xl"
              >
                Shop Now →
              </Link>
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <TrendingUp size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">New Arrivals</h2>
                <p className="text-gray-400 text-sm">Fresh drops just for you</p>
              </div>
            </div>
            <Link to="/catalog?new=true" className="flex items-center gap-1 text-sm font-semibold text-cyan-500 hover:gap-2 transition-all">
              See all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </section>

        {/* On Sale */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
                <Star size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">On Sale</h2>
                <p className="text-gray-400 text-sm">Don't miss these deals</p>
              </div>
            </div>
            <Link to="/catalog?sale=true" className="flex items-center gap-1 text-sm font-semibold text-rose-500 hover:gap-2 transition-all">
              See all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {onSale.slice(0, 4).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
