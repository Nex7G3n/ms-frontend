import { useState, useEffect } from 'react';
import { X, Package, Car, Wrench, DollarSign, Layers, Activity, Loader2, AlertCircle } from 'lucide-react';
import type { Autoparte, AutoparteFormData } from '../types/modelAutoparte';
import type { Modelo } from '../types/modelModelo';
import type { Pieza } from '../types/modelPieza';
import { getModelos } from '../services/apiModelos';
import { getPiezas } from '../services/apiPiezas';

interface AutoparteModalProps {
  autoparte: Autoparte | null;
  onSave: (data: AutoparteFormData) => Promise<void>;
  onClose: () => void;
}

export default function AutoparteModal({
  autoparte,
  onSave,
  onClose,
}: AutoparteModalProps) {
  const [formData, setFormData] = useState<AutoparteFormData>({
    codigoProducto: '',
    modelo: { id: 0 },
    pieza: { id: 0 },
    precio: 0,
    stock: 0,
    estado: '',
  });
  const [saving, setSaving] = useState(false);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [piezas, setPiezas] = useState<Pieza[]>([]);
  const [loadingDependencies, setLoadingDependencies] = useState(true);

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const loadedModelos = await getModelos();
        const loadedPiezas = await getPiezas();
        setModelos(loadedModelos);
        setPiezas(loadedPiezas);
      } catch (error) {
        console.error('Error loading dependencies:', error);
        alert('Error al cargar modelos o piezas.');
      } finally {
        setLoadingDependencies(false);
      }
    };
    loadDependencies();
  }, []);

  useEffect(() => {
    if (autoparte) {
      setFormData({
        id: autoparte.id,
        codigoProducto: autoparte.codigoProducto,
        modelo: { id: autoparte.modelo.id },
        pieza: { id: autoparte.pieza.id },
        precio: autoparte.precio,
        stock: autoparte.stock,
        estado: autoparte.estado,
      });
    } else {
      setFormData({
        codigoProducto: '',
        modelo: { id: 0 },
        pieza: { id: 0 },
        precio: 0,
        stock: 0,
        estado: '',
      });
    }
  }, [autoparte]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validaciones mejoradas
      if (!formData.modelo?.id || formData.modelo.id === 0) {
        alert('Por favor, seleccione un modelo válido.');
        setSaving(false);
        return;
      }
      
      if (!formData.pieza?.id || formData.pieza.id === 0) {
        alert('Por favor, seleccione una pieza válida.');
        setSaving(false);
        return;
      }

      if (!formData.codigoProducto || formData.codigoProducto.trim() === '') {
        alert('Por favor, ingrese un código de producto.');
        setSaving(false);
        return;
      }

      if (formData.precio <= 0) {
        alert('El precio debe ser mayor a 0.');
        setSaving(false);
        return;
      }

      if (formData.stock < 0) {
        alert('El stock no puede ser negativo.');
        setSaving(false);
        return;
      }

      // Asegurar que el estado esté en el formato correcto
      if (!formData.estado || formData.estado.trim() === '') {
        formData.estado = 'DISPONIBLE';
      } else {
        formData.estado = formData.estado.toUpperCase();
      }

      await onSave(formData);
    } catch (error: any) {
      console.error('Error saving autoparte:', error);
      console.error('Error details:', error.response?.data); // Debug adicional
      const errorMessage = error.response?.data?.message || error.message || 'Error al guardar la autoparte';
      alert(`Error: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all";
  const selectClasses = "w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all appearance-none cursor-pointer";
  const labelClasses = "block text-sm font-medium text-slate-300 mb-2";

  const estados = ['DISPONIBLE', 'AGOTADO', 'BAJO_STOCK', 'DESCONTINUADO'];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500">
              <Package className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {autoparte ? 'Editar Autoparte' : 'Nueva Autoparte'}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-160px)]">
          {/* Código de producto */}
          <div>
            <label className={labelClasses}>
              <span className="flex items-center gap-2">
                <Package className="h-4 w-4 text-slate-400" />
                Código de Producto
              </span>
            </label>
            <input
              type="text"
              required
              value={formData.codigoProducto}
              onChange={(e) => setFormData({ ...formData, codigoProducto: e.target.value })}
              className={inputClasses}
              placeholder="Ej: AP-001, PART-2024..."
            />
          </div>

          {/* Modelo y Pieza en grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>
                <span className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-slate-400" />
                  Modelo
                </span>
              </label>
              {loadingDependencies ? (
                <div className="flex items-center gap-2 text-slate-400 py-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Cargando...</span>
                </div>
              ) : modelos.length === 0 ? (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span className="text-xs">No hay modelos</span>
                </div>
              ) : (
                <select
                  required
                  value={formData.modelo.id}
                  onChange={(e) => setFormData({ ...formData, modelo: { id: parseInt(e.target.value) } })}
                  className={selectClasses}
                >
                  <option value="0" disabled>Seleccionar</option>
                  {modelos.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className={labelClasses}>
                <span className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-slate-400" />
                  Pieza
                </span>
              </label>
              {loadingDependencies ? (
                <div className="flex items-center gap-2 text-slate-400 py-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Cargando...</span>
                </div>
              ) : piezas.length === 0 ? (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span className="text-xs">No hay piezas</span>
                </div>
              ) : (
                <select
                  required
                  value={formData.pieza.id}
                  onChange={(e) => setFormData({ ...formData, pieza: { id: parseInt(e.target.value) } })}
                  className={selectClasses}
                >
                  <option value="0" disabled>Seleccionar</option>
                  {piezas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Precio y Stock en grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>
                <span className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                  Precio
                </span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.precio === 0 ? '' : formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) || 0 })}
                className={inputClasses}
                placeholder="0.00"
              />
            </div>

            <div>
              <label className={labelClasses}>
                <span className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-slate-400" />
                  Stock
                </span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.stock === 0 ? '' : formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className={inputClasses}
                placeholder="0"
              />
            </div>
          </div>

          {/* Estado */}
          <div>
            <label className={labelClasses}>
              <span className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-slate-400" />
                Estado
              </span>
            </label>
            <select
              required
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              className={selectClasses}
            >
              <option value="" disabled>Seleccionar estado</option>
              {estados.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-slate-700/50 bg-slate-800/50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-slate-300 bg-slate-700/50 rounded-xl hover:bg-slate-600/50 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || loadingDependencies || modelos.length === 0 || piezas.length === 0 || formData.modelo.id === 0 || formData.pieza.id === 0}
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
      </div>
    </div>
  );
}
