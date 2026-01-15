'use client';

import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { Barber } from '@/types';

interface BarberCardProps {
  barber: Barber;
  selected?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
}

export default function BarberCard({ barber, selected, onSelect, disabled }: BarberCardProps) {
  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={!disabled ? onSelect : undefined}
      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
        disabled
          ? 'opacity-50 cursor-not-allowed border-gray-200'
          : selected
          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg'
          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`h-16 w-16 rounded-full flex items-center justify-center shadow-md ${
          selected
            ? 'bg-gradient-to-r from-blue-500 to-purple-500'
            : 'bg-gradient-to-r from-gray-400 to-gray-500'
        }`}>
          <User className="h-8 w-8 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-bold text-gray-800 text-lg">{barber.name}</h4>
          </div>
          {barber.specialization && (
            <p className="text-sm text-gray-600 mb-1">{barber.specialization}</p>
          )}
          {barber.experience && (
            <p className="text-xs text-gray-500">{barber.experience} yil tajriba</p>
          )}
        </div>
        {selected && (
          <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-white" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
