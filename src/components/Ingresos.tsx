import React from 'react';
import { MetodosPagoStats } from './MetodosPagoStats';
import { ServiciosRealizados } from './ServiciosRealizados';
import { IngresosServicios } from './IngresosServicios';

export const Ingresos: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Ingresos</h1>
        <p className="text-gray-600 mb-8">
          Aquí puedes ver las estadísticas de ingresos por método de pago y analizar el rendimiento financiero del taller.
        </p>
      </div>

      {/* Estadísticas de métodos de pago */}
      <MetodosPagoStats />

      {/* Ingresos por servicio */}
      <IngresosServicios />

      {/* Servicios realizados */}
      <ServiciosRealizados />
    </div>
  );
};
