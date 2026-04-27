import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { products } from '../data/products';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

const Wishlist: React.FC = () => {
  const { wishlist } = useStore();
  const wishlisted = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
            <Heart size={18} className="text-white fill-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Wishlist</h1>
            <p className="text-gray-400 text-sm">{wishlisted.length} item{wishlisted.length !== 1 ? 's' : ''} saved</p>
          </div>
        </div>

        {wishlisted.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center mx-auto mb-6">
              <Heart size={56} className="text-pink-300" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-400 mb-8">Save your favorite items to shop later</p>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-400 to-rose-500 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              Explore Catalog <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlisted.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
