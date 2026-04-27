import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Instagram, Twitter, Facebook, Youtube, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                <Zap size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                ZapMart
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Your one-stop shop for everything you love. Quality products, fast delivery, unbeatable prices.
            </p>
            <div className="flex items-center gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-orange-500 transition-colors group">
                  <Icon size={14} className="text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 'Books'].map(cat => (
                <li key={cat}>
                  <Link to={`/catalog?category=${cat}`} className="text-sm text-gray-400 hover:text-orange-400 transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-4">Help</h4>
            <ul className="space-y-2.5">
              {['FAQ', 'Shipping Info', 'Returns', 'Track Order', 'Size Guide', 'Contact Us'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-orange-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-4">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">Get the latest deals straight to your inbox.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3 py-2.5 bg-gray-800 rounded-xl text-sm text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-orange-400 transition-colors"
              />
              <button className="px-3 py-2.5 bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl hover:shadow-lg transition-shadow">
                <Mail size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© 2025 ZapMart. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a key={item} href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
