'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Plus, Edit, Trash2, MapPin, Phone } from 'lucide-react';
import { mockBarbershops } from '@/lib/data';
import { Barbershop } from '@/types';
import toast from 'react-hot-toast';
import BarbershopModal from '@/components/admin/BarbershopModal';
import ConfirmModal from '@/components/ConfirmModal';

export default function AdminBarbershopsPage() {
  const [barbershops, setBarbershops] = useState(mockBarbershops);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBarbershop, setSelectedBarbershop] = useState<Barbershop | null>(null);

  const filteredBarbershops = barbershops.filter((bs) =>
    bs.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bs.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async (data: Partial<Barbershop>) => {
    try {
      // TODO: Replace with actual API call
      // const newBarbershop = await api.admin.barbershops.create(data);
      const newBarbershop: Barbershop = {
        id: Date.now().toString(),
        ...data,
        name: data.name!,
        description: data.description!,
        address: data.address!,
        city: data.city!,
        district: data.district!,
        phone: data.phone!,
        image: data.image || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80',
        workingHours: {} as any,
        services: [],
        barbers: [],
      };
      setBarbershops([...barbershops, newBarbershop]);
      toast.success('Barbershop added');
    } catch (error) {
      toast.error('An error occurred');
      throw error;
    }
  };

  const handleEdit = async (data: Partial<Barbershop>) => {
    if (!selectedBarbershop) return;

    try {
      // TODO: Replace with actual API call
      // await api.admin.barbershops.update(selectedBarbershop.id, data);
      setBarbershops(
        barbershops.map((bs) =>
          bs.id === selectedBarbershop.id ? { ...bs, ...data } : bs
        )
      );
      toast.success('Barbershop yangilandi');
    } catch (error) {
      toast.error('An error occurred');
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!selectedBarbershop) return;

    try {
      // TODO: Replace with actual API call
      // await api.admin.barbershops.delete(selectedBarbershop.id);
      setBarbershops(barbershops.filter((bs) => bs.id !== selectedBarbershop.id));
      toast.success('Barbershop deleted');
      setIsDeleteModalOpen(false);
      setSelectedBarbershop(null);
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const openEditModal = (barbershop: Barbershop) => {
    setSelectedBarbershop(barbershop);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (barbershop: Barbershop) => {
    setSelectedBarbershop(barbershop);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Barbershops</h1>
          <p className="text-gray-600">Manage all barbershops</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          New Barbershop
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <input
          type="text"
          placeholder="Search barbershops..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-white"
        />
      </div>

      {/* Barbershops List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBarbershops.map((barbershop, index) => (
          <motion.div
            key={barbershop.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <div className="relative h-48">
              <Image
                src={barbershop.image}
                alt={barbershop.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized={barbershop.image.startsWith('http')}
              />
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{barbershop.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{barbershop.district}, {barbershop.city}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{barbershop.phone}</span>
              </div>

              <div className="text-sm text-gray-600">
                <span className="font-medium">{barbershop.services.length} services</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => openEditModal(barbershop)}
                  className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(barbershop)}
                  className="px-4 py-2 bg-red-50 text-red-700 rounded-lg font-medium hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredBarbershops.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-600">Nothing found</p>
        </div>
      )}

      {/* Modals */}
      <BarbershopModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreate}
        mode="create"
      />

      <BarbershopModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBarbershop(null);
        }}
        onSave={handleEdit}
        barbershop={selectedBarbershop}
        mode="edit"
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedBarbershop(null);
        }}
        onConfirm={handleDelete}
        title="Delete Barbershop"
        message={`Are you sure you want to delete "${selectedBarbershop?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
