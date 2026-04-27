import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const statusConfig = {
  packaging: {
    label: 'Packaging',
    icon: Package,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    gradient: 'from-amber-400 to-orange-500',
    description: 'Your order is being carefully packed',
    step: 1,
  },
  delivering: {
    label: 'Out for Delivery',
    icon: Truck,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    gradient: 'from-blue-400 to-cyan-500',
    description: 'Your package is on its way!',
    step: 2,
  },
  done: {
    label: 'Delivered',
    icon: CheckCircle,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    gradient: 'from-emerald-400 to-teal-500',
    description: 'Package delivered successfully!',
    step: 3,
  },
};

const Orders: React.FC = () => {
  const { orders, getOrderStatus } = useStore();

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={56} className="text-orange-300" />
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">No orders yet</h2>
          <p className="text-gray-400 mb-8">Start shopping to see your orders here</p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
          >
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">My Orders</h1>
          <p className="text-gray-400 mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
        </div>

        <div className="space-y-6">
          {orders.map((order, index) => {
            const currentStatus = getOrderStatus(order);
            const config = statusConfig[currentStatus];
            const StatusIcon = config.icon;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100"
              >
                {/* Order Header */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-sm font-bold text-gray-500">{order.id}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Placed {new Date(order.createdAt).toLocaleDateString('en-US', {
                          weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${config.bg} ${config.border}`}>
                      <StatusIcon size={15} className={config.color} />
                      <span className={`text-sm font-bold ${config.color}`}>{config.label}</span>
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="px-5 py-4 bg-gray-50">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 right-0 top-4 h-1 bg-gray-200 rounded-full z-0">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((config.step - 1) / 2) * 100}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full rounded-full bg-gradient-to-r ${config.gradient}`}
                      />
                    </div>
                    {Object.entries(statusConfig).map(([key, cfg]) => {
                      const isCompleted = cfg.step <= config.step;
                      const Icon = cfg.icon;
                      return (
                        <div key={key} className="relative z-10 flex flex-col items-center gap-2 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                            isCompleted
                              ? `bg-gradient-to-br ${cfg.gradient} border-transparent shadow-md`
                              : 'bg-white border-gray-200'
                          }`}>
                            <Icon size={14} className={isCompleted ? 'text-white' : 'text-gray-300'} />
                          </div>
                          <p className={`text-xs font-bold text-center leading-tight ${isCompleted ? 'text-gray-700' : 'text-gray-300'}`}>
                            {cfg.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 p-3 bg-white rounded-2xl flex items-center gap-2">
                    <Clock size={14} className={config.color} />
                    <p className={`text-sm font-semibold ${config.color}`}>{config.description}</p>
                    {currentStatus !== 'done' && (
                      <p className="text-xs text-gray-400 ml-auto">
                        {currentStatus === 'packaging' ? 'Est. delivery in ~2 days' : 'Est. delivery today'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="p-5">
                  <div className="space-y-3">
                    {order.items.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex gap-3 items-center">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-900 line-clamp-1">{item.product.name}</p>
                          <p className="text-xs text-gray-400">Qty: {item.quantity} × ${item.product.price}</p>
                        </div>
                        <span className="font-bold text-sm text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-xs text-gray-400 text-center">+{order.items.length - 3} more items</p>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <p>📍 {order.address}</p>
                      <p>💳 {order.paymentMethod}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Total</p>
                      <p className="font-black text-lg text-orange-500">${(order.total * 1.1).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Orders;
