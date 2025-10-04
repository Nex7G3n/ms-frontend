// src/types/models.ts

export interface Marca {
  id: number;
  nombre: string;
  paisOrigen: string;
  modelos?: Modelo[];
}

export interface Modelo {
  id: number;
  nombre: string;
  anio: string;
  marca: Marca;
  autopartes?: Autoparte[];
}

export interface Pieza {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  autopartes?: Autoparte[];
}

export interface Autoparte {
  id: number;
  codigoProducto: string;
  modelo: Modelo;
  pieza: Pieza;
  precio: number;
  stock: number;
  estado: string;
}

// DTOs para creación/actualización
export interface CreateAutoparteDTO {
  codigoProducto: string;
  modeloId: number;
  piezaId: number;
  precio: number;
  stock: number;
  estado: string;
}

export interface CreateMarcaDTO {
  nombre: string;
  paisOrigen: string;
}

export interface CreateModeloDTO {
  nombre: string;
  anio: string;
  marcaId: number;
}

export interface CreatePiezaDTO {
  nombre: string;
  categoria: string;
  descripcion: string;
}

// Tipos de respuesta de la API
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}