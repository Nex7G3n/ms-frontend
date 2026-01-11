import axios from 'axios';
import type { Autoparte, AutoparteFormData } from '../types/modelAutoparte';

const apiAutopartes = axios.create({
  baseURL: 'http://vw4wg0so8cgs4ss840wwok00.46.62.225.65.sslip.io/api/autopartes', // Ajusta la URL base según tu configuración
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAutopartes = async (): Promise<Autoparte[]> => {
  const res = await apiAutopartes.get('');
  return res.data;
};

export const getAutoparteById = async (id: number): Promise<Autoparte> => {
  const res = await apiAutopartes.get(`/${id}`);
  return res.data;
};

export const createAutoparte = async (data: AutoparteFormData): Promise<Autoparte> => {
  const res = await apiAutopartes.post('', data);
  return res.data;
};

export const updateAutoparte = async (id: number, data: AutoparteFormData): Promise<Autoparte> => {
  const res = await apiAutopartes.put(`/${id}`, data);
  return res.data;
};

export const deleteAutoparte = async (id: number): Promise<void> => {
  await apiAutopartes.delete(`/${id}`);
};

export const getAutoparteByCodigo = async (codigo: string): Promise<Autoparte> => {
  const res = await apiAutopartes.get(`/codigo/${codigo}`);
  return res.data;
};

export const getAutopartesByModelo = async (modeloId: number): Promise<Autoparte[]> => {
  const res = await apiAutopartes.get(`/modelo/${modeloId}`);
  return res.data;
};

export const getAutopartesByPieza = async (piezaId: number): Promise<Autoparte[]> => {
  const res = await apiAutopartes.get(`/pieza/${piezaId}`);
  return res.data;
};

export const updateAutoparteStock = async (id: number, stock: number): Promise<Autoparte> => {
  const res = await apiAutopartes.patch(`/${id}/stock?stock=${stock}`);
  return res.data;
};
