import type { 
  Servicio, 
  CreateServicioDto, 
  UpdateServicioDto, 
  HojaTrabajo, 
  CreateHojaTrabajoDto, 
  UpdateHojaTrabajoDto, 
  AgregarServicioDto, 
  HojaTrabajoDetalle,
  IngresosDiaResponse,
  ServiciosCompletadosResponse,
  ClientesAtendidosResponse,
  ServiciosPendientesResponse,
  IngresosPorSemanaResponse,
  IngresosPorMesResponse,
  ResumenSemanaResponse,
  EstadisticasGeneralesResponse,
  IngresosPorMetodoPagoResponse,
  Gasto,
  CreateGastoDto,
  UpdateGastoDto,
  EstadisticasGastosResponse,
  GastosDelDiaResponse,
  ResumenFinancieroResponse
} from '../types';

const API_BASE_URL = 'http://localhost:3000';

export class ServiciosApi {
  private static baseUrl = `${API_BASE_URL}/servicios`;

  static async obtenerTodos(): Promise<Servicio[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error(`Error al obtener servicios: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener servicios:', error);
      throw error;
    }
  }

  static async obtenerPorId(id: number): Promise<Servicio> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        throw new Error(`Error al obtener servicio: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener servicio:', error);
      throw error;
    }
  }

  static async crear(servicio: CreateServicioDto): Promise<Servicio> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(servicio),
      });
      if (!response.ok) {
        throw new Error(`Error al crear servicio: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al crear servicio:', error);
      throw error;
    }
  }

  static async actualizar(id: number, servicio: UpdateServicioDto): Promise<Servicio> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(servicio),
      });
      if (!response.ok) {
        throw new Error(`Error al actualizar servicio: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al actualizar servicio:', error);
      throw error;
    }
  }

  static async desactivar(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error al desactivar servicio: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error al desactivar servicio:', error);
      throw error;
    }
  }

  static async poblarIniciales(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/seed`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`Error al poblar servicios: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error al poblar servicios:', error);
      throw error;
    }
  }
}

export class HojasTrabajoApi {
  private static baseUrl = `${API_BASE_URL}/hoja-trabajo`;

  static async obtenerTodas(): Promise<HojaTrabajo[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error(`Error al obtener hojas de trabajo: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener hojas de trabajo:', error);
      throw error;
    }
  }

  static async obtenerPorId(id: number): Promise<HojaTrabajo> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        throw new Error(`Error al obtener hoja de trabajo: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener hoja de trabajo:', error);
      throw error;
    }
  }

  static async crear(hojaTrabajo: CreateHojaTrabajoDto): Promise<HojaTrabajo> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hojaTrabajo),
      });
      if (!response.ok) {
        throw new Error(`Error al crear hoja de trabajo: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al crear hoja de trabajo:', error);
      throw error;
    }
  }

  static async actualizar(id: number, hojaTrabajo: UpdateHojaTrabajoDto): Promise<HojaTrabajo> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hojaTrabajo),
      });
      if (!response.ok) {
        throw new Error(`Error al actualizar hoja de trabajo: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al actualizar hoja de trabajo:', error);
      throw error;
    }
  }

  static async eliminar(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error al eliminar hoja de trabajo: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error al eliminar hoja de trabajo:', error);
      throw error;
    }
  }

  static async agregarServicio(hojaTrabajoId: number, servicioData: AgregarServicioDto): Promise<HojaTrabajoDetalle> {
    try {
      const response = await fetch(`${this.baseUrl}/${hojaTrabajoId}/servicios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(servicioData),
      });
      if (!response.ok) {
        throw new Error(`Error al agregar servicio: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al agregar servicio:', error);
      throw error;
    }
  }

  static async removerServicio(hojaTrabajoId: number, detalleId: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${hojaTrabajoId}/servicios/${detalleId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error al remover servicio: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error al remover servicio:', error);
      throw error;
    }
  }

  static async actualizarComentarioServicio(
    hojaTrabajoId: number, 
    detalleId: number, 
    comentario: string
  ): Promise<HojaTrabajoDetalle> {
    try {
      const response = await fetch(`${this.baseUrl}/${hojaTrabajoId}/servicios/${detalleId}/comentario`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comentario }),
      });
      if (!response.ok) {
        throw new Error(`Error al actualizar comentario: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al actualizar comentario:', error);
      throw error;
    }
  }

  static async actualizarServicios(
    hojaTrabajoId: number, 
    servicios: Array<{ servicioId: number; comentario?: string; precio?: number }>
  ): Promise<HojaTrabajo> {
    try {
      const response = await fetch(`${this.baseUrl}/${hojaTrabajoId}/servicios`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ servicios }),
      });
      if (!response.ok) {
        throw new Error(`Error al actualizar servicios: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al actualizar servicios:', error);
      throw error;
    }
  }
}

