import { useState, useEffect } from 'react';
// import './formAutoparte.css';
import type { CreateAutoparteDTO, Marca, Modelo, Pieza } from '../types/models';

interface AutoparteFormProps {
  onClose: () => void;
  onSubmit: (data: CreateAutoparteDTO) => void;
  initialData?: CreateAutoparteDTO;
}

// Datos de ejemplo - reemplazar con hooks reales
const mockMarcas: Marca[] = [
  { id: 1, nombre: 'Toyota', paisOrigen: 'Japón' },
  { id: 2, nombre: 'Honda', paisOrigen: 'Japón' },
  { id: 3, nombre: 'Mazda', paisOrigen: 'Japón' },
];

const mockModelos: Modelo[] = [
  { id: 1, nombre: 'Corolla 2020', anio: '2020', marca: mockMarcas[0] },
  { id: 2, nombre: 'Civic 2019', anio: '2019', marca: mockMarcas[1] },
  { id: 3, nombre: 'Mazda 3 2021', anio: '2021', marca: mockMarcas[2] },
];

const mockPiezas: Pieza[] = [
  { id: 1, nombre: 'Pastillas de freno', categoria: 'Frenos', descripcion: 'Pastillas de freno delanteras' },
  { id: 2, nombre: 'Filtro de aceite', categoria: 'Motor', descripcion: 'Filtro de aceite para motor' },
  { id: 3, nombre: 'Amortiguador', categoria: 'Suspensión', descripcion: 'Amortiguador delantero' },
];

export default function AutoparteForm({ onClose, onSubmit, initialData }: AutoparteFormProps) {
  const [formData, setFormData] = useState<Omit<CreateAutoparteDTO, 'modeloId' | 'piezaId' | 'precio' | 'stock'> & { marcaId: string; modeloId: string; piezaId: string; precio: string; stock: string }>({
    codigoProducto: '',
    marcaId: '',
    modeloId: '',
    piezaId: '',
    precio: '',
    stock: '',
    estado: 'Disponible',
  });

  const [filteredModelos, setFilteredModelos] = useState<Modelo[]>(mockModelos);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        codigoProducto: initialData.codigoProducto,
        marcaId: initialData.modeloId ? String(mockModelos.find(m => m.id === initialData.modeloId)?.marca.id || '') : '',
        modeloId: String(initialData.modeloId),
        piezaId: String(initialData.piezaId),
        precio: String(initialData.precio),
        stock: String(initialData.stock),
        estado: initialData.estado,
      });
    }
  }, [initialData]);

  const handleMarcaChange = (marcaId: string) => {
    setFormData({ ...formData, marcaId, modeloId: '' });
    const filtered = mockModelos.filter(m => m.marca.id === parseInt(marcaId));
    setFilteredModelos(filtered);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.codigoProducto) newErrors.codigoProducto = 'Código es requerido';
    if (!formData.modeloId) newErrors.modeloId = 'Modelo es requerido';
    if (!formData.piezaId) newErrors.piezaId = 'Pieza es requerida';
    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      newErrors.precio = 'Precio debe ser mayor a 0';
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock debe ser mayor o igual a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        codigoProducto: formData.codigoProducto,
        modeloId: parseInt(formData.modeloId),
        piezaId: parseInt(formData.piezaId),
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        estado: formData.estado,
      });
    }
  };

  return (
    <>
      <div className="modal show d-block" tabIndex={-1} role="dialog" aria-modal="true">
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{initialData ? 'Editar Autoparte' : 'Nueva Autoparte'}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Código de Producto *</label>
                  <input
                    type="text"
                    value={formData.codigoProducto}
                    onChange={(e) => setFormData({ ...formData, codigoProducto: e.target.value })}
                    className={`form-control ${errors.codigoProducto ? 'is-invalid' : ''}`}
                    placeholder="Ej: BP-2024-001"
                  />
                  {errors.codigoProducto && <div className="invalid-feedback">{errors.codigoProducto}</div>}
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Marca *</label>
                    <select value={formData.marcaId} onChange={(e) => handleMarcaChange(e.target.value)} className="form-select">
                      <option value="">Seleccionar marca</option>
                      {mockMarcas.map((marca) => (
                        <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Modelo *</label>
                    <select value={formData.modeloId} onChange={(e) => setFormData({ ...formData, modeloId: e.target.value })} className={`form-select ${errors.modeloId ? 'is-invalid' : ''}`} disabled={!formData.marcaId}>
                      <option value="">Seleccionar modelo</option>
                      {filteredModelos.map((modelo) => (
                        <option key={modelo.id} value={modelo.id}>{modelo.nombre}</option>
                      ))}
                    </select>
                    {errors.modeloId && <div className="invalid-feedback d-block">{errors.modeloId}</div>}
                  </div>
                </div>

                <div className="mb-3 mt-3">
                  <label className="form-label">Pieza *</label>
                  <select value={formData.piezaId} onChange={(e) => setFormData({ ...formData, piezaId: e.target.value })} className={`form-select ${errors.piezaId ? 'is-invalid' : ''}`}>
                    <option value="">Seleccionar pieza</option>
                    {mockPiezas.map((pieza) => (
                      <option key={pieza.id} value={pieza.id}>{pieza.nombre} - {pieza.categoria}</option>
                    ))}
                  </select>
                  {errors.piezaId && <div className="invalid-feedback d-block">{errors.piezaId}</div>}
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Precio *</label>
                    <input type="number" step="0.01" min="0" value={formData.precio} onChange={(e) => setFormData({ ...formData, precio: e.target.value })} className={`form-control ${errors.precio ? 'is-invalid' : ''}`} placeholder="0.00" />
                    {errors.precio && <div className="invalid-feedback">{errors.precio}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Stock *</label>
                    <input type="number" min="0" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className={`form-control ${errors.stock ? 'is-invalid' : ''}`} placeholder="0" />
                    {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
                  </div>
                </div>

                <div className="mb-3 mt-3">
                  <label className="form-label">Estado</label>
                  <select value={formData.estado} onChange={(e) => setFormData({ ...formData, estado: e.target.value })} className="form-select">
                    <option value="Disponible">Disponible</option>
                    <option value="Agotado">Agotado</option>
                    <option value="Descontinuado">Descontinuado</option>
                  </select>
                </div>

                <div className="modal-footer px-0">
                  <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">{initialData ? 'Actualizar' : 'Crear'} Autoparte</button>
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
