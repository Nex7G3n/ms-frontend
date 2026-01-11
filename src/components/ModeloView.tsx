import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Calendar, Tag, Loader2, Car } from 'lucide-react';
import {
  getModelos,
  getModelosByMarca,
  createModelo,
  updateModelo,
  deleteModelo,
} from '../services/apiModelos';
import { getMarcas } from '../services/apiMarcas';
import type { Modelo, CreateModeloDTO, UpdateModeloDTO } from '../types/modelModelo';
import type { Marca } from '../types/modelMarca';
import ModeloModal from './ModeloModal';
import ConfirmationModal from './ConfirmationModal';

interface ModeloViewProps {
  selectedMarcaId: number | null;
  marcas: Marca[];
}

export default function ModeloView({ selectedMarcaId, marcas }: ModeloViewProps) {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingModelo, setEditingModelo] = useState<Modelo | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modeloToDelete, setModeloToDelete] = useState<number | null>(null);

  const loadModelos = async () => {
    try {
      setLoading(true);
      const modelosData = selectedMarcaId ? await getModelosByMarca(selectedMarcaId) : await getModelos();
      setModelos(modelosData);
    } catch (error) {
      console.error('Error loading modelos data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModelos();
  }, [selectedMarcaId]);

  const handleCreate = () => {
    setEditingModelo(null);
    setShowModal(true);
  };

  const handleEdit = (modelo: Modelo) => {
    setEditingModelo(modelo);
    setShowModal(true);
  };

  const handleDeleteClick = (idModelo: number) => {
    setModeloToDelete(idModelo);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (modeloToDelete === null) return;

    try {
      await deleteModelo(modeloToDelete);
      await loadModelos();
      setShowConfirmModal(false);
      setModeloToDelete(null);
    } catch (error) {
      console.error('Error deleting modelo:', error);
      alert('Error al eliminar el modelo');
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setModeloToDelete(null);
  };

  const handleSave = async (data: CreateModeloDTO) => {
    try {
      if (editingModelo) {
        const updateData: CreateModeloDTO = {
          nombre: data.nombre,
          anio: data.anio,
          marca: data.marca,
        };
        await updateModelo(editingModelo.id, updateData);
      } else {
        await createModelo(data);
      }
      await loadModelos();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving modelo:', error);
      throw error;
    }
  };

  const filteredModelos = Array.isArray(modelos) ? modelos.filter((modelo) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      searchQuery === '' ||
      modelo.nombre.toLowerCase().includes(searchLower) ||
      (modelo.anio && modelo.anio.toLowerCase().includes(searchLower)) ||
      modelo.marca.nombre.toLowerCase().includes(searchLower)
    );
  }) : [];

  const selectedMarca = selectedMarcaId ? marcas.find(m => m.id === selectedMarcaId) : null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
        <p className="text-slate-400">Cargando modelos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white">
            {selectedMarca ? (
              <span className="flex items-center gap-2">
                Modelos de
                <span className="text-violet-400">{selectedMarca.nombre}</span>
              </span>
            ) : (
              'Todos los Modelos'
            )}
          </h3>
          {selectedMarca && (
            <p className="text-xs text-slate-500 mt-0.5">
              Mostrando modelos filtrados por marca
            </p>
          )}
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all shadow-lg shadow-violet-500/25 font-medium cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Nuevo Modelo
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Buscar modelo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
        />
      </div>

      {/* Modelos Grid */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {filteredModelos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Car className="h-12 w-12 mb-3 text-slate-600" />
            <p className="font-medium">No se encontraron modelos</p>
            {selectedMarca && (
              <p className="text-sm text-slate-600 mt-1">
                Intenta seleccionar otra marca o añade un modelo nuevo
              </p>
            )}
          </div>
        ) : (
          filteredModelos.map((modelo, index) => (
            <div
              key={modelo.id}
              style={{ animationDelay: `${index * 30}ms` }}
              className="group bg-slate-700/30 border border-slate-600/30 rounded-xl p-4 hover:bg-slate-700/50 hover:border-slate-500/50 transition-all duration-300 animate-fade-in"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-white">
                      {modelo.nombre}
                    </h4>
                    <span className="badge badge-info">
                      <Calendar className="h-3 w-3 mr-1" />
                      {modelo.anio}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Tag className="h-3.5 w-3.5 text-slate-500" />
                    <span className="text-xs text-slate-400">
                      {modelo.marca.nombre}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(modelo)}
                    className="p-2 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-violet-400 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(modelo.id)}
                    className="p-2 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info badge */}
      <div className="text-center">
        <span className="text-xs text-slate-500">
          {filteredModelos.length} modelo{filteredModelos.length !== 1 ? 's' : ''} encontrado{filteredModelos.length !== 1 ? 's' : ''}
        </span>
      </div>

      {showModal && (
        <ModeloModal
          modelo={editingModelo}
          marcas={marcas}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {showConfirmModal && (
        <ConfirmationModal
          message="¿Está seguro de eliminar este modelo?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}
