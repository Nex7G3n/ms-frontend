import Dashboard from '../layout/dashboard';
import { useState } from 'react';
import AutoparteForm from '../forms/formAutoPartes';

export default function Autopartes() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const handleSubmit = async () => {
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Autopartes</h2>
        <div>
          <button className="btn btn-sm btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>Nuevo</button>
        </div>
      </div>

      <Dashboard />

      {showForm && <AutoparteForm onClose={() => setShowForm(false)} onSubmit={handleSubmit} initialData={editing || undefined} />}
    </div>
  );
}
