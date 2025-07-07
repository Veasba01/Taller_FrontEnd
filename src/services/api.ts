import type { Servicio, CreateServicioDto, UpdateServicioDto } from '../types';

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
