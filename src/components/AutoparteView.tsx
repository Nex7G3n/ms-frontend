import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Package, X, Loader2, BoxIcon, DollarSign, Layers } from 'lucide-react';
import {
  getAutopartes,
  createAutoparte,
  updateAutoparte,
  deleteAutoparte,
  updateAutoparteStock,
} from '../services/apiAutopartes';
import type { Autoparte, AutoparteFormData } from '../types/modelAutoparte';
import type { CreateAutoparteDTO } from '../types/models';
import AutoparteModal from './AutoparteModal';
import ConfirmationModal from './ConfirmationModal';

interface StockUpdateModalProps {
  autoparte: Autoparte;
  onSave: (id: number, stock: number) => Promise<void>;
  onClose: () => void;
}

function StockUpdateModal({ autoparte, onSave, onClose }: StockUpdateModalProps) {
  const [newStock, setNewStock] = useState(autoparte.stock);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(autoparte.id, newStock);
      onClose();
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Error al actualizar el stock.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl max-w-md w-full shadow-2xl animate-scale-in">
        <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Actualizar Stock</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-slate-300">
                Producto: <span className="text-teal-400">{autoparte.codigoProducto}</span>
              </label>
              <span className="badge badge-info">
                Stock actual: {autoparte.stock}
              </span>
            </div>
            <input
              type="number"
              required
              min="0"
              value={newStock}
              onChange={(e) => setNewStock(parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
              placeholder="Nuevo stock"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-slate-300 bg-slate-700/50 rounded-xl hover:bg-slate-600/50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg shadow-teal-500/25 font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AutoparteView() {
  const [autopartes, setAutopartes] = useState<Autoparte[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAutoparte, setEditingAutoparte] = useState<Autoparte | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [autoparteToDelete, setAutoparteToDelete] = useState<number | null>(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [autoparteToUpdateStock, setAutoparteToUpdateStock] = useState<Autoparte | null>(null);

  const loadAutopartes = async () => {
    try {
      setLoading(true);
      const autopartesData = await getAutopartes();
      setAutopartes(autopartesData);
    } catch (error) {
      console.error('Error loading autopartes data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAutopartes();
  }, []);

  const handleCreate = () => {
    setEditingAutoparte(null);
    setShowModal(true);
  };

  const handleEdit = (autoparte: Autoparte) => {
    setEditingAutoparte(autoparte);
    setShowModal(true);
  };

  const handleDeleteClick = (idAutoparte: number) => {
    setAutoparteToDelete(idAutoparte);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (autoparteToDelete === null) return;

    try {
      await deleteAutoparte(autoparteToDelete);
      await loadAutopartes();
      setShowConfirmModal(false);
      setAutoparteToDelete(null);
    } catch (error) {
      console.error('Error deleting autoparte:', error);
      alert('Error al eliminar la autoparte');
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setAutoparteToDelete(null);
  };

  const handleSave = async (data: AutoparteFormData) => {
    try {
      // Transformar AutoparteFormData a CreateAutoparteDTO
      const createData: CreateAutoparteDTO = {
        codigoProducto: data.codigoProducto,
        modeloId: data.modelo.id,
        piezaId: data.pieza.id,
        precio: data.precio,
        stock: data.stock,
        estado: data.estado,
      };
      
      if (data.id) {
        await updateAutoparte(data.id, createData);
      } else {
        await createAutoparte(createData);
      }
      await loadAutopartes();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving autoparte:', error);
      throw error;
    }
  };

  const handleStockUpdateClick = (autoparte: Autoparte) => {
    setAutoparteToUpdateStock(autoparte);
    setShowStockModal(true);
  };

  const handleSaveStock = async (id: number, stock: number) => {
    try {
      await updateAutoparteStock(id, stock);
      await loadAutopartes();
      setShowStockModal(false);
      setAutoparteToUpdateStock(null);
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  };

  const filteredAutopartes = Array.isArray(autopartes) ? autopartes.filter((autoparte) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      searchQuery === '' ||
      autoparte.codigoProducto.toLowerCase().includes(searchLower) ||
      autoparte.modelo.nombre.toLowerCase().includes(searchLower) ||
      autoparte.pieza.nombre.toLowerCase().includes(searchLower) ||
      autoparte.estado.toLowerCase().includes(searchLower)
    );
  }) : [];

  const getStatusBadge = (estado: string) => {
    const statusConfig: Record<string, string> = {
      'DISPONIBLE': 'badge-success',
      'AGOTADO': 'badge-danger',
      'BAJO_STOCK': 'badge-warning',
      'DESCONTINUADO': 'badge-default',
    };
    return statusConfig[estado] || 'badge-default';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
        <p className="text-slate-400">Cargando autopartes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/25">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Gestión de Autopartes</h2>
            <p className="text-sm text-slate-400">Inventario y control de stock</p>
          </div>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-teal-500/25 font-medium cursor-pointer"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nueva Autoparte
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
        <input
          type="text"
          placeholder="Buscar por código, modelo, pieza o estado..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/20">
              <BoxIcon className="h-5 w-5 text-teal-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{filteredAutopartes.length}</p>
              <p className="text-xs text-slate-400">Total productos</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <Package className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {filteredAutopartes.filter(a => a.estado === 'DISPONIBLE').length}
              </p>
              <p className="text-xs text-slate-400">Disponibles</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <Layers className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {filteredAutopartes.reduce((acc, a) => acc + a.stock, 0)}
              </p>
              <p className="text-xs text-slate-400">Stock total</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <DollarSign className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                ${filteredAutopartes.reduce((acc, a) => acc + (a.precio * a.stock), 0).toLocaleString()}
              </p>
              <p className="text-xs text-slate-400">Valor inventario</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-hidden bg-slate-800/30 border border-slate-700/50 rounded-2xl">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Código
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Modelo
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Pieza
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Precio
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {filteredAutopartes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <Package className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 font-medium">No se encontraron autopartes</p>
                    <p className="text-slate-500 text-sm">Intenta con otros términos de búsqueda</p>
                  </td>
                </tr>
              ) : (
                filteredAutopartes.map((autoparte, index) => (
                  <tr 
                    key={autoparte.id} 
                    className="hover:bg-slate-700/20 transition-colors"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-white">{autoparte.codigoProducto}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {autoparte.modelo.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {autoparte.pieza.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-emerald-400">
                        ${autoparte.precio.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${autoparte.stock < 10 ? 'text-amber-400' : 'text-slate-300'}`}>
                        {autoparte.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${getStatusBadge(autoparte.estado)}`}>
                        {autoparte.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleStockUpdateClick(autoparte)}
                          className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-emerald-400 transition-colors"
                          title="Actualizar Stock"
                        >
                          <Layers className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(autoparte)}
                          className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-teal-400 transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(autoparte.id)}
                          className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-red-400 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredAutopartes.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-500">
            <Package className="h-16 w-16 mb-4 text-slate-600" />
            <p className="text-lg font-medium">No se encontraron autopartes</p>
          </div>
        ) : (
          filteredAutopartes.map((autoparte, index) => (
            <div 
              key={autoparte.id} 
              style={{ animationDelay: `${index * 50}ms` }}
              className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-2xl p-5 card-hover animate-fade-in"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate">{autoparte.codigoProducto}</h3>
                  <p className="text-sm text-slate-400 truncate">{autoparte.modelo.nombre}</p>
                </div>
                <span className={`badge ${getStatusBadge(autoparte.estado)} shrink-0 ml-2`}>
                  {autoparte.estado}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Pieza:</span>
                  <span className="text-slate-200 font-medium">{autoparte.pieza.nombre}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Precio:</span>
                  <span className="text-emerald-400 font-semibold">${autoparte.precio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Stock:</span>
                  <span className={`font-medium ${autoparte.stock < 10 ? 'text-amber-400' : 'text-slate-200'}`}>
                    {autoparte.stock} unidades
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-700/50">
                <button
                  onClick={() => handleStockUpdateClick(autoparte)}
                  className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                  title="Actualizar Stock"
                >
                  <Layers className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleEdit(autoparte)}
                  className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition-colors"
                  title="Editar"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteClick(autoparte.id)}
                  className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <AutoparteModal
          autoparte={editingAutoparte}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {showConfirmModal && (
        <ConfirmationModal
          message="¿Está seguro de eliminar esta autoparte?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {showStockModal && autoparteToUpdateStock && (
        <StockUpdateModal
          autoparte={autoparteToUpdateStock}
          onSave={handleSaveStock}
          onClose={() => setShowStockModal(false)}
        />
      )}
    </div>
  );
}
