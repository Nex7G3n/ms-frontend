import { useState, useEffect } from 'react';
import { X, Wrench, Tag, FileText, Loader2 } from 'lucide-react';
import type { Pieza, CreatePiezaDTO } from '../types/modelPieza';

interface PiezaModalProps {
  pieza: Pieza | null;
  onSave: (data: CreatePiezaDTO) => Promise<void>;
  onClose: () => void;
}

export default function PiezaModal({
  pieza,
  onSave,
  onClose,
}: PiezaModalProps) {
  const [formData, setFormData] = useState<CreatePiezaDTO>({
    nombre: '',
    categoria: '',
    descripcion: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (pieza) {
      setFormData({
        nombre: pieza.nombre,
        categoria: pieza.categoria || '',
        descripcion: pieza.descripcion || '',
      });
    } else {
      setFormData({
        nombre: '',
        categoria: '',
        descripcion: '',
      });
    }
  }, [pieza]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving pieza:', error);
      alert('Error al guardar la pieza');
    } finally {
      setSaving(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all";
  const labelClasses = "block text-sm font-medium text-slate-300 mb-2";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl max-w-md w-full shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {pieza ? 'Editar Pieza' : 'Nueva Pieza'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className={labelClasses}>
              Nombre de la Pieza
            </label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className={inputClasses}
              placeholder="Ej: Filtro de aceite, Pastillas de freno..."
            />
          </div>

          <div>
            <label className={labelClasses}>
              <span className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-slate-400" />
                Categoría (opcional)
              </span>
            </label>
            <input
              type="text"
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              className={inputClasses}
              placeholder="Ej: Motor, Frenos, Suspensión..."
            />
          </div>

          <div>
            <label className={labelClasses}>
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-400" />
                Descripción (opcional)
              </span>
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={3}
              className={`${inputClasses} resize-none`}
              placeholder="Describe las características de la pieza..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4">
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
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/25 font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
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
