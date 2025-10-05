import { useClients } from '../hooks/useClients';
import { useState } from 'react';
import ClienteForm from '../forms/formCliente';
import ConfirmationModal from '../components/ConfirmationModal';
import { clientsApi } from '../services/api';
import type { CreateClientDTO, UpdateClientDTO, Client } from '../types/models';

export default function Clientes() {
  const { clients, loading, error, refetch } = useClients();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Client | CreateClientDTO | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateClientDTO | UpdateClientDTO) => {
    setSaving(true);
    setSubmitError(null);
    try {
      if ((data as any).idClient) {
        // Update existing client -> PUT /clients/:id
        const id = (data as any).idClient;
        await clientsApi.update(id, data as UpdateClientDTO);
      } else {
        // Create new client -> POST /clients
        await clientsApi.create(data as CreateClientDTO);
      }
      if (refetch) await refetch();
      setShowForm(false);
      setEditing(null);
    } catch (err: any) {
      console.error('Error saving client', err);
      setSubmitError(err?.message || 'Error al guardar cliente');
    } finally {
      setSaving(false);
    }
  };

  const [showConfirm, setShowConfirm] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<number | null>(null);

  const confirmDelete = (id: number) => {
    setToDeleteId(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (toDeleteId == null) return;
    try {
      await clientsApi.delete(toDeleteId);
      if (refetch) await refetch();
    } catch (err: any) {
      console.error('Error deleting client', err);
      setSubmitError(err?.message || 'Error al eliminar cliente');
    } finally {
      setShowConfirm(false);
      setToDeleteId(null);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Clientes</h2>
        <div>
          <button className="btn btn-sm btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>Nuevo</button>
        </div>
      </div>

      {loading ? <p>Cargando clientes...</p> : error ? <p className="text-danger">{error}</p> : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead><tr><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Acciones</th></tr></thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.idClient}><td>{c.firstName} {c.lastName}</td><td className="text-muted">{c.email}</td><td className="text-muted">{c.phone}</td><td>
                  <button className="btn btn-sm btn-success me-1" onClick={() => { setEditing(c); setShowForm(true); }}>Editar</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => confirmDelete(c.idClient)}>Eliminar</button>
                </td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ClienteForm
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
          initialData={editing || undefined}
        />
      )}

      {saving && <div className="mt-2 text-muted">Guardando...</div>}
      {submitError && <div className="mt-2 text-danger">{submitError}</div>}
      {showConfirm && (
        <ConfirmationModal
          message={`¿Estás seguro de que deseas eliminar este cliente?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => { setShowConfirm(false); setToDeleteId(null); }}
        />
      )}
    </div>
  );
}
