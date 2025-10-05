import { useState, useEffect } from 'react';
import type { CreateClientDTO, UpdateClientDTO, Client } from '../types/models';

interface ClienteFormProps {
  onClose: () => void;
  onSubmit: (data: CreateClientDTO | UpdateClientDTO) => void;
  initialData?: Client | CreateClientDTO;
}

export default function ClienteForm({ onClose, onSubmit, initialData }: ClienteFormProps) {
  const [formData, setFormData] = useState<CreateClientDTO>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    documentNumber: '',
    documentType: { idDocumentType: 1 },
    address: { street: '', number: '', reference: '', district: { idDistrict: 1 } },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      // Si initialData es Client
      const asClient = initialData as Client;
      if ((asClient as any).idClient) {
        setFormData({
          firstName: asClient.firstName || '',
          lastName: asClient.lastName || '',
          email: asClient.email || '',
          phone: asClient.phone || '',
          documentNumber: asClient.documentNumber || '',
          documentType: { idDocumentType: asClient.documentType?.idDocumentType || 1 },
          address: {
            street: asClient.address?.street || '',
            number: asClient.address?.number || '',
            reference: (asClient.address as any)?.reference || '',
            district: { idDistrict: (asClient.address as any)?.district?.idDistrict || 1 },
          },
        });
      } else {
        setFormData(initialData as CreateClientDTO);
      }
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'Nombre es requerido';
    if (!formData.lastName) newErrors.lastName = 'Apellido es requerido';
    if (!formData.email) newErrors.email = 'Email es requerido';
    if (!formData.documentNumber) newErrors.documentNumber = 'Número de documento es requerido';
    if (!formData.address.street) newErrors.street = 'Calle es requerida';
    if (!formData.address.number) newErrors.number = 'Número es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // If we're editing an existing client, include idClient so the caller can perform a PUT
      const asClient = initialData as Client | undefined;
      if (asClient && (asClient as any).idClient) {
        const payload: UpdateClientDTO = {
          idClient: (asClient as any).idClient,
          ...formData,
        };
        onSubmit(payload);
      } else {
        onSubmit(formData as CreateClientDTO);
      }
    }
  };

  return (
    <>
      <div className="modal show d-block" tabIndex={-1} role="dialog" aria-modal="true">
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{(initialData as any)?.idClient ? 'Editar Cliente' : 'Nuevo Cliente'}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div>
              <label className="form-label">Nombre *</label>
              <input className={`form-input ${errors.firstName ? 'error' : ''}`} value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
              {errors.firstName && <p className="form-error-message">{errors.firstName}</p>}
            </div>
            <div>
              <label className="form-label">Apellido *</label>
              <input className={`form-input ${errors.lastName ? 'error' : ''}`} value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
              {errors.lastName && <p className="form-error-message">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className="form-label">Email *</label>
            <input className={`form-input ${errors.email ? 'error' : ''}`} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            {errors.email && <p className="form-error-message">{errors.email}</p>}
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Teléfono</label>
              <input className="form-input" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Documento *</label>
              <input className={`form-input ${errors.documentNumber ? 'error' : ''}`} value={formData.documentNumber} onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })} />
              {errors.documentNumber && <p className="form-error-message">{errors.documentNumber}</p>}
            </div>
          </div>

          <div>
            <label className="form-label">Calle *</label>
            <input className={`form-input ${errors.street ? 'error' : ''}`} value={formData.address.street} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })} />
            {errors.street && <p className="form-error-message">{errors.street}</p>}
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Número *</label>
              <input className={`form-input ${errors.number ? 'error' : ''}`} value={formData.address.number} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, number: e.target.value } })} />
              {errors.number && <p className="form-error-message">{errors.number}</p>}
            </div>
            <div>
              <label className="form-label">Referencia</label>
              <input className="form-input" value={(formData.address as any).reference || ''} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, reference: e.target.value } })} />
            </div>
          </div>

          <div className="form-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancelar</button>
            <button type="submit" className="btn btn-primary">{(initialData as any)?.idClient ? 'Actualizar' : 'Crear'} Cliente</button>
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
