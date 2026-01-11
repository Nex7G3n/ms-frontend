import axios from 'axios';
import type { Pieza, CreatePiezaDTO } from '../types/modelPieza';

const apiPiezas = axios.create({
  baseURL: 'http://vw4wg0so8cgs4ss840wwok00.46.62.225.65.sslip.io/api/piezas', // Ajusta la URL base según tu configuración
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getPiezas = async (): Promise<Pieza[]> => {
  const res = await apiPiezas.get('');
  return res.data;
};

export const getPiezaById = async (id: number): Promise<Pieza> => {
  const res = await apiPiezas.get(`/${id}`);
  return res.data;
};

export const createPieza = async (data: CreatePiezaDTO): Promise<Pieza> => {
  const res = await apiPiezas.post('', data);
  return res.data;
};

export const updatePieza = async (id: number, data: CreatePiezaDTO): Promise<Pieza> => {
  const res = await apiPiezas.put(`/${id}`, data);
  return res.data;
};

export const deletePieza = async (id: number): Promise<void> => {
  await apiPiezas.delete(`/${id}`);
};
