import { usePiezas } from '../hooks/useAutoPartes';
import { useState } from 'react';
import PiezaForm from '../forms/formPieza';

export default function Piezas() {
  const { piezas, loading, error, refetch } = usePiezas();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const handleSubmit = async () => {
    setShowForm(false);
    setEditing(null);
    if (refetch) await refetch();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Piezas</h2>
        <div>
          <button className="btn btn-sm btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>Nuevo</button>
        </div>
      </div>

      {loading ? <p>Cargando piezas...</p> : error ? <p className="text-danger">{error}</p> : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead><tr><th>Nombre</th><th>Categoría</th><th>Descripción</th><th>Acciones</th></tr></thead>
            <tbody>
              {piezas.map(p => (
                <tr key={p.id}><td>{p.nombre}</td><td className="text-muted">{p.categoria}</td><td className="text-muted">{p.descripcion}</td><td>
                  <button className="btn btn-sm btn-success me-1" onClick={() => { setEditing(p); setShowForm(true); }}>Editar</button>
                </td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && <PiezaForm onClose={() => setShowForm(false)} onSubmit={handleSubmit} initialData={editing || undefined} />}
    </div>
  );
}
