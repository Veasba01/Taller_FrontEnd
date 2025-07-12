import React, { useState, useEffect } from 'react';
import type { Gasto, CreateGastoDto, UpdateGastoDto } from '../types';

interface GastoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (gasto: CreateGastoDto | UpdateGastoDto) => Promise<void>;
  gasto?: Gasto;
  isLoading?: boolean;
}

export const GastoModal: React.FC<GastoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  gasto,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<CreateGastoDto>({
    monto: 0,
    comentario: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (gasto) {
      setFormData({
        monto: gasto.monto,
        comentario: gasto.comentario || ''
      });
    } else {
      setFormData({
        monto: 0,
        comentario: ''
      });
    }
    setErrors({});
  }, [gasto, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.monto || formData.monto <= 0) {
      newErrors.monto = 'El monto debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const dataToSubmit = {
        ...formData,
        monto: Number(formData.monto)
      };
      await onSubmit(dataToSubmit);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'monto' ? Number(value) : value
    }));

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
      {/* Overlay */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            {gasto ? 'Editar Gasto' : 'Nuevo Gasto'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Monto */}
          <div>
            <label htmlFor="monto" className="block text-sm font-medium text-gray-700 mb-2">
              Monto *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₡</span>
              </div>
              <input
                type="number"
                id="monto"
                name="monto"
                value={formData.monto}
                onChange={handleInputChange}
                className={`block w-full pl-8 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.monto ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            {errors.monto && (
              <p className="mt-1 text-sm text-red-600">{errors.monto}</p>
            )}
            {formData.monto > 0 && (
              <p className="mt-1 text-sm text-gray-500">
                {formatCurrency(formData.monto)}
              </p>
            )}
          </div>

          {/* Comentario */}
          <div>
            <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 mb-2">
              Comentario
            </label>
            <textarea
              id="comentario"
              name="comentario"
              value={formData.comentario}
              onChange={handleInputChange}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descripción del gasto..."
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </div>
              ) : (
                gasto ? 'Actualizar' : 'Crear'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
