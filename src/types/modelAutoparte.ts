import type { Modelo } from './modelModelo';
import type { Pieza } from './modelPieza';

export interface Autoparte {
  id: number;
  codigoProducto: string;
  modelo: Modelo;
  pieza: Pieza;
  precio: number;
  stock: number;
  estado: string;
}

export interface AutoparteFormData {
  id?: number;
  codigoProducto: string;
  modelo: { id: number }; // Cambiado para enviar un objeto con el ID del modelo
  pieza: { id: number };  // Cambiado para enviar un objeto con el ID de la pieza
  precio: number;
  stock: number;
  estado: string;
}
