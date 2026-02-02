'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Clock } from 'lucide-react';
import { api, handleApiError, ServiceResponse, CreateServiceDto } from '@/lib/api/client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import ServiceModal from '@/components/admin/ServiceModal';
import ConfirmModal from '@/components/ConfirmModal';
import Image from 'next/image';

// Type adaptation until full refactor
interface Service extends ServiceResponse {
  // Add any missing frontend-specific props here if needed
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      if (searchQuery) {
        params.search = searchQuery;
      }
      const response = await api.admin.services.getAll(params);
      setServices(response.items);
    } catch (error: unknown) {
      const apiError = handleApiError(error as AxiosError);
      toast.error(apiError.message || 'Failed to load services');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchServices();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchServices]);

  const handleCreate = async (data: any) => {
    try {
      // Map form data to CreateServiceDto
      const createData: CreateServiceDto = {
        name: data.name,
        category: data.category,
        price: Number(data.price),
        duration: Number(data.duration),
        description: data.description,
        imageUrl: data.imageUrl,
      };

      await api.admin.services.create(createData);
      toast.success('Service added');
      fetchServices();
      setIsCreateModalOpen(false);
    } catch (error: unknown) {
      const apiError = handleApiError(error as AxiosError);
      toast.error(apiError.message || 'Failed to create service');
      throw error;
    }
  };

  const handleEdit = async (data: any) => {
    if (!selectedService) return;

    try {
      await api.admin.services.update(selectedService.id, {
        name: data.name,
        category: data.category,
        price: Number(data.price),
        duration: Number(data.duration),
        description: data.description,
        imageUrl: data.imageUrl,
      });
      toast.success('Service updated');
      fetchServices();
      setIsEditModalOpen(false);
      setSelectedService(null);
    } catch (error: unknown) {
      const apiError = handleApiError(error as AxiosError);
      toast.error(apiError.message || 'Failed to update service');
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!selectedService) return;

    try {
      await api.admin.services.delete(selectedService.id);
      toast.success('Service deleted');
      setIsDeleteModalOpen(false);
      setSelectedService(null);
      fetchServices();
    } catch (error: unknown) {
      const apiError = handleApiError(error as AxiosError);
      toast.error(apiError.message || 'Failed to delete service');
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
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading services...</p>
          </div>
        ) : (
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
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {services.map((service, index) => (
                  <motion.tr
                    key={service.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{service.name}</div>
                      {service.category && (
                        <div className="text-xs text-gray-500 capitalize mt-0.5">
                          {service.category.replace('_', ' ')}
                        </div>
                      )}
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
                      <div className="text-sm text-gray-600 max-w-xs truncate" title={service.description || ''}>
                        {service.description || '-'}
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
        )}
      </div>

      {!isLoading && services.length === 0 && (
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
        service={selectedService as any} // Cast for now until types align perfectly
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
