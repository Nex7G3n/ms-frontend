import { useState, useEffect } from 'react';
import apiClient, { clientsApi } from '../services/api';
import type { Client } from '../types/models';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('[useClients] baseURL =', (apiClient.defaults as any).baseURL);
      const response = await clientsApi.getAll();
      console.log('[useClients] GET /clients status', (response as any).status);
      let data: any = (response as any).data;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); console.log('[useClients] parsed string data'); } catch {}
      }
      let list: any = Array.isArray(data)
        ? data
        : data?.content || data?.data?.content || data?.data || (data as any)?.clients;
      if (!Array.isArray(list) && data && typeof data === 'object') {
        const vals = Object.values(data as any);
        if (Array.isArray(vals) && vals.length && typeof vals[0] === 'object') list = vals;
      }
      setClients(Array.isArray(list) ? (list as Client[]) : []);
      console.log('[useClients] normalized length', Array.isArray(list) ? list.length : 0);
    } catch (err: any) {
      setError(err.message || 'Error al cargar clientes');
      console.error('[useClients] error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const deleteClient = async (id: number) => {
    try {
      await clientsApi.delete(id);
      setClients(clients.filter(c => c.idClient !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al eliminar cliente');
      return false;
    }
  };

  return { clients, loading, error, refetch: fetchClients, deleteClient };
};

export default useClients;
