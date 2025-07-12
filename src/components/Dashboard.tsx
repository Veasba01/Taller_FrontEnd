import React, { useState, useEffect } from 'react';
import { DashboardApi } from '../services/api';
import { GastosDelDiaCard, ResumenFinancieroCard } from './GastosStats';
import type { 
  IngresosDiaResponse, 
  ServiciosPendientesResponse, 
  IngresosPorSemanaResponse, 
  ResumenSemanaResponse 
} from '../types';

const Dashboard: React.FC = () => {
  const [ingresosDia, setIngresosDia] = useState<IngresosDiaResponse | null>(null);
  const [serviciosPendientes, setServiciosPendientes] = useState<ServiciosPendientesResponse | null>(null);
  const [ingresosSemana, setIngresosSemana] = useState<IngresosPorSemanaResponse | null>(null);
  const [resumenSemana, setResumenSemana] = useState<ResumenSemanaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const cargarDatosDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar datos en paralelo
      const [ingresosDiaData, serviciosPendientesData, ingresosSemanaData, resumenSemanaData] = await Promise.all([
        DashboardApi.obtenerIngresosDia(),
        DashboardApi.obtenerServiciosPendientesDia(),
        DashboardApi.obtenerIngresosPorSemana(),
        DashboardApi.obtenerResumenSemana()
      ]);

      setIngresosDia(ingresosDiaData);
      setServiciosPendientes(serviciosPendientesData);
      setIngresosSemana(ingresosSemanaData);
      setResumenSemana(resumenSemanaData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos del dashboard');
      console.error('Error al cargar dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatosDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando datos del dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">❌</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error al cargar el dashboard</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={cargarDatosDashboard}
                    className="bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-4 rounded"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800">Posibles soluciones:</h4>
            <ul className="mt-2 text-sm text-blue-700 space-y-1">
              <li>• Verificar que el servidor backend esté ejecutándose en http://localhost:3000</li>
              <li>• Verificar que el módulo Dashboard esté correctamente registrado</li>
              <li>• Verificar que la base de datos esté conectada y tenga datos</li>
              <li>• Revisar la consola del navegador para más detalles</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const StatCard: React.FC<{ title: string; value: string | number; subtitle: string; icon: string; color: string }> = 
    ({ title, value, subtitle, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          <p className="text-gray-500 text-xs">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Resumen de actividades del taller</p>
            {lastUpdated && (
              <p className="text-sm text-gray-500 mt-1">
                Última actualización: {lastUpdated.toLocaleString('es-CR')}
              </p>
            )}
          </div>
          <button
            onClick={cargarDatosDashboard}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Actualizando...
              </>
            ) : (
              <>
                <span>🔄</span>
                Actualizar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Métricas diarias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Ingresos del día"
          value={formatCurrency(ingresosDia?.ingresos || 0)}
          subtitle={ingresosDia?.fecha || 'Hoy'}
          icon="💰"
          color="text-green-600"
        />
        <StatCard
          title="Servicios completados"
          value={ingresosDia?.cantidadTrabajos || 0}
          subtitle="Hoy"
          icon="✅"
          color="text-blue-600"
        />
        <StatCard
          title="Clientes atendidos"
          value={resumenSemana?.resumen.clientesAtendidos || 0}
          subtitle="Esta semana"
          icon="👥"
          color="text-purple-600"
        />
        <StatCard
          title="Servicios pendientes"
          value={serviciosPendientes?.totalPendientes || 0}
          subtitle="En cola"
          icon="⏳"
          color="text-orange-600"
        />
      </div>

      {/* Gráficos y tablas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gráfico de ventas semanales */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ingresos por día (Esta semana)</h2>
          <div className="space-y-4">
            {ingresosSemana?.ingresosPorDia && ingresosSemana.ingresosPorDia.length > 0 ? (
              ingresosSemana.ingresosPorDia.map((stat, index) => {
                const maxIngresos = Math.max(...(ingresosSemana?.ingresosPorDia.map(d => d.ingresos) || [1]));
                const percentage = maxIngresos > 0 ? (stat.ingresos / maxIngresos) * 100 : 0;
                
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-600 w-14 flex-shrink-0">{stat.dia}</span>
                      <div className="flex-1">
                        <div className="bg-gray-200 rounded-full h-2 w-40">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(stat.ingresos)}</p>
                      <p className="text-xs text-gray-500">{stat.cantidadTrabajos} trabajos</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No hay datos de ingresos disponibles para esta semana</p>
              </div>
            )}
          </div>
        </div>

        {/* Servicios recientes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Trabajos recientes</h2>
          <div className="space-y-4">
            {ingresosDia?.trabajos && ingresosDia.trabajos.length > 0 ? (
              ingresosDia.trabajos.slice(0, 4).map((trabajo) => (
                <div key={trabajo.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{trabajo.cliente}</p>
                      <p className="text-sm text-gray-600">{trabajo.vehiculo}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(trabajo.total)}</p>
                      {/* <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        trabajo.estado === 'completado' 
                          ? 'bg-green-100 text-green-800'
                          : trabajo.estado === 'en_proceso'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {trabajo.estado === 'completado' ? 'Completado' : 
                         trabajo.estado === 'en_proceso' ? 'En proceso' : 'Pendiente'}
                      </span> */}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No hay trabajos recientes disponibles</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trabajos pendientes */}
      {serviciosPendientes && serviciosPendientes.totalPendientes > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Trabajos pendientes del día ({serviciosPendientes.totalPendientes})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviciosPendientes.trabajos.map((trabajo) => (
              <div key={trabajo.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{trabajo.cliente}</p>
                    <p className="text-sm text-gray-600">{trabajo.vehiculo}</p>
                    <p className="text-sm text-gray-500">Placa: {trabajo.placa}</p>
                  </div>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                    {trabajo.estado}
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Servicios:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {trabajo.servicios.map((servicio, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{servicio.nombre}</span>
                        <span>{formatCurrency(servicio.precio)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumen semanal */}
      {resumenSemana && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Resumen de la semana ({resumenSemana.semana})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(resumenSemana.resumen.ingresosTotales)}
              </p>
              <p className="text-gray-600">Ingresos totales</p>
            </div>
            {/* <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {resumenSemana.resumen.serviciosCompletados}
              </p>
              <p className="text-gray-600">Servicios completados</p>
            </div> */}
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {resumenSemana.resumen.clientesAtendidos}
              </p>
              <p className="text-gray-600">Clientes atendidos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">
                {resumenSemana.resumen.trabajosRealizados}
              </p>
              <p className="text-gray-600">Trabajos realizados</p>
            </div>
          </div>
        </div>
      )}

      {/* Información financiera */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GastosDelDiaCard />
        <ResumenFinancieroCard />
      </div>
    </div>
  );
};

export default Dashboard;
