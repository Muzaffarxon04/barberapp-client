'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Plus, Trash2, User, MapPin, Phone, Scissors, ChevronDown, Search, Pencil, X, Check, Mail, Clock } from 'lucide-react';
import { Barbershop, Barber, Service, WorkingHours } from '@/types';
import { api, handleApiError, ServiceResponse } from '@/lib/api/client';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export default function AdminBarbershopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const barbershopId = params.id as string;

  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBarber, setNewBarber] = useState({
    name: '',
    specialization: '',
    experience: '',
    selectedServices: [] as string[],
  });
  const [editingBarberId, setEditingBarberId] = useState<string | null>(null);
  const [editingBarber, setEditingBarber] = useState({
    name: '',
    specialization: '',
    experience: '',
    selectedServices: [] as string[],
  });
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isEditServicesOpen, setIsEditServicesOpen] = useState(false);
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');
  const servicesRef = useRef<HTMLDivElement>(null);
  const editServicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadBarbershopData = async () => {
      try {
        setLoading(true);
        const [barbershopData, servicesData] = await Promise.all([
          api.admin.barbershops.getById(barbershopId),
          api.services.getByBarbershop(barbershopId)
        ]);

        if (barbershopData) {
          const mappedBarbers: Barber[] = (barbershopData.barbers || []).map((b: any) => ({
            id: b.id,
            name: b.name,
            specialization: b.specialization || undefined,
            experience: b.experience || undefined,
            rating: b.rating,
            avatar: b.avatar || undefined,
            services: b.services || [] // Ensure services exists
          }));

          const mappedServices: Service[] = (servicesData as any[]).map(s => ({
            id: s.id,
            name: s.name,
            description: s.description || '',
            duration: s.duration,
            price: s.price,
            category: s.category
          }));

          setBarbershop({
            ...barbershopData,
            workingHours: barbershopData.workingHours as WorkingHours,
            services: mappedServices,
            barbers: mappedBarbers
          });
          setServices(mappedServices);
        } else {
          toast.error('Barbershop not found');
          router.push('/admin/barbershops');
        }
      } catch (error: unknown) {
        const apiError = handleApiError(error as AxiosError);
        toast.error(apiError.message || 'Failed to load barbershop details');
        router.push('/admin/barbershops');
      } finally {
        setLoading(false);
      }
    };
    if (barbershopId) {
      loadBarbershopData();
    }
  }, [barbershopId, router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
      if (editServicesRef.current && !editServicesRef.current.contains(event.target as Node)) {
        setIsEditServicesOpen(false);
      }
    };

    if (isServicesOpen || isEditServicesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isServicesOpen, isEditServicesOpen]);

  const handleAddBarber = async () => {
    if (!newBarber.name.trim() || !barbershop) return;

    try {
      setLoading(true);
      const barberData = {
        name: newBarber.name,
        specialization: newBarber.specialization || undefined,
        experience: newBarber.experience ? parseInt(newBarber.experience) : undefined,
        services: newBarber.selectedServices,
      };

      await api.barbers.create(barbershopId, barberData);

      // Reload data
      const updatedBarbershop = await api.admin.barbershops.getById(barbershopId);
      const mappedBarbers: Barber[] = (updatedBarbershop.barbers || []).map((b: any) => ({
        id: b.id,
        name: b.name,
        specialization: b.specialization || undefined,
        experience: b.experience || undefined,
        rating: b.rating,
        avatar: b.avatar || undefined,
        services: b.services || []
      }));

      setBarbershop({
        ...updatedBarbershop,
        workingHours: updatedBarbershop.workingHours as WorkingHours,
        services: services,
        barbers: mappedBarbers
      } as Barbershop);

      setNewBarber({ name: '', specialization: '', experience: '', selectedServices: [] });
      toast.success('Barber added');
    } catch (error: unknown) {
      const apiError = handleApiError(error as AxiosError);
      toast.error(apiError.message || 'Failed to add barber');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBarber = async (barberId: string) => {
    if (!barbershop) return;

    try {
      setLoading(true);
      await api.barbers.delete(barbershopId, barberId);

      // Update local state
      setBarbershop({
        ...barbershop,
        barbers: barbershop.barbers.filter((b) => b.id !== barberId),
      });

      toast.success('Barber removed');
    } catch (error: unknown) {
      const apiError = handleApiError(error as AxiosError);
      toast.error(apiError.message || 'Failed to remove barber');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (barber: Barber) => {
    setEditingBarberId(barber.id);
    setEditingBarber({
      name: barber.name,
      specialization: barber.specialization || '',
      experience: barber.experience?.toString() || '',
      selectedServices: [...barber.services],
    });
  };

  const cancelEditing = () => {
    setEditingBarberId(null);
    setEditingBarber({ name: '', specialization: '', experience: '', selectedServices: [] });
  };

  const handleUpdateBarber = async () => {
    if (!editingBarberId || !editingBarber.name.trim() || !barbershop) return;

    try {
      setLoading(true);
      const updateData = {
        name: editingBarber.name,
        specialization: editingBarber.specialization || undefined,
        experience: editingBarber.experience ? parseInt(editingBarber.experience) : undefined,
        services: editingBarber.selectedServices,
      };

      await api.barbers.update(barbershopId, editingBarberId, updateData);

      // Reload data
      const updatedBarbershop = await api.admin.barbershops.getById(barbershopId);
      const mappedBarbers: Barber[] = (updatedBarbershop.barbers || []).map((b: any) => ({
        id: b.id,
        name: b.name,
        specialization: b.specialization || undefined,
        experience: b.experience || undefined,
        rating: b.rating,
        avatar: b.avatar || undefined,
        services: b.services || []
      }));

      setBarbershop({
        ...updatedBarbershop,
        workingHours: updatedBarbershop.workingHours as WorkingHours,
        services: services,
        barbers: mappedBarbers
      });

      setEditingBarberId(null);
      toast.success('Barber updated');
    } catch (error: unknown) {
      const apiError = handleApiError(error as AxiosError);
      toast.error(apiError.message || 'Failed to update barber');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !barbershop) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!barbershop) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/barbershops')}
          className="p-2 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-medium text-gray-900 mb-1">{barbershop.name}</h1>
          <p className="text-sm text-gray-500">Manage barbers</p>
        </div>
      </div>

      {/* Barbershop Info */}
      <div className="bg-white border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative h-64">
            <Image
              src={BASE_URL?.slice(0, -4) + barbershop.image}
              alt={barbershop.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized={barbershop.image.startsWith('http') || barbershop.image.startsWith('/')}
            />
          </div>
          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Information</h2>
              <p className="text-sm text-gray-600 mb-4">{barbershop.description}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{barbershop.address}, {barbershop.district}, {barbershop.city}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{barbershop.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              <span>{barbershop.email || 'No email provided'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>
                {barbershop.workingHours?.closed
                  ? 'Closed'
                  : barbershop.workingHours
                    ? `${barbershop.workingHours.open} - ${barbershop.workingHours.close}`
                    : 'Not set'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Scissors className="h-4 w-4" />
              <span>{barbershop.services.length} services</span>
            </div>

            {barbershop.amenities && barbershop.amenities.length > 0 && (
              <div className="pt-2">
                <div className="text-xs font-medium text-gray-400 uppercase mb-2">Amenities</div>
                <div className="flex flex-wrap gap-2">
                  {barbershop.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-2 py-1 bg-gray-50 border border-gray-100 text-xs text-gray-600"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 uppercase">Created: {new Date(barbershop.createdAt).toLocaleString()}</span>
             
            </div>
          </div>
        </div>
      </div>

      {/* Barbers Section */}
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Barbers</h2>
        </div>

        {/* Add Barber Form */}
        <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              value={newBarber.name}
              onChange={(e) => setNewBarber({ ...newBarber, name: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 text-gray-700 text-sm"
              placeholder="Barber name *"
            />
            <input
              type="text"
              value={newBarber.specialization}
              onChange={(e) => setNewBarber({ ...newBarber, specialization: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 text-gray-700 text-sm"
              placeholder="Specialization"
            />
            <input
              type="number"
              value={newBarber.experience}
              onChange={(e) => setNewBarber({ ...newBarber, experience: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 text-gray-700 text-sm"
              placeholder="Experience (years)"
            />
          </div>

          {/* Services Selection */}
          {services.length > 0 && (
            <div ref={servicesRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Services
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsServicesOpen(!isServicesOpen);
                  if (!isServicesOpen) {
                    setServiceSearchQuery('');
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 text-gray-700 text-sm flex items-center justify-between bg-white"
              >
                <span className="truncate text-left">
                  {newBarber.selectedServices.length === 0
                    ? 'Select services...'
                    : newBarber.selectedServices
                      .map((serviceId) => {
                        const service = services.find((s) => s.id === serviceId);
                        return service?.name || '';
                      })
                      .filter(Boolean)
                      .join(', ')}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform shrink-0 ml-2 ${isServicesOpen ? 'rotate-180' : ''
                    }`}
                />
              </button>
              {isServicesOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden flex flex-col">
                  {/* Search Input */}
                  <div className="p-2 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={serviceSearchQuery}
                        onChange={(e) => setServiceSearchQuery(e.target.value)}
                        placeholder="Search services..."
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 text-gray-700 text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>

                  {/* Services List */}
                  <div className="overflow-y-auto">
                    {services
                      .filter((service) =>
                        service.name.toLowerCase().includes(serviceSearchQuery.toLowerCase())
                      )
                      .map((service) => (
                        <label
                          key={service.id}
                          className="flex items-center gap-2 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            checked={newBarber.selectedServices.includes(service.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewBarber({
                                  ...newBarber,
                                  selectedServices: [...newBarber.selectedServices, service.id],
                                });
                              } else {
                                setNewBarber({
                                  ...newBarber,
                                  selectedServices: newBarber.selectedServices.filter(
                                    (id) => id !== service.id
                                  ),
                                });
                              }
                            }}
                            className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                          />
                          <span className="text-sm text-gray-700 flex-1">
                            {service.name} - {service.price.toLocaleString()} UZS ({service.duration} min)
                          </span>
                        </label>
                      ))}
                    {services.filter((service) =>
                      service.name.toLowerCase().includes(serviceSearchQuery.toLowerCase())
                    ).length === 0 && (
                        <div className="p-4 text-center text-sm text-gray-500">
                          No services found
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleAddBarber}
            disabled={!newBarber.name.trim()}
            className="w-full md:w-auto px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Barber
          </button>
        </div>

        {/* Barbers List */}
        {barbershop.barbers.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No barbers yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {barbershop.barbers.map((barber) => (
              <div
                key={barber.id}
                className={`p-4 border transition-colors ${editingBarberId === barber.id ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
              >
                {editingBarberId === barber.id ? (
                  // Edit Form
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-900 uppercase">Editing Barber</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleUpdateBarber}
                          className="p-1.5 text-green-600 hover:bg-green-50 transition-colors rounded-lg"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="p-1.5 text-gray-400 hover:bg-gray-100 transition-colors rounded-lg"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editingBarber.name}
                        onChange={(e) => setEditingBarber({ ...editingBarber, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 text-gray-700 text-sm"
                        placeholder="Name *"
                      />
                      <input
                        type="text"
                        value={editingBarber.specialization}
                        onChange={(e) => setEditingBarber({ ...editingBarber, specialization: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 text-gray-700 text-sm"
                        placeholder="Specialization"
                      />
                      <input
                        type="number"
                        value={editingBarber.experience}
                        onChange={(e) => setEditingBarber({ ...editingBarber, experience: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 text-gray-700 text-sm"
                        placeholder="Experience (years)"
                      />

                      {/* Edit Services Selection */}
                      <div ref={editServicesRef} className="relative">
                        <button
                          type="button"
                          onClick={() => setIsEditServicesOpen(!isEditServicesOpen)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 text-gray-700 text-sm flex items-center justify-between bg-white"
                        >
                          <span className="truncate text-left">
                            {editingBarber.selectedServices.length === 0
                              ? 'Select services...'
                              : editingBarber.selectedServices
                                .map((serviceId) => {
                                  const service = services.find((s) => s.id === serviceId);
                                  return service?.name || '';
                                })
                                .filter(Boolean)
                                .join(', ')}
                          </span>
                          <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isEditServicesOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isEditServicesOpen && (
                          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {services.map((service) => (
                              <label
                                key={service.id}
                                className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer text-xs"
                              >
                                <input
                                  type="checkbox"
                                  checked={editingBarber.selectedServices.includes(service.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setEditingBarber({
                                        ...editingBarber,
                                        selectedServices: [...editingBarber.selectedServices, service.id],
                                      });
                                    } else {
                                      setEditingBarber({
                                        ...editingBarber,
                                        selectedServices: editingBarber.selectedServices.filter(
                                          (id) => id !== service.id
                                        ),
                                      });
                                    }
                                  }}
                                  className="w-3.5 h-3.5 text-gray-900 border-gray-300 rounded"
                                />
                                <span className="text-gray-700">
                                  {service.name}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Static View
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">{barber.name}</div>
                        {barber.specialization && (
                          <div className="text-xs text-gray-500">{barber.specialization}</div>
                        )}
                        {barber.experience && (
                          <div className="text-xs text-gray-500">{barber.experience} years experience</div>
                        )}
                        {barber.services.length > 0 && (
                          <div className="mt-2">
                            <div className="text-xs text-gray-500 mb-1">Services:</div>
                            <div className="flex flex-wrap gap-1">
                              {barber.services.map((serviceId) => {
                                const service = barbershop.services.find((s) => s.id === serviceId);
                                return service ? (
                                  <span
                                    key={serviceId}
                                    className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700"
                                  >
                                    {service.name}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => startEditing(barber)}
                        className="p-2 text-gray-600 hover:bg-gray-100 transition-colors rounded-lg"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveBarber(barber.id)}
                        className="p-2 text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
