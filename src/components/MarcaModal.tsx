import { useState, useEffect } from 'react';
import { X, Car, Globe, Loader2 } from 'lucide-react';
import type { Marca, CreateMarcaDTO } from '../types/modelMarca';

interface MarcaModalProps {
  marca: Marca | null;
  onSave: (data: CreateMarcaDTO) => Promise<void>;
  onClose: () => void;
}

export default function MarcaModal({
  marca,
  onSave,
  onClose,
}: MarcaModalProps) {
  const [formData, setFormData] = useState<CreateMarcaDTO>({
    nombre: '',
    paisOrigen: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (marca) {
      setFormData({
        nombre: marca.nombre,
        paisOrigen: marca.paisOrigen || '',
      });
    } else {
      setFormData({
        nombre: '',
        paisOrigen: '',
      });
    }
  }, [marca]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving marca:', error);
      alert('Error al guardar la marca');
    } finally {
      setSaving(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all";
  const labelClasses = "block text-sm font-medium text-slate-300 mb-2";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl max-w-md w-full shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500">
              <Car className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {marca ? 'Editar Marca' : 'Nueva Marca'}
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
              Nombre de la Marca
            </label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className={inputClasses}
              placeholder="Ej: Toyota, Honda, Ford..."
            />
          </div>

          <div>
            <label className={labelClasses}>
              <span className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-400" />
                País de Origen (opcional)
              </span>
            </label>
            <input
              type="text"
              value={formData.paisOrigen}
              onChange={(e) => setFormData({ ...formData, paisOrigen: e.target.value })}
              className={inputClasses}
              placeholder="Ej: Japón, Estados Unidos, Alemania..."
            />
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
              className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all shadow-lg shadow-violet-500/25 font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
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
