import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, ArrowLeft, Truck, Shield, RotateCcw, Minus, Plus, Zap } from 'lucide-react';
import { products } from '../data/products';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted, setIsCartOpen } = useStore();

  const product = products.find(p => p.id === id);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Product not found</h2>
          <button onClick={() => navigate('/catalog')} className="mt-4 px-6 py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold rounded-2xl">
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-orange-500 transition-colors">
            <ArrowLeft size={14} /> Back
          </button>
          <span>/</span>
          <Link to="/catalog" className="hover:text-orange-500 transition-colors">Catalog</Link>
          <span>/</span>
          <Link to={`/catalog?category=${product.category}`} className="hover:text-orange-500 transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium line-clamp-1">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 mb-16">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 relative shadow-xl">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              {discount && (
                <div className="absolute top-4 left-4 px-4 py-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-black rounded-2xl text-lg shadow-lg">
                  -{discount}% OFF
                </div>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <Link to={`/catalog?category=${product.category}`} className="inline-block px-3 py-1 bg-orange-50 text-orange-500 text-xs font-bold rounded-full mb-2 hover:bg-orange-100 transition-colors">
                  {product.category}
                </Link>
                <h1 className="text-3xl font-black text-gray-900 leading-tight">{product.name}</h1>
              </div>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="w-12 h-12 rounded-2xl border-2 border-gray-100 flex items-center justify-center hover:border-pink-200 hover:bg-pink-50 transition-all flex-shrink-0"
              >
                <Heart size={20} className={wishlisted ? 'fill-pink-500 text-pink-500' : 'text-gray-400'} />
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className={i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                ))}
              </div>
              <span className="font-bold text-gray-800">{product.rating}</span>
              <span className="text-gray-400 text-sm">({product.reviews.toLocaleString()} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-black text-gray-900">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>
              )}
              {discount && (
                <span className="px-3 py-1 bg-green-100 text-green-600 font-bold text-sm rounded-full">
                  Save ${(product.originalPrice! - product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Colors */}
            {product.colors && (
              <div className="mb-5">
                <p className="text-sm font-bold text-gray-700 mb-2">Color</p>
                <div className="flex gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? 'border-orange-400 scale-110 shadow-md' : 'border-gray-200'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && (
              <div className="mb-6">
                <p className="text-sm font-bold text-gray-700 mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[44px] px-3 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                        selectedSize === size
                          ? 'border-orange-400 bg-orange-50 text-orange-600'
                          : 'border-gray-100 text-gray-600 hover:border-orange-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <p className="text-sm font-bold text-gray-700">Quantity</p>
              <div className="flex items-center gap-3 bg-gray-100 rounded-2xl p-1">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white transition-colors text-gray-600">
                  <Minus size={16} strokeWidth={2.5} />
                </button>
                <span className="w-8 text-center font-black text-gray-900">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white transition-colors text-gray-600">
                  <Plus size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <ShoppingCart size={18} strokeWidth={2.5} />
                Add to Cart
              </button>
              <button
                onClick={() => { addToCart(product, quantity, selectedColor, selectedSize); navigate('/checkout'); }}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-gray-800 transition-colors"
              >
                <Zap size={18} strokeWidth={2.5} />
                Buy Now
              </button>
            </div>

            {/* Perks */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, text: 'Free Shipping' },
                { icon: Shield, text: 'Secure Payment' },
                { icon: RotateCcw, text: '30-Day Return' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-2xl text-center">
                  <Icon size={18} className="text-orange-400" />
                  <span className="text-xs font-semibold text-gray-600">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-12">
          <div className="flex gap-4 mb-6 border-b border-gray-100">
            {(['description', 'reviews'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 text-sm font-bold capitalize border-b-2 transition-colors ${
                  activeTab === tab ? 'text-orange-500 border-orange-400' : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'description' ? (
            <div>
              <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-orange-50 text-orange-500 text-sm font-semibold rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { name: 'Alex J.', rating: 5, comment: 'Absolutely love this product! Great quality and fast delivery. Would definitely recommend.' },
                { name: 'Sarah M.', rating: 4, comment: 'Really good product. The quality is excellent and it looks even better in person.' },
                { name: 'Chris T.', rating: 5, comment: 'Perfect! Exactly as described. Very satisfied with this purchase.' },
              ].map((review, i) => (
                <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-black flex-shrink-0">
                    {review.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-gray-900">{review.name}</span>
                      <div className="flex">
                        {[...Array(review.rating)].map((_, j) => <Star key={j} size={11} className="fill-amber-400 text-amber-400" />)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
