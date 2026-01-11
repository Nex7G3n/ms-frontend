import { piezasApi } from './api';
import type { Pieza, CreatePiezaDTO } from '../types/models';

export const getPiezas = async (): Promise<Pieza[]> => {
  const res = await piezasApi.getAll();
  return res.data;
};

export const getPiezaById = async (id: number): Promise<Pieza> => {
  const res = await piezasApi.getById(id);
  return res.data;
};

export const createPieza = async (data: CreatePiezaDTO): Promise<Pieza> => {
  const res = await piezasApi.create(data);
  return res.data;
};

export const updatePieza = async (id: number, data: CreatePiezaDTO): Promise<Pieza> => {
  const res = await piezasApi.update(id, data);
  return res.data;
};

export const deletePieza = async (id: number): Promise<void> => {
  await piezasApi.delete(id);
};
