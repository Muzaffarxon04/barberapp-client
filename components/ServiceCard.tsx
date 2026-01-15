'use client';

import { motion } from 'framer-motion';
import { Clock, DollarSign } from 'lucide-react';
import { Service } from '@/types';

interface ServiceCardProps {
  service: Service;
  selected?: boolean;
  onSelect?: () => void;
}

export default function ServiceCard({ service, selected, onSelect }: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${
        selected
          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg'
          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-bold text-gray-800 text-lg">{service.nameUz || service.name}</h4>
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {service.price.toLocaleString()} so'm
        </span>
      </div>
      
      {service.description && (
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{service.description}</p>
      )}

      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
          <Clock className="h-4 w-4 text-blue-500" />
          <span className="font-medium">{service.duration} min</span>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
          <DollarSign className="h-4 w-4 text-amber-500" />
          <span className="font-medium capitalize">{service.category}</span>
        </div>
      </div>
    </motion.div>
  );
}
