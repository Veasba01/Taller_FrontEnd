import React from 'react';

const Dashboard: React.FC = () => {
  // Datos de ejemplo para las métricas
  const dailyStats = {
    revenue: 6250000, // 6,250,000 colones
    services: 8,
    customers: 12,
    pendingServices: 5
  };

  const weeklyStats = [
    { day: 'Lun', revenue: 4250000, services: 6 },
    { day: 'Mar', revenue: 6000000, services: 9 },
    { day: 'Mie', revenue: 4900000, services: 7 },
    { day: 'Jue', revenue: 7600000, services: 11 },
    { day: 'Vie', revenue: 9250000, services: 14 },
    { day: 'Sab', revenue: 11000000, services: 16 },
    { day: 'Dom', revenue: 3000000, services: 4 }
  ];

  const recentServices = [
    { id: 1, customer: 'Juan Pérez', vehicle: 'Toyota Corolla 2020', service: 'Cambio de aceite', amount: 400000, status: 'Completado' },
    { id: 2, customer: 'María García', vehicle: 'Honda Civic 2019', service: 'Revisión general', amount: 750000, status: 'En proceso' },
    { id: 3, customer: 'Carlos López', vehicle: 'Ford Focus 2021', service: 'Cambio de frenos', amount: 1100000, status: 'Pendiente' },
    { id: 4, customer: 'Ana Martínez', vehicle: 'Chevrolet Spark 2018', service: 'Alineación y balanceo', amount: 300000, status: 'Completado' },
  ];

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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen de actividades del taller</p>
      </div>

      {/* Métricas diarias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Ingresos del día"
          value={`₡${dailyStats.revenue.toLocaleString()}`}
          subtitle="Hasta el momento"
          icon="💰"
          color="text-green-600"
        />
        <StatCard
          title="Servicios completados"
          value={dailyStats.services}
          subtitle="Hoy"
          icon="✅"
          color="text-blue-600"
        />
        <StatCard
          title="Clientes atendidos"
          value={dailyStats.customers}
          subtitle="Hoy"
          icon="👥"
          color="text-purple-600"
        />
        <StatCard
          title="Servicios pendientes"
          value={dailyStats.pendingServices}
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
            {weeklyStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-600 w-8">{stat.day}</span>
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-2 w-32">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(stat.revenue / 12000000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">₡{stat.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{stat.services} servicios</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Servicios recientes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Servicios recientes</h2>
          <div className="space-y-4">
            {recentServices.map((service) => (
              <div key={service.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{service.customer}</p>
                    <p className="text-sm text-gray-600">{service.vehicle}</p>
                    <p className="text-sm text-gray-500">{service.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₡{service.amount.toLocaleString()}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      service.status === 'Completado' 
                        ? 'bg-green-100 text-green-800'
                        : service.status === 'En proceso'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {service.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resumen semanal */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen de la semana</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              ₡{weeklyStats.reduce((acc, day) => acc + day.revenue, 0).toLocaleString()}
            </p>
            <p className="text-gray-600">Ingresos totales</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {weeklyStats.reduce((acc, day) => acc + day.services, 0)}
            </p>
            <p className="text-gray-600">Servicios realizados</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">
              ₡{Math.round(weeklyStats.reduce((acc, day) => acc + day.revenue, 0) / weeklyStats.reduce((acc, day) => acc + day.services, 0)).toLocaleString()}
            </p>
            <p className="text-gray-600">Promedio por servicio</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
