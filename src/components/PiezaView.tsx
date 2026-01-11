import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Wrench, Tag, FileText, Loader2, Grid3X3, List } from 'lucide-react';
import {
  getPiezas,
  createPieza,
  updatePieza,
  deletePieza,
} from '../services/apiPiezas';
import type { Pieza, CreatePiezaDTO, UpdatePiezaDTO } from '../types/modelPieza';
import PiezaModal from './PiezaModal';
import ConfirmationModal from './ConfirmationModal';

export default function PiezasView() {
  const [piezas, setPiezas] = useState<Pieza[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPieza, setEditingPieza] = useState<Pieza | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [piezaToDelete, setPiezaToDelete] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const piezasData = await getPiezas();
      setPiezas(piezasData);
    } catch (error) {
      console.error('Error loading piezas data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPieza(null);
    setShowModal(true);
  };

  const handleEdit = (pieza: Pieza) => {
    setEditingPieza(pieza);
    setShowModal(true);
  };

  const handleDeleteClick = (idPieza: number) => {
    setPiezaToDelete(idPieza);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (piezaToDelete === null) return;

    try {
      await deletePieza(piezaToDelete);
      await loadData();
      setShowConfirmModal(false);
      setPiezaToDelete(null);
    } catch (error) {
      console.error('Error deleting pieza:', error);
      alert('Error al eliminar la pieza');
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setPiezaToDelete(null);
  };

  const handleSave = async (data: CreatePiezaDTO) => {
    try {
      if (editingPieza) {
        const updateData: CreatePiezaDTO = {
          nombre: data.nombre,
          categoria: data.categoria,
          descripcion: data.descripcion,
        };
        await updatePieza(editingPieza.id, updateData);
      } else {
        await createPieza(data);
      }
      await loadData();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving pieza:', error);
      throw error;
    }
  };

  // Obtener categorías únicas
  const categories = Array.isArray(piezas) 
    ? [...new Set(piezas.map(p => p.categoria).filter(Boolean))]
    : [];

  const filteredPiezas = Array.isArray(piezas) ? piezas.filter((pieza) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' ||
      pieza.nombre.toLowerCase().includes(searchLower) ||
      (pieza.categoria && pieza.categoria.toLowerCase().includes(searchLower)) ||
      (pieza.descripcion && pieza.descripcion.toLowerCase().includes(searchLower));
    
    const matchesCategory = !selectedCategory || pieza.categoria === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) : [];

  // Colores para categorías
  const getCategoryColor = (categoria: string | undefined) => {
    if (!categoria) return 'from-slate-500 to-slate-600';
    const colors = [
      'from-amber-500 to-orange-500',
      'from-emerald-500 to-teal-500',
      'from-blue-500 to-cyan-500',
      'from-violet-500 to-purple-500',
      'from-rose-500 to-pink-500',
      'from-indigo-500 to-blue-500',
    ];
    const index = categories.indexOf(categoria) % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
        <p className="text-slate-400">Cargando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25">
            <Wrench className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Catálogo de Piezas</h2>
            <p className="text-sm text-slate-400">Administra tu catálogo de productos</p>
          </div>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-teal-500/25 font-medium cursor-pointer"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nueva Pieza
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nombre, categoría o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 rounded-lg transition-all ${
              viewMode === 'grid' 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Grid3X3 className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2.5 rounded-lg transition-all ${
              viewMode === 'list' 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !selectedCategory
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/25'
                : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 border border-slate-700/50'
            }`}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat || null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? `bg-gradient-to-r ${getCategoryColor(cat)} text-white shadow-lg`
                  : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 border border-slate-700/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Piezas Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPiezas.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-500">
              <Wrench className="h-16 w-16 mb-4 text-slate-600" />
              <p className="text-lg font-medium">No se encontraron piezas</p>
              <p className="text-sm">Intenta con otros términos de búsqueda</p>
            </div>
          ) : (
            filteredPiezas.map((pieza, index) => (
              <div
                key={pieza.id}
                style={{ animationDelay: `${index * 40}ms` }}
                className="group relative bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden card-hover animate-fade-in"
              >
                {/* Category Header */}
                <div className={`h-2 bg-gradient-to-r ${getCategoryColor(pieza.categoria)}`} />
                
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white truncate group-hover:text-teal-400 transition-colors">
                        {pieza.nombre}
                      </h3>
                      {pieza.categoria && (
                        <span className="inline-flex items-center gap-1 mt-2">
                          <Tag className="h-3.5 w-3.5 text-amber-500" />
                          <span className="text-xs text-slate-400">{pieza.categoria}</span>
                        </span>
                      )}
                    </div>
                    {/* Actions */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={() => handleEdit(pieza)}
                        className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-teal-400 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(pieza.id)}
                        className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {pieza.descripcion && (
                    <div className="flex items-start gap-2 text-sm text-slate-400 mt-3 pt-3 border-t border-slate-700/50">
                      <FileText className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                      <p className="line-clamp-2">{pieza.descripcion}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* List View */
        <div className="space-y-2">
          {filteredPiezas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <Wrench className="h-16 w-16 mb-4 text-slate-600" />
              <p className="text-lg font-medium">No se encontraron piezas</p>
            </div>
          ) : (
            filteredPiezas.map((pieza, index) => (
              <div
                key={pieza.id}
                style={{ animationDelay: `${index * 30}ms` }}
                className="group flex items-center gap-4 bg-gradient-to-r from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-xl p-4 card-hover animate-fade-in"
              >
                {/* Color indicator */}
                <div className={`w-1.5 h-12 rounded-full bg-gradient-to-b ${getCategoryColor(pieza.categoria)}`} />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-white group-hover:text-teal-400 transition-colors">
                      {pieza.nombre}
                    </h3>
                    {pieza.categoria && (
                      <span className="badge badge-warning">
                        {pieza.categoria}
                      </span>
                    )}
                  </div>
                  {pieza.descripcion && (
                    <p className="text-sm text-slate-400 mt-1 truncate">{pieza.descripcion}</p>
                  )}
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => handleEdit(pieza)}
                    className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(pieza.id)}
                    className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Counter */}
      <div className="text-center">
        <span className="text-sm text-slate-500">
          Mostrando {filteredPiezas.length} de {piezas.length} pieza{piezas.length !== 1 ? 's' : ''}
        </span>
      </div>

      {showModal && (
        <PiezaModal
          pieza={editingPieza}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {showConfirmModal && (
        <ConfirmationModal
          message="¿Está seguro de eliminar esta pieza?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}
