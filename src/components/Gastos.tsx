import React, { useState, useEffect, useCallback } from 'react';
import type { Gasto, CreateGastoDto, UpdateGastoDto, EstadisticasGastosResponse } from '../types';
import { GastosApi } from '../services/api';
import { GastoModal } from './GastoModal';
import { ConfirmDeleteGastoModal } from './ConfirmDeleteGastoModal';

export const Gastos: React.FC = () => {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasGastosResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGasto, setSelectedGasto] = useState<Gasto | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para filtros locales
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'fecha' | 'monto'>('fecha');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Estados para consultas avanzadas (solo las disponibles en el API)
  const [viewMode, setViewMode] = useState<'todos' | 'periodo' | 'mes'>('todos');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [periodTotal, setPeriodTotal] = useState<number | null>(null);

  // Función para cargar los datos según la vista seleccionada
  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Siempre cargar estadísticas generales
      try {
        const estadisticasData = await GastosApi.obtenerEstadisticas();
        setEstadisticas(estadisticasData);
      } catch (err) {
        console.error('Error al cargar estadísticas:', err);
      }
      
      // Cargar datos según la vista
      if (viewMode === 'todos') {
        const gastosData = await GastosApi.obtenerTodos();
        setGastos(gastosData);
      } else if (viewMode === 'periodo') {
        const gastosData = await GastosApi.obtenerPorPeriodo(startDate, endDate);
        setGastos(gastosData);
        
        // Obtener total del período
        try {
          const totalData = await GastosApi.obtenerTotalPorPeriodo(startDate, endDate);
          setPeriodTotal(totalData.total);
        } catch (err) {
          console.error('Error al obtener total del período:', err);
          // Calcular total localmente
          const total = gastosData.reduce((sum, gasto) => sum + gasto.monto, 0);
          setPeriodTotal(total);
        }
      } else if (viewMode === 'mes') {
        const gastosData = await GastosApi.obtenerDelMes(selectedYear, selectedMonth);
        setGastos(gastosData);
      }
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [viewMode, startDate, endDate, selectedYear, selectedMonth]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Función para crear un nuevo gasto
  const handleCreate = async (data: CreateGastoDto | UpdateGastoDto) => {
    try {
      setIsSubmitting(true);
      await GastosApi.crear(data as CreateGastoDto);
      setIsCreateModalOpen(false);
      await cargarDatos();
    } catch (err) {
      setError('Error al crear el gasto');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para editar un gasto
  const handleEdit = async (data: CreateGastoDto | UpdateGastoDto) => {
    if (!selectedGasto) return;
    
    try {
      setIsSubmitting(true);
      await GastosApi.actualizar(selectedGasto.id, data as UpdateGastoDto);
      setIsEditModalOpen(false);
      setSelectedGasto(undefined);
      await cargarDatos();
    } catch (err) {
      setError('Error al actualizar el gasto');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para eliminar un gasto
  const handleDelete = async () => {
    if (!selectedGasto) return;
    
    try {
      setIsSubmitting(true);
      await GastosApi.eliminar(selectedGasto.id);
      setIsDeleteModalOpen(false);
      setSelectedGasto(undefined);
      await cargarDatos();
    } catch (err) {
      setError('Error al eliminar el gasto');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Función para formatear fecha
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-CR');
  };

  // Función para filtrar y ordenar gastos
  const filteredAndSortedGastos = gastos
    .filter(gasto => 
      gasto.comentario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gasto.monto.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      let aValue, bValue;
      
      if (sortBy === 'fecha') {
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
      } else {
        aValue = a.monto;
        bValue = b.monto;
      }
      
      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Gastos</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Nuevo Gasto
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Estadísticas generales */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Gastos</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(estadisticas.totalGastos)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Cantidad</h3>
            <p className="text-2xl font-bold text-gray-900">{estadisticas.cantidadGastos}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Promedio</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(estadisticas.gastoPromedio)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Mayor</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(estadisticas.gastoMayor)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Menor</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(estadisticas.gastoMenor)}</p>
          </div>
        </div>
      )}

      {/* Filtros y vistas */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Selector de vista */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vista
            </label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as 'todos' | 'periodo' | 'mes')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos los gastos</option>
              <option value="periodo">Por período</option>
              <option value="mes">Por mes</option>
            </select>
          </div>

          {/* Filtros específicos según la vista */}
          {viewMode === 'periodo' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha inicio
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha fin
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {viewMode === 'mes' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año
                </label>
                <input
                  type="number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="2020"
                  max="2030"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mes
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>Enero</option>
                  <option value={2}>Febrero</option>
                  <option value={3}>Marzo</option>
                  <option value={4}>Abril</option>
                  <option value={5}>Mayo</option>
                  <option value={6}>Junio</option>
                  <option value={7}>Julio</option>
                  <option value={8}>Agosto</option>
                  <option value={9}>Septiembre</option>
                  <option value={10}>Octubre</option>
                  <option value={11}>Noviembre</option>
                  <option value={12}>Diciembre</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Información del período */}
      {viewMode === 'periodo' && periodTotal !== null && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Período del {formatDate(startDate)} al {formatDate(endDate)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Total del período</h4>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(periodTotal)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Cantidad de gastos</h4>
              <p className="text-2xl font-bold text-gray-900">{gastos.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filtros de búsqueda y ordenamiento */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Buscar por comentario o monto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'fecha' | 'monto')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="fecha">Fecha</option>
              <option value="monto">Monto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orden
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de gastos */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredAndSortedGastos.map((gasto) => (
            <li key={gasto.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {gasto.comentario || 'Sin comentario'}
                    </p>
                    <p className="text-sm text-gray-500 ml-2">
                      {formatDate(gasto.created_at)}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(gasto.monto)}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedGasto(gasto);
                          setIsEditModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          setSelectedGasto(gasto);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        {filteredAndSortedGastos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron gastos.</p>
          </div>
        )}
      </div>

      {/* Modales */}
      <GastoModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
        isLoading={isSubmitting}
      />

      <GastoModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedGasto(undefined);
        }}
        onSubmit={handleEdit}
        isLoading={isSubmitting}
        gasto={selectedGasto}
      />

      <ConfirmDeleteGastoModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedGasto(undefined);
        }}
        onConfirm={handleDelete}
        isLoading={isSubmitting}
        gasto={selectedGasto}
      />
    </div>
  );
};
