import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Truck, ChevronRight, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const steps = ['Cart Review', 'Shipping', 'Payment', 'Confirm'];

const Checkout: React.FC = () => {
  const { cartItems, cartTotal, placeOrder, showNotification } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', zip: '', country: 'United States',
    cardName: '', cardNumber: '', expiry: '', cvv: '',
    paymentMethod: 'card',
  });
  const [orderId, setOrderId] = useState('');

  if (cartItems.length === 0 && step < 3) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">Add some items before checking out.</p>
          <button onClick={() => navigate('/catalog')} className="px-6 py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-black rounded-2xl">
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const handleNext = () => {
    if (step === 2) {
      const id = placeOrder({
        address: `${form.address}, ${form.city}, ${form.zip}, ${form.country}`,
        paymentMethod: form.paymentMethod === 'card' ? `**** **** **** ${form.cardNumber.slice(-4) || '0000'}` : form.paymentMethod,
        customerName: `${form.firstName} ${form.lastName}`,
        customerEmail: form.email,
      });
      setOrderId(id);
      showNotification('Order placed successfully! 🎉');
    }
    setStep(s => Math.min(s + 1, 3));
  };

  const field = (label: string, key: string, placeholder?: string, type = 'text', className = '') => (
    <div className={className}>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type={type}
        value={(form as Record<string, string>)[key]}
        onChange={e => update(key, e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-white text-sm focus:outline-none focus:border-orange-300 transition-colors"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${i <= step ? 'text-orange-500' : 'text-gray-300'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all ${
                  i < step ? 'bg-orange-400 border-orange-400 text-white'
                  : i === step ? 'border-orange-400 text-orange-500 bg-orange-50'
                  : 'border-gray-200 text-gray-300'
                }`}>
                  {i < step ? <CheckCircle size={14} /> : i + 1}
                </div>
                <span className={`text-xs font-bold hidden sm:block ${i <= step ? 'text-gray-800' : 'text-gray-400'}`}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 max-w-12 rounded-full transition-colors ${i < step ? 'bg-orange-400' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Area */}
          <div className="lg:col-span-2">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 shadow-sm"
            >
              {/* Step 0: Review */}
              {step === 0 && (
                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-2">
                    🛒 Cart Review
                  </h2>
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <div key={item.product.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-sm">{item.product.name}</p>
                          {item.selectedSize && <p className="text-xs text-gray-400">Size: {item.selectedSize}</p>}
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                            <span className="font-black text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Shipping */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-2">
                    <Truck size={20} className="text-orange-500" /> Shipping Details
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {field('First Name', 'firstName', 'John', 'text', 'col-span-1')}
                    {field('Last Name', 'lastName', 'Doe', 'text', 'col-span-1')}
                    {field('Email', 'email', 'john@example.com', 'email', 'col-span-2')}
                    {field('Phone', 'phone', '+1 xxx xxxx xxxx', 'tel', 'col-span-2')}
                    {field('Address', 'address', 'Jl. Example No. 1', 'text', 'col-span-2')}
                    {field('City', 'city', 'New York', 'text', 'col-span-1')}
                    {field('ZIP Code', 'zip', '10000', 'text', 'col-span-1')}
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Country</label>
                      <select value={form.country} onChange={e => update('country', e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-white text-sm focus:outline-none focus:border-orange-300">
                        <option>United States</option>
                        <option>Canada</option>
                        <option>British</option>
                        <option>Australia</option>
                        <option>Indonesia</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-2">
                    <CreditCard size={20} className="text-orange-500" /> Payment
                  </h2>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { value: 'card', label: '💳 Credit Card' },
                      { value: 'transfer', label: '🏦 Bank Transfer' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => update('paymentMethod', opt.value)}
                        className={`py-3 px-3 rounded-xl border-2 text-sm font-bold transition-all ${
                          form.paymentMethod === opt.value
                            ? 'border-orange-400 bg-orange-50 text-orange-600'
                            : 'border-gray-100 text-gray-600 hover:border-orange-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {form.paymentMethod === 'card' && (
                    <div className="space-y-4">
                      {field('Cardholder Name', 'cardName', 'John Doe', 'text')}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Card Number</label>
                        <input
                          type="text"
                          value={form.cardNumber}
                          onChange={e => update('cardNumber', e.target.value.replace(/\D/g, '').slice(0, 16))}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-white text-sm focus:outline-none focus:border-orange-300 font-mono tracking-widest"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {field('Expiry (MM/YY)', 'expiry', '12/27', 'text', '')}
                        {field('CVV', 'cvv', '•••', 'password', '')}
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
                        <Lock size={14} className="text-green-500" />
                        <p className="text-xs text-green-600 font-semibold">Your payment is secured with 256-bit SSL encryption</p>
                      </div>
                    </div>
                  )}

                  {form.paymentMethod === 'transfer' && (
                    <div className="p-6 bg-blue-50 rounded-2xl">
                      <p className="font-bold text-blue-700 mb-2">Bank Transfer Details</p>
                      <p className="text-sm text-blue-600">BCA: <span className="font-mono font-bold">1234-5678-9012</span></p>
                      <p className="text-sm text-blue-600">Account: <span className="font-bold">ZapMart Indonesia</span></p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Success */}
              {step === 3 && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-xl"
                  >
                    <CheckCircle size={48} className="text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">Order Placed! 🎉</h2>
                  <p className="text-gray-500 mb-2">Thank you for your purchase</p>
                  <p className="font-mono text-sm font-bold text-orange-500 bg-orange-50 px-4 py-2 rounded-xl inline-block mb-6">
                    {orderId}
                  </p>
                  <p className="text-sm text-gray-500 mb-8">We'll send a confirmation to <strong>{form.email}</strong></p>
                  <div className="flex gap-3 justify-center">
                    <button onClick={() => navigate('/orders')} className="px-6 py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-black rounded-2xl hover:shadow-lg transition-shadow">
                      Track My Order
                    </button>
                    <button onClick={() => navigate('/')} className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors">
                      Continue Shopping
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Navigation */}
              {step < 3 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => step === 0 ? navigate('/catalog') : setStep(s => s - 1)}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <ArrowLeft size={16} /> {step === 0 ? 'Back to Shop' : 'Previous'}
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {step === 2 ? 'Place Order' : 'Continue'} <ChevronRight size={18} strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Order Summary */}
          {step < 3 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-6 shadow-sm sticky top-24">
                <h3 className="font-black text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {cartItems.map(item => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700 flex-1 line-clamp-1">{item.product.name}</span>
                      <span className="text-sm font-bold text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-emerald-500 font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax (10%)</span>
                    <span className="font-semibold">${(cartTotal * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-2 flex justify-between">
                    <span className="font-black text-gray-900">Total</span>
                    <span className="font-black text-xl text-orange-500">${(cartTotal * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
