import axios from 'axios';
import type { Marca, CreateMarcaDTO } from '../types/modelMarca';

const apiMarcas = axios.create({
  baseURL: 'http://vw4wg0so8cgs4ss840wwok00.46.62.225.65.sslip.io/api/marcas', // Ajusta la URL base según tu configuración
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getMarcas = async (): Promise<Marca[]> => {
  const res = await apiMarcas.get('');
  return res.data;
};

export const getMarcaById = async (id: number): Promise<Marca> => {
  const res = await apiMarcas.get(`/${id}`);
  return res.data;
};

export const createMarca = async (data: CreateMarcaDTO): Promise<Marca> => {
  const res = await apiMarcas.post('', data);
  return res.data;
};

export const updateMarca = async (id: number, data: CreateMarcaDTO): Promise<Marca> => {
  const res = await apiMarcas.put(`/${id}`, data);
  return res.data;
};

export const deleteMarca = async (id: number): Promise<void> => {
  await apiMarcas.delete(`/${id}`);
};
