import { autopartesApi } from './api';
import type { Autoparte, CreateAutoparteDTO } from '../types/models';

export const getAutopartes = async (): Promise<Autoparte[]> => {
  const res = await autopartesApi.getAll();
  return res.data;
};

export const getAutoparteById = async (id: number): Promise<Autoparte> => {
  const res = await autopartesApi.getById(id);
  return res.data;
};

export const createAutoparte = async (data: CreateAutoparteDTO): Promise<Autoparte> => {
  const res = await autopartesApi.create(data);
  return res.data;
};

export const updateAutoparte = async (id: number, data: CreateAutoparteDTO): Promise<Autoparte> => {
  const res = await autopartesApi.update(id, data);
  return res.data;
};

export const deleteAutoparte = async (id: number): Promise<void> => {
  await autopartesApi.delete(id);
};

export const getAutoparteByCodigo = async (codigo: string): Promise<Autoparte> => {
  const res = await autopartesApi.searchByCodigo(codigo);
  return res.data;
};

export const getAutopartesByModelo = async (modeloId: number): Promise<Autoparte[]> => {
  const res = await autopartesApi.getByModelo(modeloId);
  return res.data;
};

export const getAutopartesByPieza = async (piezaId: number): Promise<Autoparte[]> => {
  const res = await autopartesApi.getByPieza(piezaId);
  return res.data;
};

export const updateAutoparteStock = async (id: number, stock: number): Promise<Autoparte> => {
  const res = await autopartesApi.updateStock(id, stock);
  return res.data;
};
