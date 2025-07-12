import React, { useState, useEffect } from 'react';
import { DashboardApi } from '../services/api';
import type { IngresosPorMetodoPagoResponse } from '../types';

export const MetodosPagoStats: React.FC = () => {
  const [estadisticas, setEstadisticas] = useState<IngresosPorMetodoPagoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función helper para crear una fecha desde un string sin problemas de zona horaria
  function createDateFromString(dateString: string): Date {
    const [year, month, day] = dateString.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  // Función para formatear fecha
  const formatDate = (date: Date | string) => {
    if (typeof date === 'string') {
      // Si es una cadena, la parseamos correctamente evitando problemas de zona horaria
      const dateObj = createDateFromString(date);
      return dateObj.toLocaleDateString('es-CR');
    }
    return new Date(date).toLocaleDateString('es-CR');
  };

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      setError(null);
      // Siempre cargar datos del día de hoy (sin pasar fecha)
      const data = await DashboardApi.obtenerIngresosPorMetodoPago();
      setEstadisticas(data);
    } catch (err) {
      setError('Error al cargar estadísticas de métodos de pago');
      console.error(err);
    } finally {
      setLoading(false);
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

  const getMetodoPagoIcon = (metodo: string) => {
    switch (metodo) {
      case 'sinpe':
        return '📱';
      case 'tarjeta':
        return '💳';
      case 'efectivo':
        return '💵';
      case 'pendiente':
        return '⏳';
      default:
        return '❓';
    }
  };

  const getMetodoPagoColor = (metodo: string) => {
    switch (metodo) {
      case 'sinpe':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'tarjeta':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'efectivo':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pendiente':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={() => cargarEstadisticas()}
            className="mt-2 text-blue-600 hover:text-blue-800 underline"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">
          Ingresos por Método de Pago
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Hoy</span>
          <button
            onClick={cargarEstadisticas}
            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
          >
            Actualizar
          </button>
        </div>
      </div>

      {estadisticas && (
        <>
          <div className="mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Fecha: {formatDate(estadisticas.fecha)}
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(estadisticas.totalIngresos)}
              </p>
              <p className="text-sm text-gray-600">Total de ingresos</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {estadisticas.metodos.map((metodo) => (
              <div
                key={metodo.metodo}
                className={`p-4 rounded-lg border-2 ${getMetodoPagoColor(metodo.metodo)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getMetodoPagoIcon(metodo.metodo)}</span>
                    <span className="font-semibold capitalize">
                      {metodo.metodo === 'sinpe' ? 'SINPE' : 
                       metodo.metodo === 'tarjeta' ? 'Tarjeta' : 
                       metodo.metodo === 'efectivo' ? 'Efectivo' : 
                       'Pendiente'}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {metodo.porcentaje.toFixed(1)}%
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Ingresos:</span>
                    <span className="font-semibold">{formatCurrency(metodo.ingresos)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Trabajos:</span>
                    <span className="font-semibold">{metodo.cantidad}</span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-current h-2 rounded-full transition-all duration-500"
                        style={{ width: `${metodo.porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
