import { useState, useEffect } from 'react';
import type { CreateModeloDTO } from '../types/models';
import { useMarcas } from '../hooks/useAutoPartes';

interface ModeloFormProps {
  onClose: () => void;
  onSubmit: (data: CreateModeloDTO) => void;
  initialData?: CreateModeloDTO;
}

export default function ModeloForm({ onClose, onSubmit, initialData }: ModeloFormProps) {
  const [formData, setFormData] = useState<CreateModeloDTO>({
    nombre: '',
    anio: '',
    marcaId: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { marcas, loading: loadingMarcas, error: errorMarcas } = useMarcas();

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        anio: initialData.anio || '',
        marcaId: initialData.marcaId || 0,
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre) newErrors.nombre = 'Nombre es requerido';
    if (!formData.anio) newErrors.anio = 'Año es requerido';
    if (!formData.marcaId) newErrors.marcaId = 'Marca es requerida';
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
              <h5 className="modal-title">{initialData ? 'Editar Modelo' : 'Nuevo Modelo'}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre *</label>
                  <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className={`form-control ${errors.nombre ? 'is-invalid' : ''}`} placeholder="Ej: Corolla" />
                  {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Año *</label>
                  <input type="text" value={formData.anio} onChange={(e) => setFormData({ ...formData, anio: e.target.value })} className={`form-control ${errors.anio ? 'is-invalid' : ''}`} placeholder="Ej: 2020" />
                  {errors.anio && <div className="invalid-feedback">{errors.anio}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Marca *</label>
                  <select value={formData.marcaId} onChange={(e) => setFormData({ ...formData, marcaId: parseInt(e.target.value) })} className={`form-select ${errors.marcaId ? 'is-invalid' : ''}`}>
                    <option value="">{loadingMarcas ? 'Cargando marcas...' : 'Seleccionar marca'}</option>
                    {!loadingMarcas && marcas.map((marca) => (
                      <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                    ))}
                  </select>
                  {errors.marcaId && <div className="invalid-feedback">{errors.marcaId}</div>}
                  {errorMarcas && <div className="invalid-feedback d-block">{errorMarcas}</div>}
                </div>

                <div className="modal-footer px-0">
                  <button type="button" onClick={onClose} className="btn btn-secondary">Cancelar</button>
                  <button type="submit" className="btn btn-primary">{initialData ? 'Actualizar' : 'Crear'} Modelo</button>
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
