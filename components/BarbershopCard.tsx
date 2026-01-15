'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Scissors } from 'lucide-react';
import { Barbershop } from '@/types';

interface BarbershopCardProps {
  barbershop: Barbershop;
  index?: number;
}

export default function BarbershopCard({ barbershop, index = 0 }: BarbershopCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link href={`/barbershop/${barbershop.id}`}>
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          {/* Image */}
          <div className="relative h-56 overflow-hidden">
            <Image
              src={barbershop.image}
              alt={barbershop.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={barbershop.image.startsWith('http')}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute top-4 right-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                <Scissors className="h-4 w-4 text-white" />
                <span className="text-sm font-bold text-white">{barbershop.services.length} xizmat</span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{barbershop.name}</h3>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {barbershop.description}
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span>{barbershop.district}, {barbershop.city}</span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="h-4 w-4 text-amber-500" />
                <span>Bugun: {barbershop.workingHours.monday.open} - {barbershop.workingHours.monday.close}</span>
              </div>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:underline flex items-center gap-1"
              >
                Batafsil
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </motion.span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
