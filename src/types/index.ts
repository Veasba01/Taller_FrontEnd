// Tipos de datos basados en la API Documentation

export interface Servicio {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  activo: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateServicioDto {
  nombre: string;
  descripcion?: string;
  precio: number;
  activo?: boolean;
}

export interface UpdateServicioDto {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  activo?: boolean;
}

export interface HojaTrabajo {
  id: number;
  cliente?: string;
  vehiculo?: string;
  placa?: string;
  telefono?: string;
  observaciones?: string;
  estado: 'pendiente' | 'en_proceso' | 'completado' | 'entregado';
  metodo_pago: 'pendiente' | 'sinpe' | 'tarjeta' | 'efectivo';
  total: number;
  detalles: HojaTrabajoDetalle[];
  created_at: Date;
  updated_at: Date;
}

export interface HojaTrabajoDetalle {
  id: number;
  hojaTrabajoId: number;
  servicioId: number;
  precio: number;
  comentario?: string;
  completado: boolean;
  servicio: Servicio;
  created_at: Date;
  updated_at: Date;
}

export interface CreateHojaTrabajoDto {
  cliente?: string;
  vehiculo?: string;
  placa?: string;
  telefono?: string;
  observaciones?: string;
  metodo_pago?: 'pendiente' | 'sinpe' | 'tarjeta' | 'efectivo';
  servicios?: Array<{
    servicioId: number;
    comentario?: string;
    precio?: number; // 🆕 Campo para precios personalizados
  }>;
}

export interface UpdateHojaTrabajoDto {
  cliente?: string;
  vehiculo?: string;
  placa?: string;
  telefono?: string;
  observaciones?: string;
  estado?: 'pendiente' | 'en_proceso' | 'completado' | 'entregado';
  metodo_pago?: 'pendiente' | 'sinpe' | 'tarjeta' | 'efectivo';
}

export interface UpdateHojaTrabajoConServiciosDto {
  cliente?: string;
  vehiculo?: string;
  placa?: string;
  telefono?: string;
  observaciones?: string;
  estado?: 'pendiente' | 'en_proceso' | 'completado' | 'entregado';
  metodo_pago?: 'pendiente' | 'sinpe' | 'tarjeta' | 'efectivo';
  servicios?: Array<{
    servicioId: number;
    comentario?: string;
    precio?: number; // 🆕 Campo para precios personalizados
  }>;
}

export interface AgregarServicioDto {
  servicioId: number;
  comentario?: string;
  precio?: number; // 🆕 Campo para precios personalizados
}

// Dashboard Types
export interface IngresosDiaResponse {
  fecha: string;
  ingresos: number;
  cantidadTrabajos: number;
  trabajos: Array<{
    id: number;
    cliente: string;
    vehiculo: string;
    total: number;
    estado: string;
  }>;
}

export interface ServiciosCompletadosResponse {
  semana: string;
  totalServicios: number;
  servicios: Array<{
    nombre: string;
    cantidad: number;
    ingresos: number;
  }>;
}

export interface ClientesAtendidosResponse {
  semana: string;
  totalClientes: number;
  totalTrabajos: number;
  clientes: Array<{
    nombre: string;
    cantidadTrabajos: number;
    totalGastado: number;
  }>;
}

export interface ServiciosPendientesResponse {
  fecha: string;
  totalPendientes: number;
  trabajos: Array<{
    id: number;
    cliente: string;
    vehiculo: string;
    placa: string;
    estado: string;
    servicios: Array<{
      nombre: string;
      precio: number;
      completado: boolean;
    }>;
  }>;
}

export interface IngresosPorSemanaResponse {
  semana: string;
  totalSemana: number;
  ingresosPorDia: Array<{
    fecha: string;
    dia: string;
    ingresos: number;
    cantidadTrabajos: number;
  }>;
}

export interface IngresosPorMesResponse {
  mes: string;
  año: number;
  totalMes: number;
  ingresosPorDia: Array<{
    fecha: string;
    dia: number;
    ingresos: number;
    cantidadTrabajos: number;
  }>;
}

export interface ResumenSemanaResponse {
  semana: string;
  resumen: {
    ingresosTotales: number;
    serviciosCompletados: number;
    clientesAtendidos: number;
    trabajosRealizados: number;
  };
  detalles: {
    ingresosPorDia: Array<{
      fecha: string;
      dia: string;
      ingresos: number;
      cantidadTrabajos: number;
    }>;
    serviciosMasRealizados: Array<{
      nombre: string;
      cantidad: number;
      ingresos: number;
    }>;
    clientesConMasTrabajos: Array<{
      nombre: string;
      cantidadTrabajos: number;
      totalGastado: number;
    }>;
  };
}

export interface EstadisticasGeneralesResponse {
  totales: {
    trabajos: number;
    clientes: number;
    servicios: number;
    ingresos: number;
  };
  estados: {
    completados: number;
    pendientes: number;
    porcentajeCompletados: string;
  };
}

// Nuevas interfaces para método de pago
export interface MetodoPagoResponse {
  metodo: string;
  cantidad: number;
  ingresos: number;
  porcentaje: number;
}

export interface IngresosPorMetodoPagoResponse {
  fecha: string;
  metodos: MetodoPagoResponse[];
  totalIngresos: number;
}

// Interfaces para Gastos
export interface Gasto {
  id: number;
  monto: number;
  comentario?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateGastoDto {
  monto: number;
  comentario?: string;
}

export interface UpdateGastoDto {
  monto?: number;
  comentario?: string;
}

export interface GastosPorPeriodoDto {
  fechaInicio: string;
  fechaFin: string;
}

export interface EstadisticasGastosResponse {
  totalGastos: number;
  cantidadGastos: number;
  gastoPromedio: number;
  gastoMayor: number;
  gastoMenor: number;
}

export interface GastosDelDiaResponse {
  fecha: string;
  totalGastos: number;
  cantidadGastos: number;
  gastos: Gasto[];
}

export interface ResumenFinancieroResponse {
  fecha: string;
  ingresos: number;
  gastos: number;
  utilidad: number;
  margenUtilidad: number;
}

export interface GastosPorSemanaResponse {
  semana: {
    inicio: string;
    fin: string;
    numeroSemana: number;
    año: number;
  };
  totalGastos: number;
  cantidadGastos: number;
  gastoPromedio: number;
  gastosPorDia: Array<{
    fecha: string;
    totalGastos: number;
    cantidadGastos: number;
    gastos: Gasto[];
  }>;
}

export interface FiltroSemanaDto {
  año: number;
  semana: number;
}

// Tipos para Cierre de Caja
export interface ServicioRealizadoResumen {
  nombre: string;
  cantidad: number;
  total: number;
}

export interface DetalleGasto {
  descripcion: string;
  monto: number;
}

export interface ResumenCierreResponse {
  fecha: string;
  totalIngresos: number;
  totalGastos: number;
  saldoFinal: number;
  detalleIngresos: {
    cantidadServicios: number;
    serviciosRealizados: ServicioRealizadoResumen[];
  };
  detalleGastos: DetalleGasto[];
}

export interface CierreCajaResponse {
  fecha: string;
  totalIngresos: number;
  totalGastos: number;
  saldoFinal: number;
  createdAt: string;
  updatedAt: string;
}
