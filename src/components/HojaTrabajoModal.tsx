import React, { useState, useEffect } from 'react';
import type { HojaTrabajo, CreateHojaTrabajoDto, UpdateHojaTrabajoConServiciosDto, Servicio } from '../types';
import { ServiciosApi, HojasTrabajoApi } from '../services/api';

interface HojaTrabajoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (hojaTrabajo: CreateHojaTrabajoDto | UpdateHojaTrabajoConServiciosDto) => void;
  hojaTrabajo?: HojaTrabajo;
  isLoading?: boolean;
}

interface ServicioSeleccionado {
  servicioId: number;
  comentario: string;
  precio: number;
  nombre: string;
}

export const HojaTrabajoModal: React.FC<HojaTrabajoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  hojaTrabajo,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<CreateHojaTrabajoDto & { estado?: string }>({
    cliente: '',
    vehiculo: '',
    placa: '',
    telefono: '',
    observaciones: '',
    estado: 'pendiente',
    servicios: []
  });

  const [serviciosDisponibles, setServiciosDisponibles] = useState<Servicio[]>([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<ServicioSeleccionado[]>([]);
  const [loadingServicios, setLoadingServicios] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      cargarServicios();
    }
  }, [isOpen]);

  useEffect(() => {
    if (hojaTrabajo) {
      setFormData({
        cliente: hojaTrabajo.cliente || '',
        vehiculo: hojaTrabajo.vehiculo || '',
        placa: hojaTrabajo.placa || '',
        telefono: hojaTrabajo.telefono || '',
        observaciones: hojaTrabajo.observaciones || '',
        estado: hojaTrabajo.estado || 'pendiente',
        servicios: []
      });

      // Cargar servicios seleccionados de la hoja de trabajo existente
      const serviciosExistentes = hojaTrabajo.detalles?.map(detalle => ({
        servicioId: detalle.servicioId,
        comentario: detalle.comentario || '',
        precio: Number(detalle.precio) || 0, // Asegurar que es un número
        nombre: detalle.servicio.nombre
      })) || [];
      
      setServiciosSeleccionados(serviciosExistentes);
    } else {
      setFormData({
        cliente: '',
        vehiculo: '',
        placa: '',
        telefono: '',
        observaciones: '',
        estado: 'pendiente',
        servicios: []
      });
      setServiciosSeleccionados([]);
    }
    setErrors({});
  }, [hojaTrabajo, isOpen]);

  const cargarServicios = async () => {
    try {
      setLoadingServicios(true);
      const servicios = await ServiciosApi.obtenerTodos();
      setServiciosDisponibles(servicios.filter(s => s.activo));
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    } finally {
      setLoadingServicios(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.cliente?.trim()) {
      newErrors.cliente = 'El cliente es requerido';
    }

    if (!formData.vehiculo?.trim()) {
      newErrors.vehiculo = 'El vehículo es requerido';
    }

    if (!formData.placa?.trim()) {
      newErrors.placa = 'La placa es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        if (hojaTrabajo) {
          // Si estamos editando una hoja existente, actualizar primero los datos básicos
          const datosBasicos: UpdateHojaTrabajoConServiciosDto = {
            cliente: formData.cliente,
            vehiculo: formData.vehiculo,
            placa: formData.placa,
            telefono: formData.telefono,
            observaciones: formData.observaciones,
            servicios: serviciosSeleccionados.map(s => prepararServicioParaEnvio(s))
          };

          // Actualizar los datos básicos
          await HojasTrabajoApi.actualizar(hojaTrabajo.id, {
            cliente: formData.cliente,
            vehiculo: formData.vehiculo,
            placa: formData.placa,
            telefono: formData.telefono,
            observaciones: formData.observaciones,
            estado: formData.estado as 'pendiente' | 'en_proceso' | 'completado' | 'entregado'
          });

          // Actualizar los servicios masivamente
          await HojasTrabajoApi.actualizarServicios(
            hojaTrabajo.id,
            serviciosSeleccionados.map(s => prepararServicioParaEnvio(s))
          );

          // Notificar que se completó la actualización
          onSubmit(datosBasicos);
        } else {
          // Para crear nueva hoja de trabajo
          const dataToSubmit: CreateHojaTrabajoDto = {
            ...formData,
            servicios: serviciosSeleccionados.map(s => prepararServicioParaEnvio(s))
          };
          onSubmit(dataToSubmit);
        }
      } catch (error) {
        console.error('Error al procesar hoja de trabajo:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const agregarServicio = (servicioId: number) => {
    const servicio = serviciosDisponibles.find(s => s.id === servicioId);
    if (!servicio) return;

    // Verificar si ya está seleccionado
    if (serviciosSeleccionados.some(s => s.servicioId === servicioId)) {
      return;
    }

    const nuevoServicio: ServicioSeleccionado = {
      servicioId: servicio.id,
      comentario: '',
      precio: Number(servicio.precio) || 0, // Asegurar que es un número
      nombre: servicio.nombre
    };

    setServiciosSeleccionados(prev => [...prev, nuevoServicio]);
  };

  const removerServicio = (servicioId: number) => {
    setServiciosSeleccionados(prev => prev.filter(s => s.servicioId !== servicioId));
  };

  const actualizarComentarioServicio = (servicioId: number, comentario: string) => {
    setServiciosSeleccionados(prev => 
      prev.map(s => 
        s.servicioId === servicioId 
          ? { ...s, comentario }
          : s
      )
    );
  };

  const actualizarPrecioServicio = (servicioId: number, precio: number) => {
    setServiciosSeleccionados(prev => 
      prev.map(s => 
        s.servicioId === servicioId 
          ? { ...s, precio: precio || 0 }
          : s
      )
    );
  };

  const calcularTotal = () => {
    const total = serviciosSeleccionados.reduce((total, servicio) => {
      const precio = Number(servicio.precio) || 0;
      return total + precio;
    }, 0);
    return total;
  };

  const calcularTotalOriginal = () => {
    const totalOriginal = serviciosSeleccionados.reduce((total, servicio) => {
      const precioOriginal = obtenerPrecioOriginal(servicio.servicioId);
      return total + precioOriginal;
    }, 0);
    return totalOriginal;
  };

  const calcularDiferenciaPrecio = () => {
    const totalActual = calcularTotal();
    const totalOriginal = calcularTotalOriginal();
    return totalActual - totalOriginal;
  };

  const formatCurrency = (amount: number) => {
    // Verificar si amount es un número válido
    const validAmount = Number(amount) || 0;
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0
    }).format(validAmount);
  };

  const obtenerPrecioOriginal = (servicioId: number): number => {
    const servicio = serviciosDisponibles.find(s => s.id === servicioId);
    return servicio ? Number(servicio.precio) : 0;
  };

  const prepararServicioParaEnvio = (servicio: ServicioSeleccionado) => {
    const precioOriginal = obtenerPrecioOriginal(servicio.servicioId);
    const datoServicio: { servicioId: number; comentario?: string; precio?: number } = {
      servicioId: servicio.servicioId,
      comentario: servicio.comentario
    };

    // Solo incluir precio si es diferente al precio original del catálogo
    if (servicio.precio !== precioOriginal) {
      datoServicio.precio = servicio.precio;
    }

    return datoServicio;
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
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto modal-content">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {hojaTrabajo ? 'Editar Hoja de Trabajo' : 'Crear Nueva Hoja de Trabajo'}
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

          <form onSubmit={handleSubmit} className="space-y-6 modal-form">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cliente */}
              <div>
                <label htmlFor="cliente" className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente *
                </label>
                <input
                  type="text"
                  id="cliente"
                  name="cliente"
                  value={formData.cliente}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.cliente ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Nombre del cliente"
                />
                {errors.cliente && (
                  <p className="mt-1 text-sm text-red-600">{errors.cliente}</p>
                )}
              </div>

              {/* Vehículo */}
              <div>
                <label htmlFor="vehiculo" className="block text-sm font-medium text-gray-700 mb-1">
                  Vehículo *
                </label>
                <input
                  type="text"
                  id="vehiculo"
                  name="vehiculo"
                  value={formData.vehiculo}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.vehiculo ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Marca, modelo y año"
                />
                {errors.vehiculo && (
                  <p className="mt-1 text-sm text-red-600">{errors.vehiculo}</p>
                )}
              </div>

              {/* Placa */}
              <div>
                <label htmlFor="placa" className="block text-sm font-medium text-gray-700 mb-1">
                  Placa *
                </label>
                <input
                  type="text"
                  id="placa"
                  name="placa"
                  value={formData.placa}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.placa ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Número de placa"
                />
                {errors.placa && (
                  <p className="mt-1 text-sm text-red-600">{errors.placa}</p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Número de teléfono"
                />
              </div>

              {/* Estado - Solo mostrar al editar */}
              {hojaTrabajo && (
                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="completado">Completado</option>
                    <option value="entregado">Entregado</option>
                  </select>
                </div>
              )}
            </div>

            {/* Observaciones */}
            <div>
              <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">
                Observaciones
              </label>
              <textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Observaciones generales"
              />
            </div>

            {/* Servicios */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Servicios
              </label>
              
              {/* Selector de servicios */}
              <div className="mb-4">
                <select
                  onChange={(e) => {
                    const servicioId = parseInt(e.target.value);
                    if (servicioId) {
                      agregarServicio(servicioId);
                      e.target.value = '';
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={loadingServicios}
                >
                  <option value="">Seleccionar servicio...</option>
                  {serviciosDisponibles
                    .filter(servicio => !serviciosSeleccionados.some(s => s.servicioId === servicio.id))
                    .map(servicio => (
                      <option key={servicio.id} value={servicio.id}>
                        {servicio.nombre} - {formatCurrency(servicio.precio)}
                      </option>
                    ))
                  }
                </select>
              </div>

              {/* Lista de servicios seleccionados */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {serviciosSeleccionados.map((servicio) => (
                  <div key={servicio.servicioId} className={`flex items-center space-x-3 p-3 rounded-md border ${
                    obtenerPrecioOriginal(servicio.servicioId) !== servicio.precio 
                      ? 'bg-yellow-50 border-yellow-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{servicio.nombre}</span>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            {obtenerPrecioOriginal(servicio.servicioId) !== servicio.precio && (
                              <div className="text-xs text-gray-400 line-through">
                                Original: {formatCurrency(obtenerPrecioOriginal(servicio.servicioId))}
                              </div>
                            )}
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-gray-500">₡</span>
                              <input
                                type="number"
                                value={servicio.precio}
                                onChange={(e) => actualizarPrecioServicio(servicio.servicioId, Number(e.target.value))}
                                className="w-20 px-1 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-right"
                                min="0"
                                step="100"
                              />
                              {obtenerPrecioOriginal(servicio.servicioId) !== servicio.precio && (
                                <button
                                  type="button"
                                  onClick={() => actualizarPrecioServicio(servicio.servicioId, obtenerPrecioOriginal(servicio.servicioId))}
                                  className="text-xs text-blue-600 hover:text-blue-800 ml-1"
                                  title="Restaurar precio original"
                                >
                                  ↻
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={servicio.comentario}
                        onChange={(e) => actualizarComentarioServicio(servicio.servicioId, e.target.value)}
                        placeholder="Comentario para este servicio..."
                        className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removerServicio(servicio.servicioId)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Total */}
              {serviciosSeleccionados.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">Total estimado:</span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatCurrency(calcularTotal())}
                    </span>
                  </div>
                  {calcularDiferenciaPrecio() !== 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {calcularDiferenciaPrecio() > 0 ? 'Incremento:' : 'Descuento:'}
                      </span>
                      <span className={`font-medium ${
                        calcularDiferenciaPrecio() > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {calcularDiferenciaPrecio() > 0 ? '+' : ''}
                        {formatCurrency(calcularDiferenciaPrecio())}
                      </span>
                    </div>
                  )}
                </div>
              )}
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
                {isLoading ? 'Guardando...' : (hojaTrabajo ? 'Actualizar' : 'Crear')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