// Dashboard API
export class DashboardApi {
  private static baseUrl = `${API_BASE_URL}/dashboard`;

  static async obtenerIngresosDia(fecha?: string): Promise<IngresosDiaResponse> {
    try {
      const url = fecha ? `${this.baseUrl}/ingresos-dia?fecha=${fecha}` : `${this.baseUrl}/ingresos-dia`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al obtener ingresos del día: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener ingresos del día:', error);
      throw error;
    }
  }

  static async obtenerServiciosCompletadosSemana(fecha?: string): Promise<ServiciosCompletadosResponse> {
    try {
      const url = fecha ? `${this.baseUrl}/servicios-completados-semana?fecha=${fecha}` : `${this.baseUrl}/servicios-completados-semana`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al obtener servicios completados: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener servicios completados:', error);
      throw error;
    }
  }

  static async obtenerClientesAtendidosSemana(fecha?: string): Promise<ClientesAtendidosResponse> {
    try {
      const url = fecha ? `${this.baseUrl}/clientes-atendidos-semana?fecha=${fecha}` : `${this.baseUrl}/clientes-atendidos-semana`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al obtener clientes atendidos: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener clientes atendidos:', error);
      throw error;
    }
  }

  static async obtenerServiciosPendientesDia(fecha?: string): Promise<ServiciosPendientesResponse> {
    try {
      const url = fecha ? `${this.baseUrl}/servicios-pendientes-dia?fecha=${fecha}` : `${this.baseUrl}/servicios-pendientes-dia`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al obtener servicios pendientes: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener servicios pendientes:', error);
      throw error;
    }
  }

  static async obtenerIngresosPorSemana(fecha?: string): Promise<IngresosPorSemanaResponse> {
    try {
      const url = fecha ? `${this.baseUrl}/ingresos-por-semana?fecha=${fecha}` : `${this.baseUrl}/ingresos-por-semana`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al obtener ingresos por semana: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener ingresos por semana:', error);
      throw error;
    }
  }

  static async obtenerIngresosPorMes(fecha?: string): Promise<IngresosPorMesResponse> {
    try {
      const url = fecha ? `${this.baseUrl}/ingresos-por-mes?fecha=${fecha}` : `${this.baseUrl}/ingresos-por-mes`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al obtener ingresos por mes: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener ingresos por mes:', error);
      throw error;
    }
  }

  static async obtenerResumenSemana(fecha?: string): Promise<ResumenSemanaResponse> {
    try {
      const url = fecha ? `${this.baseUrl}/resumen-semana?fecha=${fecha}` : `${this.baseUrl}/resumen-semana`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al obtener resumen de semana: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener resumen de semana:', error);
      throw error;
    }
  }

  static async obtenerEstadisticasGenerales(): Promise<EstadisticasGeneralesResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/estadisticas-generales`);
      if (!response.ok) {
        throw new Error(`Error al obtener estadísticas generales: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener estadísticas generales:', error);
      throw error;
    }
  }

  static async obtenerIngresosPorMetodoPago(fecha?: string): Promise<IngresosPorMetodoPagoResponse> {
    try {
      const url = fecha ? `${this.baseUrl}/ingresos-por-metodo-pago?fecha=${fecha}` : `${this.baseUrl}/ingresos-por-metodo-pago`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al obtener ingresos por método de pago: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener ingresos por método de pago:', error);
      throw error;
    }
  }

  static async obtenerGastosDelDia(fecha?: string): Promise<GastosDelDiaResponse> {
    try {
      const url = fecha ? `${this.baseUrl}/gastos-dia?fecha=${fecha}` : `${this.baseUrl}/gastos-dia`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al obtener gastos del día: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener gastos del día:', error);
      throw error;
    }
  }

  static async obtenerResumenFinanciero(fecha?: string): Promise<ResumenFinancieroResponse> {
    try {
      const url = fecha ? `${this.baseUrl}/resumen-financiero?fecha=${fecha}` : `${this.baseUrl}/resumen-financiero`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al obtener resumen financiero: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener resumen financiero:', error);
      throw error;
    }
  }
}

