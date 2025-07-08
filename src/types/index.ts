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
  observaciones?: string;
  estado: 'pendiente' | 'en_proceso' | 'completado' | 'entregado';
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
  observaciones?: string;
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
  observaciones?: string;
  estado?: 'pendiente' | 'en_proceso' | 'completado' | 'entregado';
}

export interface UpdateHojaTrabajoConServiciosDto {
  cliente?: string;
  vehiculo?: string;
  placa?: string;
  observaciones?: string;
  estado?: 'pendiente' | 'en_proceso' | 'completado' | 'entregado';
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
