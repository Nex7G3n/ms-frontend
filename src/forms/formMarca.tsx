import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './formMarca.css';
import type { CreateMarcaDTO } from '../types/models';

interface MarcaFormProps {
  onClose: () => void;
  onSubmit: (data: CreateMarcaDTO) => void;
  initialData?: CreateMarcaDTO;
}

export default function MarcaForm({ onClose, onSubmit, initialData }: MarcaFormProps) {
  const [formData, setFormData] = useState<CreateMarcaDTO>({
    nombre: '',
    paisOrigen: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        paisOrigen: initialData.paisOrigen || '',
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre) newErrors.nombre = 'Nombre es requerido';
    if (!formData.paisOrigen) newErrors.paisOrigen = 'País de origen es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h2 className="form-title">
            {initialData ? 'Editar Marca' : 'Nueva Marca'}
          </h2>
          <button
            onClick={onClose}
            className="form-close-button"
          >
            <X className="form-close-icon" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-body">
          <div>
            <label className="form-label">
              Nombre *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className={`form-input ${
                errors.nombre ? 'error' : ''
              }`}
              placeholder="Ej: Toyota"
            />
            {errors.nombre && (
              <p className="form-error-message">{errors.nombre}</p>
            )}
          </div>

          <div>
            <label className="form-label">
              País de Origen *
            </label>
            <input
              type="text"
              value={formData.paisOrigen}
              onChange={(e) => setFormData({ ...formData, paisOrigen: e.target.value })}
              className={`form-input ${
                errors.paisOrigen ? 'error' : ''
              }`}
              placeholder="Ej: Japón"
            />
            {errors.paisOrigen && (
              <p className="form-error-message">{errors.paisOrigen}</p>
            )}
          </div>

          <div className="form-footer">
            <button
              type="button"
              onClick={onClose}
              className="form-cancel-button"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="form-submit-button"
            >
              {initialData ? 'Actualizar' : 'Crear'} Marca
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
