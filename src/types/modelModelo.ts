import type { Marca } from './modelMarca';
// Asumiendo una interfaz básica para Autoparte, si se necesita más detalle, se puede expandir.
export interface Autoparte {
  id: number;
  nombre: string;
  // Otros campos de Autoparte si son relevantes para la vista de Modelo
}

export interface Modelo {
  id: number;
  nombre: string;
  anio?: string;
  marca: Marca; // Objeto Marca completo
  autopartes?: Autoparte[]; // Lista de autopartes asociadas, puede ser opcional
}

export interface CreateModeloDTO {
  nombre: string;
  anio?: string;
  marca: { id: number }; // Se envía un objeto marca con solo el ID
}

export interface UpdateModeloDTO extends Partial<Omit<CreateModeloDTO, 'marca'>> {
  id: number;
  marca?: { id: number }; // Se envía un objeto marca con solo el ID
}
