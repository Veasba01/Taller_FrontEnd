import React, { useState, useEffect, useCallback } from 'react';

interface ServicioRealizadoDto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  fechaRealizacion: string;
  cliente: string;
  vehiculo: string;
  comentario?: string;
}

interface ResumenServiciosDto {
  fechaInicio: string;
  fechaFin: string;
  totalServicios: number;
  servicios: ServicioRealizadoDto[];
}

export const ServiciosRealizados: React.FC = () => {
  const [serviciosHoy, setServiciosHoy] = useState<ResumenServiciosDto | null>(null);
  const [serviciosPeriodo, setServiciosPeriodo] = useState<ResumenServiciosDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [vistaActual, setVistaActual] = useState<'hoy' | 'periodo'>('hoy');

  // Función para parsear fecha del backend tratándola como hora local de Costa Rica
  const parseFechaCostaRica = (fecha: string): Date => {
    // Si la fecha viene en formato YYYY-MM-DD, la tratamos como fecha local de Costa Rica
    if (fecha.includes('T')) {
      // Si ya incluye hora, la parseamos directamente
      return new Date(fecha);
    } else {
      // Si solo es fecha (YYYY-MM-DD), creamos una fecha local sin conversión UTC
      const [year, month, day] = fecha.split('-').map(Number);
      return new Date(year, month - 1, day); // month - 1 porque Date usa 0-indexed months
    }
  };

  // Función para formatear fecha
  const formatFecha = (fecha: string): string => {
    const date = parseFechaCostaRica(fecha);
    return date.toLocaleDateString('es-CR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Costa_Rica'
    });
  };

  // Función para formatear moneda
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Cargar servicios del día actual
  const cargarServiciosHoy = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/servicios/realizados/dia');
      if (!response.ok) {
        throw new Error('Error al cargar servicios del día');
      }
      const data = await response.json();
      setServiciosHoy(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Cargar servicios por período
  const cargarServiciosPeriodo = useCallback(async () => {
    if (!fechaInicio || !fechaFin) return;
    
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/servicios/realizados/periodo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
      );
      if (!response.ok) {
        throw new Error('Error al cargar servicios del período');
      }
      const data = await response.json();
      setServiciosPeriodo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [fechaInicio, fechaFin]);

  // Inicializar fechas por defecto
  useEffect(() => {
    const hoy = new Date();
    const hace7dias = new Date(hoy);
    hace7dias.setDate(hoy.getDate() - 7);
    
    setFechaInicio(hace7dias.toISOString().split('T')[0]);
    setFechaFin(hoy.toISOString().split('T')[0]);
  }, []);

  // Cargar servicios del día al montar el componente
  useEffect(() => {
    cargarServiciosHoy();
  }, []);

  // Cargar servicios del período cuando cambien las fechas
  useEffect(() => {
    if (fechaInicio && fechaFin && vistaActual === 'periodo') {
      cargarServiciosPeriodo();
    }
  }, [fechaInicio, fechaFin, vistaActual, cargarServiciosPeriodo]);

  const serviciosActuales = vistaActual === 'hoy' ? serviciosHoy : serviciosPeriodo;

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando servicios...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Servicios Realizados</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setVistaActual('hoy')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              vistaActual === 'hoy'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Hoy
          </button>
          <button
            onClick={() => setVistaActual('periodo')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              vistaActual === 'periodo'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Por Período
          </button>
        </div>
      </div>

      {/* Filtros de período */}
      {vistaActual === 'periodo' && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-40">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1 min-w-40">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Fin
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={cargarServiciosPeriodo}
              disabled={!fechaInicio || !fechaFin}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buscar
            </button>
          </div>
        </div>
      )}

      {/* Información del período */}
      {serviciosActuales && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-blue-800">
                {vistaActual === 'hoy' 
                  ? `Servicios del ${formatFecha(serviciosActuales.fechaInicio)}`
                  : `Servicios del ${formatFecha(serviciosActuales.fechaInicio)} al ${formatFecha(serviciosActuales.fechaFin)}`
                }
              </p>
              <p className="text-lg font-semibold text-blue-900">
                Total: {serviciosActuales.totalServicios} servicios
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-800">Ingresos totales</p>
              <p className="text-lg font-semibold text-blue-900">
                {formatCurrency(serviciosActuales.servicios.reduce((sum, s) => sum + s.precio, 0))}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => {
              setError(null);
              if (vistaActual === 'hoy') {
                cargarServiciosHoy();
              } else {
                cargarServiciosPeriodo();
              }
            }}
            className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Lista de servicios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {serviciosActuales?.servicios && serviciosActuales.servicios.length > 0 ? (
          serviciosActuales.servicios.map((servicio) => (
            <div
              key={servicio.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 capitalize truncate">
                    {servicio.nombre}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2">{servicio.descripcion}</p>
                </div>
                <div className="text-right ml-2">
                  <p className="text-base font-bold text-green-600">
                    {formatCurrency(servicio.precio)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {parseFechaCostaRica(servicio.fechaRealizacion).toLocaleDateString('es-CR', {
                      month: 'short',
                      day: 'numeric',
                      timeZone: 'America/Costa_Rica'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 mt-3 pt-3 border-t border-gray-100">
                <div>
                  <p className="text-xs font-medium text-gray-700">Cliente:</p>
                  <p className="text-sm text-gray-900 truncate">{servicio.cliente}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700">Vehículo:</p>
                  <p className="text-sm text-gray-900 truncate">{servicio.vehiculo}</p>
                </div>
              </div>

              {servicio.comentario && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-700">Comentario:</p>
                  <p className="text-xs text-gray-600 line-clamp-2">{servicio.comentario}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">📋</div>
            <p className="text-gray-600">
              {vistaActual === 'hoy' 
                ? 'No hay servicios realizados hoy'
                : 'No hay servicios en el período seleccionado'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
