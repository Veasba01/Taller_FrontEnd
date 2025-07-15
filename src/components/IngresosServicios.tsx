import React, { useState, useEffect, useCallback } from 'react';

interface ServicioIngresoDto {
  nombre: string;
  descripcion: string;
  cantidad: number;
  ingresoTotal: number;
}

interface ResumenIngresosDto {
  fechaInicio: string;
  fechaFin: string;
  totalIngresos: number;
  totalServicios: number;
  servicios: ServicioIngresoDto[];
}

export const IngresosServicios: React.FC = () => {
  const [ingresosHoy, setIngresosHoy] = useState<ResumenIngresosDto | null>(null);
  const [ingresosPeriodo, setIngresosPeriodo] = useState<ResumenIngresosDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [vistaActual, setVistaActual] = useState<'hoy' | 'periodo'>('hoy');

  // Función para parsear fecha del backend tratándola como hora local de Costa Rica
  const parseFechaCostaRica = (fecha: string): Date => {
    if (fecha.includes('T')) {
      return new Date(fecha);
    } else {
      const [year, month, day] = fecha.split('-').map(Number);
      return new Date(year, month - 1, day);
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

  // Cargar ingresos del día actual
  const cargarIngresosHoy = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/servicios/ingresos/dia');
      if (!response.ok) {
        throw new Error('Error al cargar ingresos del día');
      }
      const data = await response.json();
      setIngresosHoy(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Cargar ingresos por período
  const cargarIngresosPeriodo = useCallback(async () => {
    if (!fechaInicio || !fechaFin) return;
    
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/servicios/ingresos/periodo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
      );
      if (!response.ok) {
        throw new Error('Error al cargar ingresos del período');
      }
      const data = await response.json();
      setIngresosPeriodo(data);
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

  // Cargar ingresos del día al montar el componente
  useEffect(() => {
    cargarIngresosHoy();
  }, []);

  // Cargar ingresos del período cuando cambien las fechas
  useEffect(() => {
    if (fechaInicio && fechaFin && vistaActual === 'periodo') {
      cargarIngresosPeriodo();
    }
  }, [fechaInicio, fechaFin, vistaActual, cargarIngresosPeriodo]);

  const ingresosActuales = vistaActual === 'hoy' ? ingresosHoy : ingresosPeriodo;

  // Calcular porcentaje para barras de progreso
  const calcularPorcentaje = (ingreso: number, total: number): number => {
    return total > 0 ? (ingreso / total) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando ingresos por servicio...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Ingresos por Servicio</h2>
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
              onClick={cargarIngresosPeriodo}
              disabled={!fechaInicio || !fechaFin}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buscar
            </button>
          </div>
        </div>
      )}

      {/* Resumen de ingresos */}
      {ingresosActuales && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-green-800">
                {vistaActual === 'hoy' 
                  ? `Ingresos del ${formatFecha(ingresosActuales.fechaInicio)}`
                  : `Ingresos del ${formatFecha(ingresosActuales.fechaInicio)} al ${formatFecha(ingresosActuales.fechaFin)}`
                }
              </p>
              <p className="text-lg font-semibold text-green-900">
                {formatCurrency(ingresosActuales.totalIngresos)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-800">Total de servicios</p>
              <p className="text-lg font-semibold text-green-900">
                {ingresosActuales.totalServicios}
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
                cargarIngresosHoy();
              } else {
                cargarIngresosPeriodo();
              }
            }}
            className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Lista de servicios con ingresos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {ingresosActuales?.servicios && ingresosActuales.servicios.length > 0 ? (
          ingresosActuales.servicios.map((servicio, index) => {
            const porcentaje = calcularPorcentaje(servicio.ingresoTotal, ingresosActuales.totalIngresos);
            
            return (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 capitalize truncate">
                      {servicio.nombre}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2">{servicio.descripcion}</p>
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-base font-bold text-green-600">
                      {formatCurrency(servicio.ingresoTotal)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {porcentaje.toFixed(1)}% del total
                    </p>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="mb-3">
                  <div className="bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-green-600 h-1.5 rounded-full transition-all duration-300" 
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                </div>

                {/* Estadísticas adicionales */}
                <div className="text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Cantidad:</span>
                    <span className="text-gray-900">{servicio.cantidad} servicios</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">💰</div>
            <p className="text-gray-600">
              {vistaActual === 'hoy' 
                ? 'No hay ingresos por servicios hoy'
                : 'No hay ingresos por servicios en el período seleccionado'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
