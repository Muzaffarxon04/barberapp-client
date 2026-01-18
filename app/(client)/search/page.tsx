'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { mockBarbershops } from '@/lib/data';
import BarbershopCard from '@/components/BarbershopCard';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBarbershops = mockBarbershops.filter((bs) => {
    if (!searchQuery) return true;
    return (
      bs.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bs.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bs.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-6 text-gray-800">Search Barbershops</h1>
          <div className="mb-4">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search barbershop name, address or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600 font-medium mb-4">
            {filteredBarbershops.length} results found
          </div>
        </motion.div>

        {/* Results */}
        {filteredBarbershops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBarbershops.map((barbershop, index) => (
              <BarbershopCard key={barbershop.id} barbershop={barbershop} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 text-lg">
              Nothing found. Try different search terms.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
