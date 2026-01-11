import { marcasApi } from './api';
import type { Marca, CreateMarcaDTO } from '../types/models';

export const getMarcas = async (): Promise<Marca[]> => {
  const res = await marcasApi.getAll();
  return res.data;
};

export const getMarcaById = async (id: number): Promise<Marca> => {
  const res = await marcasApi.getById(id);
  return res.data;
};

export const createMarca = async (data: CreateMarcaDTO): Promise<Marca> => {
  const res = await marcasApi.create(data);
  return res.data;
};

export const updateMarca = async (id: number, data: CreateMarcaDTO): Promise<Marca> => {
  const res = await marcasApi.update(id, data);
  return res.data;
};

export const deleteMarca = async (id: number): Promise<void> => {
  await marcasApi.delete(id);
};
