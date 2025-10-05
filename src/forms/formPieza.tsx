import { useState, useEffect } from 'react';
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
    <>
      <div className="modal show d-block" tabIndex={-1} role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{initialData ? 'Editar Pieza' : 'Nueva Pieza'}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre *</label>
                  <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className={`form-control ${errors.nombre ? 'is-invalid' : ''}`} placeholder="Ej: Pastillas de freno" />
                  {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Categoría *</label>
                  <input type="text" value={formData.categoria} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })} className={`form-control ${errors.categoria ? 'is-invalid' : ''}`} placeholder="Ej: Frenos" />
                  {errors.categoria && <div className="invalid-feedback">{errors.categoria}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} className="form-control" rows={3} placeholder="Descripción detallada de la pieza"></textarea>
                </div>

                <div className="modal-footer px-0">
                  <button type="button" onClick={onClose} className="btn btn-secondary">Cancelar</button>
                  <button type="submit" className="btn btn-primary">{initialData ? 'Actualizar' : 'Crear'} Pieza</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </>
  );
}
