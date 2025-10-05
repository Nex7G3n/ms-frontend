import { useState, useEffect } from 'react';
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
    <>
      <div className="modal show d-block" tabIndex={-1} role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{initialData ? 'Editar Marca' : 'Nueva Marca'}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre *</label>
                  <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className={`form-control ${errors.nombre ? 'is-invalid' : ''}`} placeholder="Ej: Toyota" />
                  {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">País de Origen *</label>
                  <input type="text" value={formData.paisOrigen} onChange={(e) => setFormData({ ...formData, paisOrigen: e.target.value })} className={`form-control ${errors.paisOrigen ? 'is-invalid' : ''}`} placeholder="Ej: Japón" />
                  {errors.paisOrigen && <div className="invalid-feedback">{errors.paisOrigen}</div>}
                </div>
                <div className="modal-footer px-0">
                  <button type="button" onClick={onClose} className="btn btn-secondary">Cancelar</button>
                  <button type="submit" className="btn btn-primary">{initialData ? 'Actualizar' : 'Crear'} Marca</button>
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
