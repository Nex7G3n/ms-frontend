import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './formModelo.css';
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
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h2 className="form-title">
            {initialData ? 'Editar Modelo' : 'Nuevo Modelo'}
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
              placeholder="Ej: Corolla"
            />
            {errors.nombre && (
              <p className="form-error-message">{errors.nombre}</p>
            )}
          </div>

          <div>
            <label className="form-label">
              Año *
            </label>
            <input
              type="text"
              value={formData.anio}
              onChange={(e) => setFormData({ ...formData, anio: e.target.value })}
              className={`form-input ${
                errors.anio ? 'error' : ''
              }`}
              placeholder="Ej: 2020"
            />
            {errors.anio && (
              <p className="form-error-message">{errors.anio}</p>
            )}
          </div>

          <div>
            <label className="form-label">
              Marca *
            </label>
            <select
              value={formData.marcaId}
              onChange={(e) => setFormData({ ...formData, marcaId: parseInt(e.target.value) })}
              className={`form-select ${
                errors.marcaId ? 'error' : ''
              }`}
            >
              <option value="">{loadingMarcas ? 'Cargando marcas...' : 'Seleccionar marca'}</option>
              {!loadingMarcas && marcas.map((marca) => (
                <option key={marca.id} value={marca.id}>
                  {marca.nombre}
                </option>
              ))}
            </select>
            {errors.marcaId && (
              <p className="form-error-message">{errors.marcaId}</p>
            )}
            {errorMarcas && (
              <p className="form-error-message">{errorMarcas}</p>
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
              {initialData ? 'Actualizar' : 'Crear'} Modelo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
