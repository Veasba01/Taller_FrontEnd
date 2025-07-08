import type { Servicio, CreateServicioDto, UpdateServicioDto, HojaTrabajo, CreateHojaTrabajoDto, UpdateHojaTrabajoDto, AgregarServicioDto, HojaTrabajoDetalle } from '../types';

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
    servicios: Array<{ servicioId: number; comentario?: string }>
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
