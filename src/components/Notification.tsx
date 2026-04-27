import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Notification: React.FC = () => {
  const { notification } = useStore();

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -60, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -60, x: '-50%' }}
          className="fixed top-20 left-1/2 z-50 flex items-center gap-3 bg-white px-5 py-3.5 rounded-2xl shadow-2xl border border-gray-100 max-w-sm w-[90vw]"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
            <CheckCircle size={16} className="text-white" />
          </div>
          <p className="text-sm font-semibold text-gray-800">{notification}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
