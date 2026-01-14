import { useState, useEffect } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import ShopLayout from '../components/shop/ShopLayout';
import ProductCard from '../components/shop/ProductCard';
import SearchBar from '../components/shop/SearchBar';
import FilterSidebar from '../components/shop/FilterSidebar';
import { useAutopartes, useMarcas, useModelos, usePiezas } from '../hooks/useAutoPartes';
import { useProducts } from '../hooks/useProducts';
import { Loader2 } from 'lucide-react';

export default function Shop() {
  const { autopartes, loading } = useAutopartes();
  const { marcas } = useMarcas();
  const { modelos } = useModelos();
  const { piezas } = usePiezas();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchParams] = useSearchParams();
  
  // Obtener query de búsqueda de URL
  const urlSearchQuery = searchParams.get('search') || '';

  const {
    filteredProducts,
    filters,
    updateFilter,
    clearFilters,
  } = useProducts(autopartes);

  // Sincronizar búsqueda de URL con filtros
  useEffect(() => {
    if (urlSearchQuery) {
      updateFilter('searchQuery', urlSearchQuery);
    }
  }, [urlSearchQuery]);

  if (loading) {
    return (
      <ShopLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
          <p className="text-slate-400">Cargando productos...</p>
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Catálogo de Autopartes</h1>
          <p className="text-slate-400">Encuentra las autopartes que necesitas</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={filters.searchQuery}
              onChange={(value) => updateFilter('searchQuery', value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white hover:bg-slate-700/50 transition-colors flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filtros</span>
            </button>
            <div className="flex bg-slate-800/50 border border-slate-700/50 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-teal-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-teal-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <FilterSidebar
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            marcas={marcas}
            modelos={modelos}
            piezas={piezas}
            filters={filters}
            onFilterChange={updateFilter}
            onClearFilters={clearFilters}
          />

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400 text-lg">No se encontraron productos</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-teal-400 hover:text-teal-300"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                <p className="text-slate-400 mb-4">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                </p>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                      : 'space-y-4'
                  }
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
