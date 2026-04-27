import React from 'react';
import { Heart, Star, ShoppingCart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const navigate = useNavigate();
  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-52 bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount && (
            <span className="px-2.5 py-1 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-black rounded-full shadow">
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span className="px-2.5 py-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-xs font-black rounded-full shadow">
              NEW
            </span>
          )}
          {product.featured && (
            <span className="px-2.5 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-black rounded-full shadow flex items-center gap-1">
              <Zap size={10} strokeWidth={3} /> HOT
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}
          className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
        >
          <Heart
            size={16}
            strokeWidth={2.5}
            className={wishlisted ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}
          />
        </button>

        {/* Quick Add */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          whileHover={{ opacity: 1, y: 0 }}
          onClick={e => { e.stopPropagation(); addToCart(product); }}
          className="absolute bottom-3 left-3 right-3 py-2.5 bg-white/90 backdrop-blur-sm rounded-2xl text-sm font-bold text-gray-800 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-gradient-to-r hover:from-orange-400 hover:to-pink-500 hover:text-white"
        >
          <ShoppingCart size={14} strokeWidth={2.5} />
          Quick Add
        </motion.button>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="font-bold text-gray-900 text-sm line-clamp-1 mb-2 group-hover:text-orange-500 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400 font-medium">({product.reviews.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-black text-gray-900 text-base">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>
            )}
          </div>
          {product.colors && (
            <div className="flex gap-1">
              {product.colors.slice(0, 3).map(color => (
                <div
                  key={color}
                  className="w-3 h-3 rounded-full border border-gray-200 shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
