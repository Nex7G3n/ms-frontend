import { useMarcas } from '../hooks/useAutoPartes';
import { useState } from 'react';
import MarcaForm from '../forms/formMarca';

export default function Marcas() {
  const { marcas, loading, error, refetch } = useMarcas();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const handleSubmit = async () => {
    // Here you would call API; for now we just close and refetch if available
    setShowForm(false);
    setEditing(null);
    if (refetch) await refetch();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Marcas</h2>
        <div>
          <button className="btn btn-sm btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>Nuevo</button>
        </div>
      </div>

      {loading ? <p>Cargando marcas...</p> : error ? <p className="text-danger">{error}</p> : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead><tr><th>Nombre</th><th>País</th><th>Acciones</th></tr></thead>
            <tbody>
              {marcas.map(m => (
                <tr key={m.id}><td>{m.nombre}</td><td className="text-muted">{m.paisOrigen}</td><td>
                  <button className="btn btn-sm btn-success me-1" onClick={() => { setEditing(m); setShowForm(true); }}>Editar</button>
                </td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && <MarcaForm onClose={() => setShowForm(false)} onSubmit={handleSubmit} initialData={editing || undefined} />}
    </div>
  );
}
