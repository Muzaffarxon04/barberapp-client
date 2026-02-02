'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Plus, Edit, Trash2, MapPin, Phone } from 'lucide-react';
import { Barbershop, WorkingHours } from '@/types';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { api, handleApiError, CreateBarbershopDto, UpdateBarbershopDto, BarbershopResponse } from '@/lib/api/client';
import { AxiosError } from 'axios';
import BarbershopModal from '@/components/admin/BarbershopModal';
import ConfirmModal from '@/components/ConfirmModal';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export default function AdminBarbershopsPage() {
  const router = useRouter();
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBarbershop, setSelectedBarbershop] = useState<Barbershop | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBarbershops();
  }, []);

  const fetchBarbershops = async () => {
    try {
      setIsLoading(true);
      const response = await api.admin.barbershops.getAll();
      const mappedBarbershops: Barbershop[] = response.items.map((item: BarbershopResponse) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        address: item.address,
        city: item.city,
        district: item.district,
        phone: item.phone,
        email: item.email || null,
        image: item.image,
        images: item.images || [],
        workingHours: item.workingHours as WorkingHours,
        services: [],
        barbers: [],
        amenities: item.amenities || [],
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
      setBarbershops(mappedBarbershops);
    } catch (error: unknown) {
      const apiError = handleApiError(error as AxiosError);
      toast.error(apiError.message || 'Failed to load barbershops');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBarbershops = barbershops.filter((bs) =>
    bs.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bs.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async (data: Partial<Barbershop>) => {
    try {
      // Map Barbershop to CreateBarbershopDto
      const createData: CreateBarbershopDto = {
        name: data.name!,
        description: data.description!,
        address: data.address!,
        city: data.city!,
        district: data.district!,
        phone: data.phone!,
        email: data.email || '',
        image: data.image || '',
        images: data.images,
        workingHours: data.workingHours as WorkingHours,
        amenities: data.amenities,
      };
      await api.barbershops.create(createData);
      toast.success('Barbershop added');
      await fetchBarbershops();
    } catch (error: unknown) {
      const apiError = handleApiError(error as AxiosError);
      toast.error(apiError.message || 'Failed to create barbershop');
      throw error;
    }
  };

  const handleEdit = async (data: Partial<Barbershop>) => {
    if (!selectedBarbershop) return;

    try {
      // Map Barbershop to UpdateBarbershopDto
      const updateData: UpdateBarbershopDto = {
        name: data.name,
        description: data.description,
        address: data.address,
        city: data.city,
        district: data.district,
        phone: data.phone,
        email: data.email || '',
        image: data.image,
        images: data.images,
        workingHours: data.workingHours,
        amenities: data.amenities,
      };
      await api.barbershops.update(selectedBarbershop.id, updateData);
      toast.success('Barbershop updated');
      await fetchBarbershops();
    } catch (error: unknown) {
      const apiError = handleApiError(error as AxiosError);
      toast.error(apiError.message || 'Failed to update barbershop');
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!selectedBarbershop) return;

    try {
      await api.barbershops.delete(selectedBarbershop.id);
      toast.success('Barbershop deleted');
      setIsDeleteModalOpen(false);
      setSelectedBarbershop(null);
      await fetchBarbershops();
    } catch (error: unknown) {
      const apiError = handleApiError(error as AxiosError);
      toast.error(apiError.message || 'Failed to delete barbershop');
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

  const handleCardClick = (barbershop: Barbershop, e: React.MouseEvent) => {
    // Prevent navigation if clicking on buttons
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    router.push(`/admin/barbershops/${barbershop.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 mb-1">Barbershops</h1>
          <p className="text-sm text-gray-500">Manage all barbershops</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          New Barbershop
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 p-3">
        <input
          type="text"
          placeholder="Search barbershops..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder:text-gray-400 bg-white"
        />
      </div>

      {/* Barbershops List */}
      {isLoading ? (
        <div className="text-center py-12 bg-white border border-gray-200">
          <p className="text-gray-600">Loading barbershops...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBarbershops.map((barbershop, index) => (
            <motion.div
              key={barbershop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={(e) => handleCardClick(barbershop, e)}
              className="bg-white border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
            >


              {/* Image */}
              <div className="relative h-48">
                <Image
                  src={BASE_URL?.slice(0, -4) + barbershop.image}
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

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => openEditModal(barbershop)}
                    className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(barbershop)}
                    className="px-3 py-2 border border-gray-300 text-red-600 hover:bg-red-50 transition-colors text-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && filteredBarbershops.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200">
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
