'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Clock, DollarSign } from 'lucide-react';
import { mockServices } from '@/lib/data';
import { Service } from '@/types';
import toast from 'react-hot-toast';
import ServiceModal from '@/components/admin/ServiceModal';
import ConfirmModal from '@/components/ConfirmModal';

export default function AdminServicesPage() {
  const [services, setServices] = useState(mockServices);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async (data: Partial<Service>) => {
    try {
      // TODO: Replace with actual API call
      // const newService = await api.admin.services.create(data);
      const newService: Service = {
        id: Date.now().toString(),
        ...data,
        name: data.name!,
        duration: data.duration || 30,
        price: data.price || 0,
        category: data.category || 'haircut',
      };
      setServices([...services, newService]);
      toast.success('Xizmat qo\'shildi');
    } catch (error) {
      toast.error('Xatolik yuz berdi');
      throw error;
    }
  };

  const handleEdit = async (data: Partial<Service>) => {
    if (!selectedService) return;

    try {
      // TODO: Replace with actual API call
      // await api.admin.services.update(selectedService.id, data);
      setServices(
        services.map((s) =>
          s.id === selectedService.id ? { ...s, ...data } : s
        )
      );
      toast.success('Xizmat yangilandi');
    } catch (error) {
      toast.error('Xatolik yuz berdi');
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!selectedService) return;

    try {
      // TODO: Replace with actual API call
      // await api.admin.services.delete(selectedService.id);
      setServices(services.filter((s) => s.id !== selectedService.id));
      toast.success('Xizmat o\'chirildi');
      setIsDeleteModalOpen(false);
      setSelectedService(null);
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    }
  };

  const openEditModal = (service: Service) => {
    setSelectedService(service);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (service: Service) => {
    setSelectedService(service);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Xizmatlar</h1>
          <p className="text-gray-600">Barcha xizmatlarni boshqarish</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Yangi xizmat
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <input
          type="text"
          placeholder="Xizmat qidirish..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-white"
        />
      </div>

      {/* Services List */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Xizmat nomi
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Kategoriya
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Narx
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Davomiyligi
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Harakatlar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredServices.map((service, index) => (
                <motion.tr
                  key={service.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{service.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                      {service.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-900 font-medium">
                      <DollarSign className="h-4 w-4 text-amber-500" />
                      {service.price.toLocaleString()} so'm
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-700">
                      <Clock className="h-4 w-4 text-gray-500" />
                      {service.duration} min
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(service)}
                        className="p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(service)}
                        className="p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-600">Hech narsa topilmadi</p>
        </div>
      )}

      {/* Modals */}
      <ServiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreate}
        mode="create"
      />

      <ServiceModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedService(null);
        }}
        onSave={handleEdit}
        service={selectedService}
        mode="edit"
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedService(null);
        }}
        onConfirm={handleDelete}
        title="Xizmatni o'chirish"
        message={`"${selectedService?.name}" xizmatini o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.`}
        confirmText="O'chirish"
        cancelText="Bekor qilish"
        variant="danger"
      />
    </div>
  );
}
