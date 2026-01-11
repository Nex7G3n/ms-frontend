import type { Modelo } from './modelModelo'; // Importar la interfaz Modelo completa

export interface Marca {
  id: number;
  nombre: string;
  paisOrigen?: string;
  modelos?: Modelo[]; // Lista de modelos asociados, usando la interfaz completa
}

export interface CreateMarcaDTO {
  nombre: string;
  paisOrigen?: string;
}

export interface UpdateMarcaDTO extends Partial<CreateMarcaDTO> {
  id: number;
}
