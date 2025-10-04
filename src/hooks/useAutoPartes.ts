// src/hooks/useAutopartes.ts
import { useState, useEffect } from 'react';
import apiClient, { autopartesApi, marcasApi, modelosApi, piezasApi } from '../services/api';
import type { Autoparte, Marca, Modelo, Pieza } from '../types/models';

export const useAutopartes = () => {
  const [autopartes, setAutopartes] = useState<Autoparte[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAutopartes = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('[useAutopartes] baseURL =', (apiClient.defaults as any).baseURL);
      const response = await autopartesApi.getAll();
      console.log('[useAutopartes] GET /autopartes status', (response as any).status);
      let data: any = (response as any).data;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); console.log('[useAutopartes] data parsed from string'); } catch {}
      }
      console.log('[useMarcas] raw data typeof', typeof data, 'keys', data && typeof data === 'object' ? Object.keys(data) : 'n/a');
      try { console.log('[useMarcas] raw data preview', JSON.stringify(data).slice(0, 300)); } catch {}
      let list: any = Array.isArray(data)
        ? data
        : data?.content || data?.data?.content || data?.data || (data as any)?.autopartes;
      if (!Array.isArray(list) && data && typeof data === 'object') {
        const vals = Object.values(data as any);
        if (Array.isArray(vals) && vals.length && typeof vals[0] === 'object') list = vals;
      }
      setAutopartes(Array.isArray(list) ? (list as Autoparte[]) : []);
      console.log('[useAutopartes] normalized length', Array.isArray(list) ? list.length : 0);
    } catch (err: any) {
      setError(err.message || 'Error al cargar autopartes');
      console.error('[useAutopartes] error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutopartes();
  }, []);

  const deleteAutoparte = async (id: number) => {
    try {
      await autopartesApi.delete(id);
      setAutopartes(autopartes.filter(a => a.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al eliminar autoparte');
      return false;
    }
  };

  return { autopartes, loading, error, refetch: fetchAutopartes, deleteAutoparte };
};
export const useMarcas = () => {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMarcas = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('[useMarcas] baseURL =', (apiClient.defaults as any).baseURL);
      const response = await marcasApi.getAll();
      console.log('[useMarcas] GET /marcas status', (response as any).status);
      let data: any = (response as any).data;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); console.log('[useMarcas] parsed string data'); } catch {}
      }
      console.log('[useMarcas] raw typeof', typeof data, Array.isArray(data) ? 'isArray' : '');
      let list: any = Array.isArray(data)
        ? data
        : data?.content || data?.data?.content || data?.data || (data as any)?.marcas;
      if (!Array.isArray(list) && data && typeof data === 'object') {
        const vals = Object.values(data as any);
        if (Array.isArray(vals) && vals.length && typeof vals[0] === 'object' && 'id' in (vals[0] as any)) list = vals;
      }
      setMarcas(Array.isArray(list) ? (list as Marca[]) : []);
      console.log('[useMarcas] normalized length', Array.isArray(list) ? list.length : 0, 'raw isArray', Array.isArray(data));
    } catch (err: any) {
      setError(err.message || 'Error al cargar marcas');
      console.error('[useMarcas] error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarcas();
  }, []);

  return { marcas, loading, error, refetch: fetchMarcas };
};

export const useModelos = (marcaId?: number) => {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModelos = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('[useModelos] baseURL =', (apiClient.defaults as any).baseURL);
      const response = marcaId 
        ? await modelosApi.getByMarca(marcaId)
        : await modelosApi.getAll();
      console.log('[useModelos] GET /modelos status', (response as any).status, 'marcaId', marcaId);
      let data: any = (response as any).data;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); console.log('[useModelos] parsed string data'); } catch {}
      }
      console.log('[useModelos] raw typeof', typeof data, Array.isArray(data) ? 'isArray' : '');
      let list: any = Array.isArray(data)
        ? data
        : data?.content || data?.data?.content || data?.data || (data as any)?.modelos;
      if (!Array.isArray(list) && data && typeof data === 'object') {
        const vals = Object.values(data as any);
        if (Array.isArray(vals) && vals.length && typeof vals[0] === 'object' && 'id' in (vals[0] as any)) list = vals;
      }
      setModelos(Array.isArray(list) ? (list as Modelo[]) : []);
      console.log('[useModelos] normalized length', Array.isArray(list) ? list.length : 0);
    } catch (err: any) {
      setError(err.message || 'Error al cargar modelos');
      console.error('[useModelos] error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModelos();
  }, [marcaId]);

  return { modelos, loading, error, refetch: fetchModelos };
};

export const usePiezas = () => {
  const [piezas, setPiezas] = useState<Pieza[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPiezas = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('[usePiezas] baseURL =', (apiClient.defaults as any).baseURL);
      const response = await piezasApi.getAll();
      console.log('[usePiezas] GET /piezas status', (response as any).status);
      let data: any = (response as any).data;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); console.log('[usePiezas] parsed string data'); } catch {}
      }
      console.log('[usePiezas] raw typeof', typeof data, Array.isArray(data) ? 'isArray' : '');
      let list: any = Array.isArray(data)
        ? data
        : data?.content || data?.data?.content || data?.data || (data as any)?.piezas;
      if (!Array.isArray(list) && data && typeof data === 'object') {
        const vals = Object.values(data as any);
        if (Array.isArray(vals) && vals.length && typeof vals[0] === 'object' && 'id' in (vals[0] as any)) list = vals;
      }
      setPiezas(Array.isArray(list) ? (list as Pieza[]) : []);
      console.log('[usePiezas] normalized length', Array.isArray(list) ? list.length : 0);
    } catch (err: any) {
      setError(err.message || 'Error al cargar piezas');
      console.error('[usePiezas] error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPiezas();
  }, []);

  return { piezas, loading, error, refetch: fetchPiezas };
};