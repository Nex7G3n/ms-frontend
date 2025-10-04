// src/services/api.ts
import axios from 'axios';
import type {
  Autoparte,
  Marca,
  Modelo,
  Pieza,
  CreateAutoparteDTO,
  CreateMarcaDTO,
  CreateModeloDTO,
  CreatePiezaDTO,
} from '../types/models';

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'https://nonloxodromic-harriette-inertly.ngrok-free.dev/api/auto';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // Bypass ngrok browser warning page that returns HTML instead of JSON
    'ngrok-skip-browser-warning': 'true',
  },
});

// Debug: confirmar URL base efectiva en consola del navegador
if (typeof window !== 'undefined') {
  // Evitar spamear: solo una vez por carga
  (window as any).__API_BASE_LOGGED__ || console.log('[API] baseURL =', API_BASE_URL);
  (window as any).__API_BASE_LOGGED__ = true;
}

// Interceptor para agregar token de autenticación si existe
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// AUTOPARTES
export const autopartesApi = {
  getAll: () => apiClient.get<Autoparte[]>('/autopartes', { params: { t: Date.now() } }),
  getById: (id: number) => apiClient.get<Autoparte>(`/autopartes/${id}`),
  create: (data: CreateAutoparteDTO) => {
    // Transformar el DTO para que coincida con lo que espera el backend
    const payload = {
      codigoProducto: data.codigoProducto,
      modelo: { id: data.modeloId },
      pieza: { id: data.piezaId },
      precio: data.precio,
      stock: data.stock,
      estado: data.estado,
    };
    return apiClient.post<Autoparte>('/autopartes', payload);
  },
  update: (id: number, data: Partial<CreateAutoparteDTO>) => {
    const payload: any = {
      codigoProducto: data.codigoProducto,
      precio: data.precio,
      stock: data.stock,
      estado: data.estado,
    };
    if (data.modeloId) payload.modelo = { id: data.modeloId };
    if (data.piezaId) payload.pieza = { id: data.piezaId };
    return apiClient.put<Autoparte>(`/autopartes/${id}`, payload);
  },
  updateStock: (id: number, stock: number) => 
    apiClient.patch<Autoparte>(`/autopartes/${id}/stock?stock=${stock}`),
  delete: (id: number) => apiClient.delete(`/autopartes/${id}`),
  searchByCodigo: (codigo: string) => 
    apiClient.get<Autoparte>(`/autopartes/codigo/${codigo}`),
  getByModelo: (modeloId: number) => 
    apiClient.get<Autoparte[]>(`/autopartes/modelo/${modeloId}`),
  getByPieza: (piezaId: number) => 
    apiClient.get<Autoparte[]>(`/autopartes/pieza/${piezaId}`),
};

// MARCAS
export const marcasApi = {
  // Forzar URL absoluta para depuración: asegura que pega exactamente al endpoint esperado
  getAll: () => apiClient.get<Marca[]>(`${API_BASE_URL}/marcas`, { params: { t: Date.now() } }),
  getById: (id: number) => apiClient.get<Marca>(`/marcas/${id}`),
  create: (data: CreateMarcaDTO) => apiClient.post<Marca>('/marcas', data),
  update: (id: number, data: Partial<CreateMarcaDTO>) => 
    apiClient.put<Marca>(`/marcas/${id}`, data),
  delete: (id: number) => apiClient.delete(`/marcas/${id}`),
};

// MODELOS
export const modelosApi = {
  getAll: () => apiClient.get<Modelo[]>('/modelos', { params: { t: Date.now() } }),
  getById: (id: number) => apiClient.get<Modelo>(`/modelos/${id}`),
  getByMarca: (marcaId: number) => 
    apiClient.get<Modelo[]>(`/modelos/marca/${marcaId}`),
  create: (data: CreateModeloDTO) => {
    const payload = {
      nombre: data.nombre,
      anio: data.anio,
      marca: { id: data.marcaId },
    };
    return apiClient.post<Modelo>('/modelos', payload);
  },
  update: (id: number, data: Partial<CreateModeloDTO>) => {
    const payload: any = {
      nombre: data.nombre,
      anio: data.anio,
    };
    if (data.marcaId) payload.marca = { id: data.marcaId };
    return apiClient.put<Modelo>(`/modelos/${id}`, payload);
  },
  delete: (id: number) => apiClient.delete(`/modelos/${id}`),
};

// PIEZAS
export const piezasApi = {
  getAll: () => apiClient.get<Pieza[]>('/piezas', { params: { t: Date.now() } }),
  getById: (id: number) => apiClient.get<Pieza>(`/piezas/${id}`),
  getByCategoria: (categoria: string) => 
    apiClient.get<Pieza[]>(`/piezas/categoria/${categoria}`),
  create: (data: CreatePiezaDTO) => apiClient.post<Pieza>('/piezas', data),
  update: (id: number, data: Partial<CreatePiezaDTO>) => 
    apiClient.put<Pieza>(`/piezas/${id}`, data),
  delete: (id: number) => apiClient.delete(`/piezas/${id}`),
};

export default apiClient;