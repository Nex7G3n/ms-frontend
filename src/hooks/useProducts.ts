import { useState, useMemo } from 'react';
import type { Autoparte } from '../types/models';

interface ProductFilters {
  searchQuery: string;
  marcaId?: number;
  modeloId?: number;
  piezaId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

interface SortOption {
  field: 'precio' | 'codigoProducto' | 'stock';
  direction: 'asc' | 'desc';
}

export function useProducts(products: Autoparte[]) {
  const [filters, setFilters] = useState<ProductFilters>({
    searchQuery: '',
  });
  const [sortOption, setSortOption] = useState<SortOption>({
    field: 'codigoProducto',
    direction: 'asc',
  });

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Aplicar filtros
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          (p.codigoProducto?.toLowerCase() || '').includes(query) ||
          (p.modelo?.nombre?.toLowerCase() || '').includes(query) ||
          (p.pieza?.nombre?.toLowerCase() || '').includes(query) ||
          (p.pieza?.categoria?.toLowerCase() || '').includes(query)
      );
    }

    if (filters.marcaId) {
      filtered = filtered.filter(p => p.modelo?.marca?.id === filters.marcaId);
    }

    if (filters.modeloId) {
      filtered = filtered.filter(p => p.modelo?.id === filters.modeloId);
    }

    if (filters.piezaId) {
      filtered = filtered.filter(p => p.pieza?.id === filters.piezaId);
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(p => p.precio >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.precio <= filters.maxPrice!);
    }

    if (filters.inStock) {
      filtered = filtered.filter(p => p.stock > 0 && p.estado === 'DISPONIBLE');
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortOption.field) {
        case 'precio':
          aValue = a.precio;
          bValue = b.precio;
          break;
        case 'codigoProducto':
          aValue = a.codigoProducto;
          bValue = b.codigoProducto;
          break;
        case 'stock':
          aValue = a.stock;
          bValue = b.stock;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOption.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOption.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [products, filters, sortOption]);

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ searchQuery: '' });
  };

  return {
    filteredProducts: filteredAndSortedProducts,
    filters,
    sortOption,
    updateFilter,
    setSortOption,
    clearFilters,
  };
}
