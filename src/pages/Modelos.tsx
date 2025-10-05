import { useModelos } from '../hooks/useAutoPartes';
import { useState } from 'react';
import ModeloForm from '../forms/formModelo';

export default function Modelos() {
  const { modelos, loading, error, refetch } = useModelos();
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
        <h2>Modelos</h2>
        <div>
          <button className="btn btn-sm btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>Nuevo</button>
        </div>
      </div>

      {loading ? <p>Cargando modelos...</p> : error ? <p className="text-danger">{error}</p> : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead><tr><th>Nombre</th><th>Año</th><th>Marca</th><th>Acciones</th></tr></thead>
            <tbody>
              {modelos.map(mo => (
                <tr key={mo.id}><td>{mo.nombre}</td><td className="text-muted">{mo.anio}</td><td className="text-muted">{mo.marca?.nombre}</td><td>
                  <button className="btn btn-sm btn-success me-1" onClick={() => { setEditing(mo); setShowForm(true); }}>Editar</button>
                </td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && <ModeloForm onClose={() => setShowForm(false)} onSubmit={handleSubmit} initialData={editing || undefined} />}
    </div>
  );
}
