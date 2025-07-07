import React from 'react';
import type { HojaTrabajo } from '../types';

interface ConfirmDeleteHojaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  hojaTrabajo?: HojaTrabajo;
  isLoading?: boolean;
}

export const ConfirmDeleteHojaModal: React.FC<ConfirmDeleteHojaModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  hojaTrabajo,
  isLoading = false
}) => {
  if (!isOpen || !hojaTrabajo) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="modal-container fixed inset-0 z-[9999] flex items-center justify-center p-4 modal-overlay" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full modal-content">
        <div className="p-6">
          <div className="flex items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Eliminar Hoja de Trabajo
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  ¿Estás seguro de que quieres eliminar la hoja de trabajo del cliente "{hojaTrabajo.cliente}"?
                </p>
                
                <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <div className="text-sm">
                    <p><strong>Cliente:</strong> {hojaTrabajo.cliente}</p>
                    <p><strong>Vehículo:</strong> {hojaTrabajo.vehiculo}</p>
                    <p><strong>Placa:</strong> {hojaTrabajo.placa}</p>
                    <p><strong>Estado:</strong> 
                      <span className={`ml-1 px-2 py-1 text-xs font-semibold rounded-full ${
                        hojaTrabajo.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        hojaTrabajo.estado === 'en_proceso' ? 'bg-blue-100 text-blue-800' :
                        hojaTrabajo.estado === 'completado' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {hojaTrabajo.estado.replace('_', ' ')}
                      </span>
                    </p>
                    <p><strong>Total:</strong> {formatCurrency(hojaTrabajo.total)}</p>
                    {hojaTrabajo.detalles && hojaTrabajo.detalles.length > 0 && (
                      <p><strong>Servicios:</strong> {hojaTrabajo.detalles.length} servicio(s)</p>
                    )}
                  </div>
                </div>

                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        ¡Advertencia!
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>
                          Esta acción no se puede deshacer. Se eliminará permanentemente la hoja de trabajo y todos sus servicios asociados.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed modal-button"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed modal-button"
            >
              {isLoading ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
