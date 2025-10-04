import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './formPieza.css';
import type { CreatePiezaDTO } from '../types/models';

interface PiezaFormProps {
  onClose: () => void;
  onSubmit: (data: CreatePiezaDTO) => void;
  initialData?: CreatePiezaDTO;
}

export default function PiezaForm({ onClose, onSubmit, initialData }: PiezaFormProps) {
  const [formData, setFormData] = useState<CreatePiezaDTO>({
    nombre: '',
    categoria: '',
    descripcion: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        categoria: initialData.categoria || '',
        descripcion: initialData.descripcion || '',
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre) newErrors.nombre = 'Nombre es requerido';
    if (!formData.categoria) newErrors.categoria = 'Categoría es requerida';
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
            {initialData ? 'Editar Pieza' : 'Nueva Pieza'}
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
              placeholder="Ej: Pastillas de freno"
            />
            {errors.nombre && (
              <p className="form-error-message">{errors.nombre}</p>
            )}
          </div>

          <div>
            <label className="form-label">
              Categoría *
            </label>
            <input
              type="text"
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              className={`form-input ${
                errors.categoria ? 'error' : ''
              }`}
              placeholder="Ej: Frenos"
            />
            {errors.categoria && (
              <p className="form-error-message">{errors.categoria}</p>
            )}
          </div>

          <div>
            <label className="form-label">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="form-input"
              rows={3}
              placeholder="Descripción detallada de la pieza"
            ></textarea>
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
              {initialData ? 'Actualizar' : 'Crear'} Pieza
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