export class GastosApi {
  private static baseUrl = `${API_BASE_URL}/gastos`;

  // CRUD Básico
  static async obtenerTodos(): Promise<Gasto[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error(`Error al obtener gastos: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener gastos:', error);
      throw error;
    }
  }

  static async obtenerPorId(id: number): Promise<Gasto> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        throw new Error(`Error al obtener gasto: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener gasto:', error);
      throw error;
    }
  }

  static async crear(gasto: CreateGastoDto): Promise<Gasto> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gasto),
      });
      if (!response.ok) {
        throw new Error(`Error al crear gasto: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al crear gasto:', error);
      throw error;
    }
  }

  static async actualizar(id: number, gasto: UpdateGastoDto): Promise<Gasto> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gasto),
      });
      if (!response.ok) {
        throw new Error(`Error al actualizar gasto: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al actualizar gasto:', error);
      throw error;
    }
  }

  static async eliminar(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error al eliminar gasto: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error al eliminar gasto:', error);
      throw error;
    }
  }

  // Consultas Avanzadas
  static async obtenerEstadisticas(): Promise<EstadisticasGastosResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/estadisticas`);
      if (!response.ok) {
        throw new Error(`Error al obtener estadísticas: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }

  static async obtenerPorPeriodo(fechaInicio: string, fechaFin: string): Promise<Gasto[]> {
    try {
      const url = `${this.baseUrl}/periodo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al obtener gastos por período: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener gastos por período:', error);
      // Fallback: obtener todos los gastos y filtrar por fecha en el frontend
      try {
        const todosGastos = await this.obtenerTodos();
        // Crear fechas sin problemas de zona horaria
        const [startYear, startMonth, startDay] = fechaInicio.split('-');
        const [endYear, endMonth, endDay] = fechaFin.split('-');
        const start = new Date(parseInt(startYear), parseInt(startMonth) - 1, parseInt(startDay));
        const end = new Date(parseInt(endYear), parseInt(endMonth) - 1, parseInt(endDay));
        end.setHours(23, 59, 59, 999); // Incluir todo el día final
        
        return todosGastos.filter(gasto => {
          const fechaGasto = new Date(gasto.created_at);
          return fechaGasto >= start && fechaGasto <= end;
        });
      } catch (fallbackError) {
        console.error('Error en fallback obtenerPorPeriodo:', fallbackError);
        throw error;
      }
    }
  }

  static async obtenerTotalPorPeriodo(fechaInicio: string, fechaFin: string): Promise<{ total: number }> {
    try {
      const url = `${this.baseUrl}/total-periodo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al obtener total por período: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener total por período:', error);
      // Fallback: calcular desde los gastos del período
      try {
        const gastos = await this.obtenerPorPeriodo(fechaInicio, fechaFin);
        const total = gastos.reduce((sum, gasto) => sum + (gasto.monto || 0), 0);
        return { total };
      } catch (fallbackError) {
        console.error('Error en fallback obtenerTotalPorPeriodo:', fallbackError);
        return { total: 0 };
      }
    }
  }

  static async obtenerDelMes(año: number, mes: number): Promise<Gasto[]> {
    try {
      const url = `${this.baseUrl}/mes?año=${año}&mes=${mes}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al obtener gastos del mes: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener gastos del mes:', error);
      // Fallback: obtener todos los gastos y filtrar por mes en el frontend
      try {
        const todosGastos = await this.obtenerTodos();
        return todosGastos.filter(gasto => {
          const fechaGasto = new Date(gasto.created_at);
          return fechaGasto.getFullYear() === año && fechaGasto.getMonth() === mes - 1; // mes - 1 porque getMonth() es 0-based
        });
      } catch (fallbackError) {
        console.error('Error en fallback obtenerDelMes:', fallbackError);
        throw error;
      }
    }
  }
}
