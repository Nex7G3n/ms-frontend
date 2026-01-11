import axios from 'axios';
import type { Modelo, CreateModeloDTO } from '../types/modelModelo';

const apiModelos = axios.create({
  baseURL: 'http://vw4wg0so8cgs4ss840wwok00.46.62.225.65.sslip.io/api/modelos', // Ajusta la URL base según tu configuración
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getModelos = async (): Promise<Modelo[]> => {
  const res = await apiModelos.get('');
  return res.data;
};

export const getModeloById = async (id: number): Promise<Modelo> => {
  const res = await apiModelos.get(`/${id}`);
  return res.data;
};

export const createModelo = async (data: CreateModeloDTO): Promise<Modelo> => {
  const res = await apiModelos.post('', data);
  return res.data;
};

export const updateModelo = async (id: number, data: CreateModeloDTO): Promise<Modelo> => {
  const res = await apiModelos.put(`/${id}`, data);
  return res.data;
};

export const deleteModelo = async (id: number): Promise<void> => {
  await apiModelos.delete(`/${id}`);
};

export const getModelosByMarca = async (marcaId: number): Promise<Modelo[]> => {
  const res = await apiModelos.get(`/marca/${marcaId}`);
  return res.data;
};
