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
  marca: { id: number };
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

// Clientes y tipos relacionados
export interface Department {
  idDepartment: number;
  name: string;
}

export interface Province {
  idProvince: number;
  name: string;
  department: Department;
}

export interface District {
  idDistrict: number;
  name: string;
  province: Province;
}

export interface Address {
  idAddress?: number;
  street: string;
  number: string;
  reference?: string;
  district: District | { idDistrict: number };
}

export interface DocumentType {
  idDocumentType: number;
  name?: string;
  description?: string;
}

export interface Client {
  idClient: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentNumber: string;
  documentType: DocumentType;
  address: Address;
}

export interface CreateClientDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentNumber: string;
  documentType: { idDocumentType: number };
  address: {
    street: string;
    number: string;
    reference?: string;
    district: { idDistrict: number };
  };
}

export interface UpdateClientDTO extends Partial<CreateClientDTO> {
  idClient: number;
}