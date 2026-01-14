import { X } from 'lucide-react';
import type { Marca, Modelo, Pieza } from '../../types/models';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  marcas: Marca[];
  modelos: Modelo[];
  piezas: Pieza[];
  filters: {
    marcaId?: number;
    modeloId?: number;
    piezaId?: number;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  };
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
}

export default function FilterSidebar({
  isOpen,
  onClose,
  marcas,
  modelos,
  piezas,
  filters,
  onFilterChange,
  onClearFilters,
}: FilterSidebarProps) {
  if (!isOpen) return null;

  const filteredModelos = filters.marcaId
    ? modelos.filter(m => m.marca.id === filters.marcaId)
    : modelos;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 bottom-0 w-80 bg-slate-900 z-50 border-l border-slate-700/50 overflow-y-auto lg:static lg:z-auto lg:w-64">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Filtros</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Marca */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">Marca</label>
            <select
              value={filters.marcaId || ''}
              onChange={(e) => onFilterChange('marcaId', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              <option value="">Todas las marcas</option>
              {marcas.map((marca) => (
                <option key={marca.id} value={marca.id}>
                  {marca.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Modelo */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">Modelo</label>
            <select
              value={filters.modeloId || ''}
              onChange={(e) => onFilterChange('modeloId', e.target.value ? Number(e.target.value) : undefined)}
              disabled={!filters.marcaId}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Todos los modelos</option>
              {filteredModelos.map((modelo) => (
                <option key={modelo.id} value={modelo.id}>
                  {modelo.nombre} ({modelo.anio})
                </option>
              ))}
            </select>
          </div>

          {/* Pieza */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">Pieza</label>
            <select
              value={filters.piezaId || ''}
              onChange={(e) => onFilterChange('piezaId', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              <option value="">Todas las piezas</option>
              {piezas.map((pieza) => (
                <option key={pieza.id} value={pieza.id}>
                  {pieza.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Precio */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">Precio</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => onFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => onFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>
          </div>

          {/* Stock */}
          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock || false}
                onChange={(e) => onFilterChange('inStock', e.target.checked)}
                className="w-4 h-4 rounded bg-slate-800/50 border-slate-700/50 text-teal-500 focus:ring-teal-500/50"
              />
              <span className="text-sm text-slate-300">Solo disponibles</span>
            </label>
          </div>

          {/* Clear Filters */}
          <button
            onClick={onClearFilters}
            className="w-full px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
    </>
  );
}
