import { useState, useEffect } from 'react';
import { X, Car, Calendar, Tag, Loader2, AlertCircle } from 'lucide-react';
import type { Modelo, CreateModeloDTO } from '../types/models';
import type { Marca } from '../types/models';

interface ModeloModalProps {
  modelo: Modelo | null;
  marcas: Marca[];
  onSave: (data: CreateModeloDTO) => Promise<void>;
  onClose: () => void;
}

export default function ModeloModal({
  modelo,
  marcas,
  onSave,
  onClose,
}: ModeloModalProps) {
  const [formData, setFormData] = useState<CreateModeloDTO>({
    nombre: '',
    anio: '',
    marca: { id: null as any },
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (modelo) {
      setFormData({
        nombre: modelo.nombre,
        anio: modelo.anio || '',
        marca: { id: modelo.marca.id },
      });
    } else {
      setFormData({
        nombre: '',
        anio: '',
        marca: { id: null as any },
      });
    }
  }, [modelo, marcas]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      console.log('=== FRONTEND DEBUG ===');
      console.log('FormData:', formData);
      console.log('Marca ID:', formData.marca.id);
      console.log('Marcas disponibles:', marcas);
      console.log('===================');
      
      // PRUEBA SIMPLE: Forzar marca ID 1 si es null
      if (!formData.marca.id || formData.marca.id === 0) {
        console.log('Forzando marca ID a 1 para prueba');
        const testData = {
          ...formData,
          marca: { id: 1 }
        };
        console.log('TestData:', testData);
        await onSave(testData);
        return;
      }
      
      await onSave(formData);
    } catch (error) {
      console.error('Error saving modelo:', error);
      alert('Error al guardar el modelo');
    } finally {
      setSaving(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all";
  const selectClasses = "w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all appearance-none cursor-pointer";
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
              {modelo ? 'Editar Modelo' : 'Nuevo Modelo'}
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
              Nombre del Modelo
            </label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className={inputClasses}
              placeholder="Ej: Corolla, Civic, Mustang..."
            />
          </div>

          <div>
            <label className={labelClasses}>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                Año (opcional)
              </span>
            </label>
            <input
              type="text"
              value={formData.anio}
              onChange={(e) => setFormData({ ...formData, anio: e.target.value })}
              className={inputClasses}
              placeholder="Ej: 2024, 2023..."
            />
          </div>

          <div>
            <label className={labelClasses}>
              <span className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-slate-400" />
                Marca
              </span>
            </label>
            {marcas.length === 0 ? (
              <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span className="text-sm">No hay marcas disponibles. Por favor, cree una marca primero.</span>
              </div>
            ) : (
              <select
                required
                value={formData.marca.id || ''}
                onChange={(e) => {
                  console.log('Select changed:', e.target.value);
                  setFormData({ ...formData, marca: { id: parseInt(e.target.value) } });
                }}
                className={selectClasses}
              >
                <option value="" disabled>Seleccionar Marca</option>
                {marcas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </select>
            )}
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
              disabled={saving || marcas.length === 0 || !formData.marca.id}
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
