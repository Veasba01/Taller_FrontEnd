import React, { useState, useEffect } from 'react';
import { DashboardApi } from '../services/api';
import type { GastosDelDiaResponse, ResumenFinancieroResponse } from '../types';

export const GastosDelDiaCard: React.FC = () => {
  const [gastos, setGastos] = useState<GastosDelDiaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarGastos();
  }, []);

  const cargarGastos = async () => {
    try {
      setLoading(true);
      setError(null);
      // Siempre cargar datos del día de hoy (sin pasar fecha)
      const data = await DashboardApi.obtenerGastosDelDia();
      setGastos(data);
    } catch (err) {
      setError('Error al cargar gastos del día');
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center h-32">
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
            onClick={() => cargarGastos()}
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Gastos del Día
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Hoy</span>
          <button
            onClick={cargarGastos}
            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
          >
            Actualizar
          </button>
        </div>
      </div>

      {gastos && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total gastado</p>
                <p className="text-lg font-bold text-red-600">{formatCurrency(gastos.totalGastos)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Cantidad</p>
              <p className="text-lg font-bold text-gray-900">{gastos.cantidadGastos}</p>
            </div>
          </div>

          {gastos.gastos.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Gastos recientes</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {gastos.gastos.slice(0, 3).map((gasto) => (
                  <div key={gasto.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 truncate">
                      {gasto.comentario || 'Sin comentario'}
                    </span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(gasto.monto)}
                    </span>
                  </div>
                ))}
                {gastos.gastos.length > 3 && (
                  <p className="text-xs text-gray-500 text-center">
                    +{gastos.gastos.length - 3} gastos más
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const ResumenFinancieroCard: React.FC = () => {
  const [resumen, setResumen] = useState<ResumenFinancieroResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarResumen();
  }, []);

  const cargarResumen = async () => {
    try {
      setLoading(true);
      setError(null);
      // Siempre cargar datos del día de hoy (sin pasar fecha)
      const data = await DashboardApi.obtenerResumenFinanciero();
      setResumen(data);
    } catch (err) {
      setError('Error al cargar resumen financiero');
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center h-32">
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
            onClick={() => cargarResumen()}
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Resumen Financiero
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Hoy</span>
          <button
            onClick={cargarResumen}
            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
          >
            Actualizar
          </button>
        </div>
      </div>

      {resumen && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">Ingresos</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(resumen.ingresos)}</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">Gastos</p>
              <p className="text-lg font-bold text-red-600">{formatCurrency(resumen.gastos)}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Utilidad:</span>
              <span className={`text-lg font-bold ${resumen.utilidad >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(resumen.utilidad)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Margen:</span>
              <span className={`text-sm font-bold ${resumen.margenUtilidad >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {resumen.margenUtilidad.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                resumen.margenUtilidad >= 0 ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(Math.abs(resumen.margenUtilidad), 100)}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};
