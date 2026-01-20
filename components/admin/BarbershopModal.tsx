'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Barbershop } from '@/types';
import { cities, districts } from '@/lib/data';

interface BarbershopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Barbershop>) => Promise<void>;
  barbershop?: Barbershop | null;
  mode: 'create' | 'edit';
}

export default function BarbershopModal({
  isOpen,
  onClose,
  onSave,
  barbershop,
  mode,
}: BarbershopModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: 'Tashkent',
    district: '',
    phone: '',
    email: '',
    image: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && barbershop) {
      setFormData({
        name: barbershop.name || '',
        description: barbershop.description || '',
        address: barbershop.address || '',
        city: barbershop.city || 'Tashkent',
        district: barbershop.district || '',
        phone: barbershop.phone || '',
        email: barbershop.email || '',
        image: barbershop.image || '',
      });
      setImagePreview(barbershop.image || null);
      setImageFile(null);
    } else {
      setFormData({
        name: '',
        description: '',
        address: '',
        city: 'Tashkent',
        district: '',
        phone: '',
        email: '',
        image: '',
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [mode, barbershop, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file');
      }
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, image: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // If new image file is selected, convert to base64 or upload
      if (imageFile) {
        // For now, we'll use base64. In production, upload to server and get URL
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onloadend = async () => {
          const base64Image = reader.result as string;
          await onSave({ ...formData, image: base64Image });
          onClose();
        };
        return;
      }
      
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-200 overflow-hidden"
          >
            <div className="flex flex-col h-full max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {mode === 'create' ? 'Add New Barbershop' : 'Edit Barbershop'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Barbershop Image
                    </label>
                    <div className="space-y-3">
                      {imagePreview && (
                        <div className="relative w-full h-48 border border-gray-300 rounded-lg overflow-hidden group">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            unoptimized={imagePreview.startsWith('data:')}
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                            title="Remove image"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                 {!imagePreview &&
                       <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                       <div className="flex flex-col items-center justify-center pt-5 pb-6">
                         {imagePreview ? (
                           <>
                             <ImageIcon className="w-8 h-8 mb-2 text-gray-500" />
                             <p className="text-sm text-gray-500">Click to change image</p>
                           </>
                         ) : (
                           <>
                             <Upload className="w-8 h-8 mb-2 text-gray-500" />
                             <p className="text-sm text-gray-500">
                               <span className="font-medium">Click to upload</span> or drag and drop
                             </p>
                             <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                           </>
                         )}
                       </div>
                       <input
                         type="file"
                         accept="image/*"
                         onChange={handleImageChange}
                         className="hidden"
                       />
                     </label>
                 }
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Barbershop Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 text-gray-700"
                      placeholder="Barbershop name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Description *
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 text-gray-700 resize-none"
                      placeholder="Barbershop description"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        City *
                      </label>
                      <select
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 text-gray-700"
                      >
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        District *
                      </label>
                      <select
                        required
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 text-gray-700"
                      >
                        <option value="">Select</option>
                        {districts.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 text-gray-700"
                      placeholder="Full address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 text-gray-700"
                        placeholder="+998901234567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 text-gray-700"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
