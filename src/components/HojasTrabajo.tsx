import React, { useState, useEffect } from 'react';
import type { HojaTrabajo, CreateHojaTrabajoDto } from '../types';
import { HojasTrabajoApi } from '../services/api';
import { HojaTrabajoModal } from './HojaTrabajoModal';
import { ConfirmDeleteHojaModal } from './ConfirmDeleteHojaModal';

type EstadoFilter = 'todos' | 'pendiente' | 'en_proceso' | 'completado' | 'entregado';

export const HojasTrabajo: React.FC = () => {
  const [hojasTrabajo, setHojasTrabajo] = useState<HojaTrabajo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedHojaTrabajo, setSelectedHojaTrabajo] = useState<HojaTrabajo | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<EstadoFilter>('todos');

  useEffect(() => {
    cargarHojasTrabajo();
  }, []);

  const cargarHojasTrabajo = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await HojasTrabajoApi.obtenerTodas();
      setHojasTrabajo(data);
    } catch (err) {
      setError('Error al cargar las hojas de trabajo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (hojaTrabajoData: CreateHojaTrabajoDto) => {
    try {
      setIsSubmitting(true);
      await HojasTrabajoApi.crear(hojaTrabajoData);
      await cargarHojasTrabajo();
      setIsCreateModalOpen(false);
    } catch (err) {
      setError('Error al crear la hoja de trabajo');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedHojaTrabajo) return;
    
    try {
      setIsSubmitting(true);
      // El modal ya maneja la actualización de datos básicos y servicios internamente
      // Solo necesitamos recargar los datos
      await cargarHojasTrabajo();
      setIsEditModalOpen(false);
      setSelectedHojaTrabajo(undefined);
    } catch (err) {
      setError('Error al actualizar la hoja de trabajo');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedHojaTrabajo) return;
    
    try {
      setIsSubmitting(true);
      await HojasTrabajoApi.eliminar(selectedHojaTrabajo.id);
      await cargarHojasTrabajo();
      setIsDeleteModalOpen(false);
      setSelectedHojaTrabajo(undefined);
    } catch (err) {
      setError('Error al eliminar la hoja de trabajo');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEstado = async (hojaTrabajoId: number, nuevoEstado: string) => {
    try {
      await HojasTrabajoApi.actualizar(hojaTrabajoId, { 
        estado: nuevoEstado as 'pendiente' | 'en_proceso' | 'completado' | 'entregado' 
      });
      await cargarHojasTrabajo();
    } catch (err) {
      setError('Error al actualizar el estado');
      console.error(err);
    }
  };

  const handleUpdateMetodoPago = async (hojaTrabajoId: number, nuevoMetodo: string) => {
    try {
      await HojasTrabajoApi.actualizar(hojaTrabajoId, { 
        metodo_pago: nuevoMetodo as 'pendiente' | 'sinpe' | 'tarjeta' | 'efectivo' 
      });
      await cargarHojasTrabajo();
    } catch (err) {
      setError('Error al actualizar el método de pago');
      console.error(err);
    }
  };

  const openEditModal = (hojaTrabajo: HojaTrabajo) => {
    setSelectedHojaTrabajo(hojaTrabajo);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (hojaTrabajo: HojaTrabajo) => {
    setSelectedHojaTrabajo(hojaTrabajo);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedHojaTrabajo(undefined);
  };

  // Filtrar hojas de trabajo
  const hojasFiltradas = hojasTrabajo.filter(hoja => {
    const matchesSearch = 
      hoja.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hoja.vehiculo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hoja.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hoja.telefono?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = estadoFilter === 'todos' || hoja.estado === estadoFilter;
    
    return matchesSearch && matchesEstado;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0
    }).format(amount);
  };

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

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'en_proceso':
        return 'bg-blue-100 text-blue-800';
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'entregado':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMetodoPagoColor = (metodo: string) => {
    switch (metodo) {
      case 'pendiente':
        return 'bg-gray-100 text-gray-800';
      case 'sinpe':
        return 'bg-orange-100 text-orange-800';
      case 'tarjeta':
        return 'bg-blue-100 text-blue-800';
      case 'efectivo':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && hojasTrabajo.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Hojas de Trabajo</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nueva Hoja de Trabajo
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
            <button
              onClick={() => setError(null)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <svg className="fill-current h-6 w-6 text-red-500" role="button" viewBox="0 0 20 20">
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </button>
          </div>
        )}

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por cliente, vehículo, placa o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value as EstadoFilter)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En Proceso</option>
              <option value="completado">Completado</option>
              <option value="entregado">Entregado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de hojas de trabajo */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehículo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Placa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Método de Pago
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Servicios
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {hojasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                  {searchTerm || estadoFilter !== 'todos' 
                    ? 'No se encontraron hojas de trabajo que coincidan con los filtros' 
                    : 'No hay hojas de trabajo disponibles'
                  }
                </td>
              </tr>
            ) : (
              hojasFiltradas.map((hoja) => (
                <tr key={hoja.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{hoja.cliente}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {hoja.vehiculo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{hoja.placa}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{hoja.telefono || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={hoja.estado}
                      onChange={(e) => handleUpdateEstado(hoja.id, e.target.value)}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-0 ${getEstadoColor(hoja.estado)}`}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en_proceso">En Proceso</option>
                      <option value="completado">Completado</option>
                      <option value="entregado">Entregado</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={hoja.metodo_pago}
                      onChange={(e) => handleUpdateMetodoPago(hoja.id, e.target.value)}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-0 ${getMetodoPagoColor(hoja.metodo_pago)}`}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="sinpe">SINPE</option>
                      <option value="tarjeta">Tarjeta</option>
                      <option value="efectivo">Efectivo</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {hoja.detalles?.length || 0} servicio(s)
                    </div>
                    {hoja.detalles && hoja.detalles.length > 0 && (
                      <div className="text-xs text-gray-500">
                        {hoja.detalles.slice(0, 2).map(detalle => detalle.servicio.nombre).join(', ')}
                        {hoja.detalles.length > 2 && '...'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(hoja.total)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(hoja.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(hoja)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Editar"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => openDeleteModal(hoja)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Modales */}
      <HojaTrabajoModal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        onSubmit={handleCreate}
        isLoading={isSubmitting}
      />

      <HojaTrabajoModal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        onSubmit={handleEdit}
        hojaTrabajo={selectedHojaTrabajo}
        isLoading={isSubmitting}
      />

      <ConfirmDeleteHojaModal
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        onConfirm={handleDelete}
        hojaTrabajo={selectedHojaTrabajo}
        isLoading={isSubmitting}
      />
    </div>
  );
};
