import { modelosApi } from './api';
import type { Modelo, CreateModeloDTO } from '../types/models';

export const getModelos = async (): Promise<Modelo[]> => {
  const res = await modelosApi.getAll();
  return res.data;
};

export const getModeloById = async (id: number): Promise<Modelo> => {
  const res = await modelosApi.getById(id);
  return res.data;
};

export const createModelo = async (data: CreateModeloDTO): Promise<Modelo> => {
  const res = await modelosApi.create(data);
  return res.data;
};

export const updateModelo = async (id: number, data: CreateModeloDTO): Promise<Modelo> => {
  const res = await modelosApi.update(id, data);
  return res.data;
};

export const deleteModelo = async (id: number): Promise<void> => {
  await modelosApi.delete(id);
};

export const getModelosByMarca = async (marcaId: number): Promise<Modelo[]> => {
  const res = await modelosApi.getByMarca(marcaId);
  return res.data;
};
