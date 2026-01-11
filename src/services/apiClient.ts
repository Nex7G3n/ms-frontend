// src/api/apiClient.ts
import axios from 'axios';
import type {
  Client,
  CreateClientDTO,
  Department,
  Province,
  District,
  DocumentType,
} from '../types/modelClient';

// ===============================
// ⚙️ Configuración base de Axios
// ===============================
const api = axios.create({
  baseURL: 'http://vw4wg0so8cgs4ss840wwok00.46.62.225.65.sslip.io/api', // Cambiado a la base general de la API
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===============================
// 👤 CLIENTES
// ===============================
export const getClients = async (page: number = 1, limit: number = 10, searchQuery: string = ''): Promise<{ data: Client[]; totalPages: number }> => {
  const params = new URLSearchParams();
  // La API del usuario devuelve un array directamente sin paginación en el objeto de respuesta.
  // Ajustamos la llamada para que coincida con la estructura esperada por el frontend.
  // Si la API no soporta paginación, los parámetros 'page' y 'limit' pueden ser ignorados por el backend.
  // Para simular la paginación en el frontend, podemos tomar una porción del array.
  // Sin embargo, para el propósito de mostrar los datos, asumiremos que la API devuelve todos los clientes
  // y que totalPages es 1 si no hay información de paginación explícita.
  // Si la API realmente soporta paginación, se debería ajustar el backend para devolver { data: [], totalPages: N }.
  // Por ahora, para que el frontend funcione, adaptamos la respuesta.

  // Si la API no usa los parámetros de paginación, simplemente llamamos al endpoint base.
  // Si la API espera los parámetros, los incluimos. Basado en el error 404, parece que sí los espera.
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (searchQuery) {
    params.append('search', searchQuery);
  }

  const res = await api.get(`/clients?${params.toString()}`);
  const clientsData: Client[] = res.data; // La API devuelve directamente el array de clientes

  // Adaptar la respuesta al formato esperado por el frontend
  return {
    data: clientsData,
    totalPages: 1, // Asumimos 1 página si la API no proporciona información de paginación
  };
};

export const getClientById = async (id: number): Promise<Client> => {
  const res = await api.get(`/clients/${id}`);
  return res.data;
};

export const createClient = async (data: CreateClientDTO): Promise<Client> => {
  const res = await api.post('/clients', data);
  return res.data;
};

export const updateClient = async (id: number, data: CreateClientDTO): Promise<Client> => {
  const res = await api.put(`/clients/${id}`, data);
  return res.data;
};

export const deleteClient = async (id: number): Promise<void> => {
  await api.delete(`/clients/${id}`);
};

// ===============================
// 🏛️ DEPARTAMENTOS
// ===============================
export const getDepartments = async (): Promise<Department[]> => {
  const res = await api.get('/clients/departments');
  return res.data;
};

// ===============================
// 🏙️ PROVINCIAS
// ===============================
export const getProvinces = async (): Promise<Province[]> => {
  const res = await api.get('/clients/provinces');
  return res.data;
};

// ===============================
// 🏘️ DISTRITOS
// ===============================
export const getDistricts = async (): Promise<District[]> => {
  const res = await api.get('/clients/districts');
  return res.data;
};

// ===============================
// 🪪 TIPOS DE DOCUMENTO
// ===============================
export const getDocumentTypes = async (): Promise<DocumentType[]> => {
  const res = await api.get('/clients/document-types');
  return res.data;
};
