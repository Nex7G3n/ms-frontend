// Asumiendo una interfaz básica para Autoparte, si se necesita más detalle, se puede expandir.
export interface Autoparte {
  id: number;
  nombre: string;
  // Otros campos de Autoparte si son relevantes para la vista de Pieza
}

export interface Pieza {
  id: number;
  nombre: string;
  categoria?: string;
  descripcion?: string;
  autopartes?: Autoparte[]; // Lista de autopartes asociadas, puede ser opcional si no siempre se carga
}

export interface CreatePiezaDTO {
  nombre: string;
  categoria?: string;
  descripcion?: string;
}

export interface UpdatePiezaDTO extends Partial<CreatePiezaDTO> {
  id: number;
}
