import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Globe, CheckCircle2, Loader2 } from 'lucide-react';
import {
  getMarcas,
  createMarca,
  updateMarca,
  deleteMarca,
} from '../services/apiMarcas';
import type { Marca, CreateMarcaDTO, UpdateMarcaDTO } from '../types/modelMarca';
import MarcaModal from './MarcaModal';
import ConfirmationModal from './ConfirmationModal';

interface MarcaViewProps {
  marcas: Marca[];
  onSelectMarca: (marcaId: number | null) => void;
  onMarcaChange: () => void;
  selectedMarcaId?: number | null;
}

export default function MarcaView({ marcas, onSelectMarca, onMarcaChange, selectedMarcaId }: MarcaViewProps) {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMarca, setEditingMarca] = useState<Marca | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [marcaToDelete, setMarcaToDelete] = useState<number | null>(null);

  useEffect(() => {
    setLoading(false);
  }, [marcas]);

  const handleCreate = () => {
    setEditingMarca(null);
    setShowModal(true);
  };

  const handleEdit = (marca: Marca) => {
    setEditingMarca(marca);
    setShowModal(true);
  };

  const handleDeleteClick = (idMarca: number) => {
    setMarcaToDelete(idMarca);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (marcaToDelete === null) return;

    try {
      await deleteMarca(marcaToDelete);
      onMarcaChange();
      setShowConfirmModal(false);
      setMarcaToDelete(null);
    } catch (error) {
      console.error('Error deleting marca:', error);
      alert('Error al eliminar la marca');
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setMarcaToDelete(null);
  };

  const handleSave = async (data: CreateMarcaDTO) => {
    try {
      if (editingMarca) {
        const updateData: CreateMarcaDTO = {
          nombre: data.nombre,
          paisOrigen: data.paisOrigen,
        };
        await updateMarca(editingMarca.id, updateData);
      } else {
        await createMarca(data);
      }
      onMarcaChange();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving marca:', error);
      throw error;
    }
  };

  const filteredMarcas = Array.isArray(marcas) ? marcas.filter((marca) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      searchQuery === '' ||
      marca.nombre.toLowerCase().includes(searchLower) ||
      (marca.paisOrigen && marca.paisOrigen.toLowerCase().includes(searchLower))
    );
  }) : [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
        <p className="text-slate-400">Cargando marcas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-lg font-bold text-white">Marcas</h3>
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all shadow-lg shadow-violet-500/25 font-medium cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Nueva Marca
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Buscar marca..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
        />
      </div>

      {/* Marcas List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {filteredMarcas.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p>No se encontraron marcas</p>
          </div>
        ) : (
          filteredMarcas.map((marca, index) => {
            const isSelected = selectedMarcaId === marca.id;
            return (
              <div
                key={marca.id}
                onClick={() => onSelectMarca(marca.id)}
                style={{ animationDelay: `${index * 30}ms` }}
                className={`
                  group relative p-4 rounded-xl cursor-pointer transition-all duration-300 animate-fade-in
                  ${isSelected 
                    ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 border-2 border-violet-500/50 shadow-lg shadow-violet-500/10' 
                    : 'bg-slate-700/30 border border-slate-600/30 hover:bg-slate-700/50 hover:border-slate-500/50'}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {isSelected && (
                      <CheckCircle2 className="h-5 w-5 text-violet-400 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold truncate ${isSelected ? 'text-violet-300' : 'text-white'}`}>
                        {marca.nombre}
                      </h4>
                      {marca.paisOrigen && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <Globe className="h-3.5 w-3.5 text-slate-500" />
                          <span className="text-xs text-slate-400">{marca.paisOrigen}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEdit(marca); }}
                      className="p-2 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-violet-400 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteClick(marca.id); }}
                      className="p-2 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Info badge */}
      <div className="text-center">
        <span className="text-xs text-slate-500">
          {filteredMarcas.length} marca{filteredMarcas.length !== 1 ? 's' : ''} encontrada{filteredMarcas.length !== 1 ? 's' : ''}
        </span>
      </div>

      {showModal && (
        <MarcaModal
          marca={editingMarca}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {showConfirmModal && (
        <ConfirmationModal
          message="¿Está seguro de eliminar esta marca?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}
