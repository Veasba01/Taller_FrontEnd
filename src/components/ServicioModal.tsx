import React, { useState, useEffect } from 'react';
import type { Servicio, CreateServicioDto } from '../types';

interface ServicioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (servicio: CreateServicioDto) => void;
  servicio?: Servicio;
  isLoading?: boolean;
}

export const ServicioModal: React.FC<ServicioModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  servicio,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<CreateServicioDto>({
    nombre: '',
    descripcion: '',
    precio: 0,
    activo: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (servicio) {
      setFormData({
        nombre: servicio.nombre,
        descripcion: servicio.descripcion || '',
        precio: servicio.precio,
        activo: servicio.activo
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        precio: 0,
        activo: true
      });
    }
    setErrors({});
  }, [servicio, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (formData.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      activo: e.target.checked
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-container fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
      {/* Overlay */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto modal-content">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {servicio ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 modal-button"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 modal-form">
            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.nombre ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: frenos, cambio_aceite, etc."
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descripción detallada del servicio"
              />
            </div>

            {/* Precio */}
            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
                Precio *
              </label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.precio ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.precio && (
                <p className="mt-1 text-sm text-red-600">{errors.precio}</p>
              )}
            </div>

            {/* Activo */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="activo"
                name="activo"
                checked={formData.activo}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
                Servicio activo
              </label>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed modal-button"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed modal-button"
              >
                {isLoading ? 'Guardando...' : (servicio ? 'Actualizar' : 'Crear')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
