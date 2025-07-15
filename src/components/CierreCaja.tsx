import React, { useState, useEffect } from 'react';
import { CierreCajaApi } from '../services/api';
import type { ResumenCierreResponse, CierreCajaResponse } from '../types';

export const CierreCaja: React.FC = () => {
  const [resumenCierre, setResumenCierre] = useState<ResumenCierreResponse | null>(null);
  const [cierreExistente, setCierreExistente] = useState<CierreCajaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realizandoCierre, setRealizandoCierre] = useState(false);

  // Función para formatear moneda
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Función para formatear fecha en zona horaria de Costa Rica
  const formatFecha = (fecha: string): string => {
    // Si la fecha viene en formato YYYY-MM-DD, crear la fecha correctamente
    let date: Date;
    if (fecha.includes('T')) {
      // Si ya incluye hora, la parseamos y ajustamos a Costa Rica
      date = new Date(fecha);
    } else {
      // Si solo es fecha (YYYY-MM-DD), creamos una fecha local sin conversión UTC
      const [year, month, day] = fecha.split('-').map(Number);
      date = new Date(year, month - 1, day);
    }
    
    return date.toLocaleDateString('es-CR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Costa_Rica'
    });
  };

  // Obtener fecha de hoy en formato YYYY-MM-DD ajustada a Costa Rica
  const obtenerFechaHoy = (): string => {
    const hoy = new Date();
    // Ajustar a la zona horaria de Costa Rica (UTC-6)
    const costaRicaTime = new Date(hoy.toLocaleString("en-US", { timeZone: "America/Costa_Rica" }));
    
    const year = costaRicaTime.getFullYear();
    const month = String(costaRicaTime.getMonth() + 1).padStart(2, '0');
    const day = String(costaRicaTime.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  // Cargar resumen del cierre de hoy
  const cargarResumenCierre = async () => {
    try {
      setLoading(true);
      setError(null);
      const fechaHoy = obtenerFechaHoy();
      
      const data = await CierreCajaApi.obtenerResumenCierre(fechaHoy);
      setResumenCierre(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Verificar si ya existe un cierre para hoy
  const verificarCierreExistente = async () => {
    try {
      const fechaHoy = obtenerFechaHoy();
      const data = await CierreCajaApi.obtenerCierrePorFecha(fechaHoy);
      setCierreExistente(data);
    } catch (err) {
      if (err instanceof Error && err.message.includes('No existe un cierre')) {
        setCierreExistente(null);
      } else {
        console.error('Error al verificar cierre existente:', err);
      }
    }
  };

  // Realizar cierre de caja
  const realizarCierre = async () => {
    try {
      setRealizandoCierre(true);
      setError(null);
      const fechaHoy = obtenerFechaHoy();
      
      const data = await CierreCajaApi.realizarCierre(fechaHoy);
      setCierreExistente(data);
      
      // Mostrar mensaje de éxito
      alert('Cierre de caja realizado exitosamente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setRealizandoCierre(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      await verificarCierreExistente();
      await cargarResumenCierre();
    };
    cargarDatos();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando información del cierre...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Cierre de Caja</h2>
        <div className="text-sm text-gray-600">
          {formatFecha(obtenerFechaHoy())}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => {
              setError(null);
              verificarCierreExistente();
              cargarResumenCierre();
            }}
            className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Estado del cierre */}
      {cierreExistente ? (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <p className="text-green-800 font-medium">Cierre ya realizado</p>
          </div>
          <p className="text-green-700 text-sm">
            El cierre de caja para hoy ya fue realizado el {new Date(cierreExistente.createdAt).toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' })}
          </p>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center mb-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <p className="text-yellow-800 font-medium">Cierre pendiente</p>
          </div>
          <p className="text-yellow-700 text-sm">
            El cierre de caja para hoy aún no se ha realizado
          </p>
        </div>
      )}

      {/* Resumen financiero */}
      {resumenCierre && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-1">Total Ingresos</h3>
            <p className="text-2xl font-bold text-blue-900">
              {formatCurrency(resumenCierre.totalIngresos)}
            </p>
            <p className="text-sm text-blue-700">
              {resumenCierre.detalleIngresos.cantidadServicios} servicios
            </p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-red-800 mb-1">Total Gastos</h3>
            <p className="text-2xl font-bold text-red-900">
              {formatCurrency(resumenCierre.totalGastos)}
            </p>
            <p className="text-sm text-red-700">
              {resumenCierre.detalleGastos.length} gastos
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${resumenCierre.saldoFinal >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <h3 className={`text-sm font-medium mb-1 ${resumenCierre.saldoFinal >= 0 ? 'text-green-800' : 'text-red-800'}`}>
              Saldo Final
            </h3>
            <p className={`text-2xl font-bold ${resumenCierre.saldoFinal >= 0 ? 'text-green-900' : 'text-red-900'}`}>
              {formatCurrency(resumenCierre.saldoFinal)}
            </p>
            <p className={`text-sm ${resumenCierre.saldoFinal >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {resumenCierre.saldoFinal >= 0 ? 'Ganancia' : 'Pérdida'}
            </p>
          </div>
        </div>
      )}

      {/* Botón de cierre */}
      {!cierreExistente && resumenCierre && (
        <div className="mb-6 flex justify-center">
          <button
            onClick={realizarCierre}
            disabled={realizandoCierre}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {realizandoCierre ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Realizando cierre...
              </>
            ) : (
              'Realizar Cierre de Caja'
            )}
          </button>
        </div>
      )}

      {/* Detalle de servicios */}
      {resumenCierre && resumenCierre.detalleIngresos.serviciosRealizados.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Servicios Realizados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resumenCierre.detalleIngresos.serviciosRealizados.map((servicio, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 capitalize">{servicio.nombre}</h4>
                    <p className="text-sm text-gray-600">Cantidad: {servicio.cantidad}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {formatCurrency(servicio.total)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detalle de gastos */}
      {resumenCierre && resumenCierre.detalleGastos.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gastos del Día</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resumenCierre.detalleGastos.map((gasto, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-gray-900">{gasto.descripcion}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">
                      {formatCurrency(gasto.monto)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay datos */}
      {resumenCierre && 
       resumenCierre.detalleIngresos.serviciosRealizados.length === 0 && 
       resumenCierre.detalleGastos.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-4">📊</div>
          <p className="text-gray-600">No hay servicios realizados ni gastos para hoy</p>
        </div>
      )}
    </div>
  );
};
