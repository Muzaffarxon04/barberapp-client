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
      toast.success('Service added');
    } catch (error) {
      toast.error('An error occurred');
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
      toast.success('Service updated');
    } catch (error) {
      toast.error('An error occurred');
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!selectedService) return;

    try {
      // TODO: Replace with actual API call
      // await api.admin.services.delete(selectedService.id);
      setServices(services.filter((s) => s.id !== selectedService.id));
      toast.success('Service deleted');
      setIsDeleteModalOpen(false);
      setSelectedService(null);
    } catch (error) {
      toast.error('An error occurred');
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
          <h1 className="text-2xl font-medium text-gray-900 mb-1">Services</h1>
          <p className="text-sm text-gray-500">Manage all services</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          New Service
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 p-3">
        <input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder:text-gray-400 bg-white"
        />
      </div>

      {/* Services List */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Service Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Actions
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
                    <div className="text-gray-900 font-medium">
                      {service.price.toLocaleString()} UZS
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
                        className="p-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(service)}
                        className="p-2 border border-gray-300 text-red-600 hover:bg-red-50 transition-colors"
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
        <div className="text-center py-12 bg-white border border-gray-200">
          <p className="text-gray-600">Nothing found</p>
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
        title="Delete Service"
        message={`Are you sure you want to delete "${selectedService?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
