import { useState } from 'react';
import { Search, Package, Tag, Car, Grid3x3 } from 'lucide-react';
import AutoparteForm from '../forms/formAutoPartes';
import MarcaForm from '../forms/formMarca';
import ModeloForm from '../forms/formModelo';
import PiezaForm from '../forms/formPieza';
import ClienteForm from '../forms/formCliente';
import ConfirmationModal from '../components/ConfirmationModal';
import type { Autoparte, Marca, Modelo, Pieza, CreateAutoparteDTO, CreateMarcaDTO, CreateModeloDTO, CreatePiezaDTO, Client, CreateClientDTO, UpdateClientDTO } from '../types/models';
import { useAutopartes, useMarcas, useModelos, usePiezas } from '../hooks/useAutoPartes';
import { useClients } from '../hooks/useClients';
import { marcasApi, modelosApi, piezasApi, autopartesApi, clientsApi } from '../services/api';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const { autopartes, loading, error, refetch } = useAutopartes();
  const { marcas, loading: loadingMarcas, error: errorMarcas, refetch: refetchMarcas } = useMarcas();
  const { modelos, loading: loadingModelos, error: errorModelos, refetch: refetchModelos } = useModelos();
  const { piezas, loading: loadingPiezas, error: errorPiezas, refetch: refetchPiezas } = usePiezas();
  const [stats] = useState({ // Reintroducir mockStats temporalmente
    totalAutopartes: 0,
    totalMarcas: 0,
    totalModelos: 0,
    totalPiezas: 0,
    stockBajo: 0,
    valorInventario: 0
  });

  const [showAutoparteForm, setShowAutoparteForm] = useState(false);
  const [showMarcaForm, setShowMarcaForm] = useState(false);
  const [showModeloForm, setShowModeloForm] = useState(false);
  const [showPiezaForm, setShowPiezaForm] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; type: string } | null>(null);

  const [editingAutoparte, setEditingAutoparte] = useState<Autoparte | null>(null);
  const [editingMarca, setEditingMarca] = useState<CreateMarcaDTO | null>(null);
  const [editingMarcaId, setEditingMarcaId] = useState<number | null>(null);
  const [editingModelo, setEditingModelo] = useState<CreateModeloDTO | null>(null);
  const [editingModeloId, setEditingModeloId] = useState<number | null>(null);
  const [editingPieza, setEditingPieza] = useState<CreatePiezaDTO | null>(null);
  const [editingPiezaId, setEditingPiezaId] = useState<number | null>(null);
  const { clients, loading: loadingClients, error: errorClients, refetch: refetchClients } = useClients();
  const [showClienteForm, setShowClienteForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Client | null>(null);

  // Debug: longitudes de datos cargados
  console.log('[Dashboard] lengths', {
    marcas: marcas.length,
    modelos: modelos.length,
    piezas: piezas.length,
    autopartes: autopartes.length,
  });

  const statCards = [
    { icon: Package, label: 'Total Autopartes', value: autopartes.length, color: 'bg-blue-500' },
    { icon: Car, label: 'Marcas', value: marcas.length, color: 'bg-green-500' },
    { icon: Grid3x3, label: 'Modelos', value: modelos.length, color: 'bg-purple-500' },
    { icon: Tag, label: 'Piezas', value: piezas.length, color: 'bg-orange-500' },
  ];

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleNewAutoparte = async (data: CreateAutoparteDTO) => {
    try {
      if (editingAutoparte?.id != null) {
        await autopartesApi.update(editingAutoparte.id, data);
        await sleep(150);
        await refetch();
        showToast('Autoparte actualizada exitosamente', 'success');
      } else {
        await autopartesApi.create(data);
        await refetch();
        showToast('Autoparte creada exitosamente', 'success');
      }
      setShowAutoparteForm(false);
      setEditingAutoparte(null);
    } catch (e) {
      console.error('Error al guardar autoparte:', e);
      showToast('Error al guardar autoparte', 'error');
    }
  };

  const handleNewMarca = async (data: CreateMarcaDTO) => {
    try {
      if (editingMarcaId != null) {
        await marcasApi.update(editingMarcaId, data);
        await sleep(150);
        await refetchMarcas();
        showToast('Marca actualizada exitosamente', 'success');
      } else {
        await marcasApi.create(data);
        await sleep(150);
        await refetchMarcas();
        showToast('Marca creada exitosamente', 'success');
      }
      setShowMarcaForm(false);
      setEditingMarca(null);
      setEditingMarcaId(null);
    } catch (error) {
      console.error('Error al crear marca:', error);
      showToast('Error al guardar marca', 'error');
      // Podrías mostrar un mensaje de error al usuario aquí
    }
  };

  const handleNewModelo = async (data: CreateModeloDTO) => {
    try {
      if (editingModeloId != null) {
        await modelosApi.update(editingModeloId, data);
        await sleep(150);
        await refetchModelos();
        showToast('Modelo actualizado exitosamente', 'success');
      } else {
        await modelosApi.create(data);
        await sleep(150);
        await refetchModelos();
        showToast('Modelo creado exitosamente', 'success');
      }
      setShowModeloForm(false);
      setEditingModelo(null);
      setEditingModeloId(null);
    } catch (error) {
      console.error('Error al crear modelo:', error);
      showToast('Error al guardar modelo', 'error');
    }
  };

  const handleNewPieza = async (data: CreatePiezaDTO) => {
    try {
      if (editingPiezaId != null) {
        await piezasApi.update(editingPiezaId, data);
        await sleep(150);
        await refetchPiezas();
        showToast('Pieza actualizada exitosamente', 'success');
      } else {
        await piezasApi.create(data);
        await sleep(150);
        await refetchPiezas();
        showToast('Pieza creada exitosamente', 'success');
      }
      setShowPiezaForm(false);
      setEditingPieza(null);
      setEditingPiezaId(null);
    } catch (error) {
      console.error('Error al crear pieza:', error);
      showToast('Error al guardar pieza', 'error');
    }
  };

  const handleDeleteClick = (id: number, type: string) => {
    setItemToDelete({ id, type });
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      try {
        if (itemToDelete.type === 'autoparte') {
          // await deleteAutoparte(itemToDelete.id); // Si se habilita, refrescará autopartes
          await sleep(150);
          await refetch();
          showToast('Autoparte eliminada', 'success');
        } else if (itemToDelete.type === 'marca') {
          await marcasApi.delete(itemToDelete.id);
          await sleep(150);
          await refetchMarcas();
          showToast('Marca eliminada', 'success');
        } else if (itemToDelete.type === 'modelo') {
          await modelosApi.delete(itemToDelete.id);
          await sleep(150);
          await refetchModelos();
          showToast('Modelo eliminado', 'success');
        } else if (itemToDelete.type === 'pieza') {
          await piezasApi.delete(itemToDelete.id);
          await sleep(150);
          await refetchPiezas();
          showToast('Pieza eliminada', 'success');
        } else if (itemToDelete.type === 'client') {
          await clientsApi.delete(itemToDelete.id);
          await sleep(150);
          await refetchClients();
          showToast('Cliente eliminado', 'success');
        }
      } catch (e) {
        console.error('Error al eliminar:', e);
        showToast('Error al eliminar', 'error');
      }
    }
    setShowConfirmModal(false);
    setItemToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setItemToDelete(null);
  };

  const handleEditAutoparte = (autoparte: Autoparte) => {
    setEditingAutoparte(autoparte);
    setShowAutoparteForm(true);
  };

  const handleNewCliente = async (data: CreateClientDTO | UpdateClientDTO) => {
    try {
      if ((data as any).idClient) {
        const id = (data as any).idClient;
        await clientsApi.update(id, data as UpdateClientDTO);
        await sleep(150);
        await refetchClients();
        showToast('Cliente actualizado exitosamente', 'success');
      } else {
        await clientsApi.create(data as CreateClientDTO);
        await sleep(150);
        await refetchClients();
        showToast('Cliente creado exitosamente', 'success');
      }
      setShowClienteForm(false);
      setEditingCliente(null);
    } catch (e) {
      console.error('Error al guardar cliente:', e);
      showToast('Error al guardar cliente', 'error');
    }
  };

  const handleEditCliente = (cliente: Client) => {
    setEditingCliente(cliente);
    setShowClienteForm(true);
  };

  return (
    <>
      <div className="container-fluid py-3">
        {/* Header */}
        <header className="mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <Package className="me-2" />
              <h1 className="h4 mb-0">AutoPartes Manager</h1>
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="text-muted">Admin</div>
              <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{width:36,height:36}}>A</div>
            </div>
          </div>
        </header>

        <div>
          {/* Search Bar */}
          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text"><Search /></span>
              <input
                type="text"
                placeholder="Buscar por código, pieza o modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="row g-3 mb-4">
            {statCards.map((stat, idx) => (
              <div key={idx} className="col-md-3">
                <div className="card shadow-sm h-100">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1 text-muted small">{stat.label}</p>
                      <h5 className="mb-0">{stat.value}</h5>
                    </div>
                    <div className="text-secondary" style={{fontSize:28}}>
                      <stat.icon />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-4 d-flex gap-2">
            <button className="btn btn-primary" onClick={() => setShowAutoparteForm(true)}>Nueva Autoparte</button>
            <button className="btn btn-success" onClick={() => setShowMarcaForm(true)}>Nueva Marca</button>
            <button className="btn btn-warning" onClick={() => setShowModeloForm(true)}>Nuevo Modelo</button>
            <button className="btn btn-info text-white" onClick={() => setShowPiezaForm(true)}>Nueva Pieza</button>
          </div>

          {/* Alerts */}
          <div className="mb-4">
            <div className="alert alert-warning d-flex align-items-center" role="alert">
              <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:"><use /></svg>
              <div>
                <strong>{stats.stockBajo} productos</strong> con stock bajo requieren atención
              </div>
            </div>
          </div>

          {/* Recent Items Table */}
          <div className="mb-4">
            <h2 className="h5">Autopartes Recientes</h2>
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Pieza</th>
                    <th>Modelo</th>
                    <th>Stock</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="text-center">Cargando autopartes...</td></tr>
                  ) : error ? (
                    <tr><td colSpan={6} className="text-center text-danger">{error}</td></tr>
                  ) : autopartes.length === 0 ? (
                    <tr><td colSpan={6} className="text-center">No hay autopartes disponibles.</td></tr>
                  ) : (
                    autopartes.map((item: Autoparte) => (
                      <tr key={item.id}>
                        <td className="fw-medium">{item.codigoProducto}</td>
                        <td className="text-muted">{item.pieza?.nombre}</td>
                        <td className="text-muted">{item.modelo?.nombre}</td>
                        <td>
                          <span className={`badge ${item.stock < 10 ? 'bg-danger' : 'bg-success'}`}>{item.stock} unidades</span>
                        </td>
                        <td>${item.precio.toFixed(2)}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-1">Ver</button>
                          <button className="btn btn-sm btn-outline-success me-1" onClick={() => handleEditAutoparte(item)}>Editar</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(item.id, 'autoparte')}>Eliminar</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Marcas Table */}
          <div className="mb-4">
            <h2 className="h5">Marcas</h2>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr><th>Nombre</th><th>País de Origen</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {loadingMarcas ? (
                    <tr><td colSpan={3} className="text-center">Cargando marcas...</td></tr>
                  ) : errorMarcas ? (
                    <tr><td colSpan={3} className="text-center text-danger">{errorMarcas}</td></tr>
                  ) : marcas.length === 0 ? (
                    <tr><td colSpan={3} className="text-center">No hay marcas.</td></tr>
                  ) : (
                    marcas.map((m: Marca) => (
                      <tr key={m.id}>
                        <td className="fw-medium">{m.nombre}</td>
                        <td className="text-muted">{m.paisOrigen}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-success me-1" onClick={() => { setEditingMarca({ nombre: m.nombre, paisOrigen: m.paisOrigen }); setEditingMarcaId(m.id); setShowMarcaForm(true); }}>Editar</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(m.id, 'marca')}>Eliminar</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modelos Table */}
          <div className="mb-4">
            <h2 className="h5">Modelos</h2>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr><th>Nombre</th><th>Año</th><th>Marca</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {loadingModelos ? (
                    <tr><td colSpan={4} className="text-center">Cargando modelos...</td></tr>
                  ) : errorModelos ? (
                    <tr><td colSpan={4} className="text-center text-danger">{errorModelos}</td></tr>
                  ) : modelos.length === 0 ? (
                    <tr><td colSpan={4} className="text-center">No hay modelos.</td></tr>
                  ) : (
                    modelos.map((mo: Modelo) => (
                      <tr key={mo.id}>
                        <td className="fw-medium">{mo.nombre}</td>
                        <td className="text-muted">{mo.anio}</td>
                        <td className="text-muted">{mo.marca?.nombre}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-success me-1" onClick={() => { setEditingModelo({ nombre: mo.nombre, anio: mo.anio, marcaId: mo.marca?.id || 0 }); setEditingModeloId(mo.id); setShowModeloForm(true); }}>Editar</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(mo.id, 'modelo')}>Eliminar</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Piezas Table */}
          <div className="mb-4">
            <h2 className="h5">Piezas</h2>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr><th>Nombre</th><th>Categoría</th><th>Descripción</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {loadingPiezas ? (
                    <tr><td colSpan={4} className="text-center">Cargando piezas...</td></tr>
                  ) : errorPiezas ? (
                    <tr><td colSpan={4} className="text-center text-danger">{errorPiezas}</td></tr>
                  ) : piezas.length === 0 ? (
                    <tr><td colSpan={4} className="text-center">No hay piezas.</td></tr>
                  ) : (
                    piezas.map((p: Pieza) => (
                      <tr key={p.id}>
                        <td className="fw-medium">{p.nombre}</td>
                        <td className="text-muted">{p.categoria}</td>
                        <td className="text-muted">{p.descripcion}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-success me-1" onClick={() => { setEditingPieza({ nombre: p.nombre, categoria: p.categoria, descripcion: p.descripcion }); setEditingPiezaId(p.id); setShowPiezaForm(true); }}>Editar</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(p.id, 'pieza')}>Eliminar</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Clientes Table */}
          <div className="recent-items-table-container">
            <div className="recent-items-table-header d-flex justify-content-between align-items-center">
              <h2 className="recent-items-table-title">Clientes</h2>
              <div>
                <button className="btn btn-primary btn-sm" onClick={() => { setEditingCliente(null); setShowClienteForm(true); }}>
                  Nuevo Cliente
                </button>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-header-row">
                  <tr>
                    <th className="table-header-cell">Nombre</th>
                    <th className="table-header-cell">Email</th>
                    <th className="table-header-cell">Teléfono</th>
                    <th className="table-header-cell">Documento</th>
                    <th className="table-header-cell">Acciones</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {loadingClients ? (
                    <tr><td colSpan={5} className="table-cell text-center">Cargando clientes...</td></tr>
                  ) : errorClients ? (
                    <tr><td colSpan={5} className="table-cell text-center text-red-500">{errorClients}</td></tr>
                  ) : clients.length === 0 ? (
                    <tr><td colSpan={5} className="table-cell text-center">No hay clientes.</td></tr>
                  ) : (
                    clients.map((c: Client) => (
                      <tr key={c.idClient} className="table-row">
                        <td className="table-cell font-medium">{c.firstName} {c.lastName}</td>
                        <td className="table-cell text-muted">{c.email}</td>
                        <td className="table-cell text-muted">{c.phone}</td>
                        <td className="table-cell text-muted">{c.documentNumber}</td>
                        <td className="table-cell">
                          <button className="btn btn-sm btn-outline-primary me-1">Ver</button>
                          <button className="btn btn-sm btn-outline-success me-1" onClick={() => handleEditCliente(c)}>Editar</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(c.idClient, 'client')}>Eliminar</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '12px 16px',
            borderRadius: '6px',
            color: '#fff',
            backgroundColor: toast.type === 'success' ? '#16a34a' : '#dc2626',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 9999,
          }}
        >
          {toast.message}
        </div>
      )}

      {showAutoparteForm && <AutoparteForm onClose={() => { setShowAutoparteForm(false); setEditingAutoparte(null); }} onSubmit={handleNewAutoparte} initialData={editingAutoparte ? {
        codigoProducto: editingAutoparte.codigoProducto,
        modeloId: editingAutoparte.modelo.id,
        piezaId: editingAutoparte.pieza.id,
        precio: editingAutoparte.precio,
        stock: editingAutoparte.stock,
        estado: editingAutoparte.estado,
      } : undefined} />}
      {showMarcaForm && <MarcaForm onClose={() => { setShowMarcaForm(false); setEditingMarca(null); setEditingMarcaId(null); }} onSubmit={handleNewMarca} initialData={editingMarca || undefined} />}
      {showModeloForm && <ModeloForm onClose={() => { setShowModeloForm(false); setEditingModelo(null); setEditingModeloId(null); }} onSubmit={handleNewModelo} initialData={editingModelo || undefined} />}
      {showPiezaForm && <PiezaForm onClose={() => { setShowPiezaForm(false); setEditingPieza(null); setEditingPiezaId(null); }} onSubmit={handleNewPieza} initialData={editingPieza || undefined} />}

  {showClienteForm && <ClienteForm onClose={() => { setShowClienteForm(false); setEditingCliente(null); }} onSubmit={handleNewCliente} initialData={editingCliente || undefined} />}

      {showConfirmModal && itemToDelete && (
        <ConfirmationModal
          message={`¿Estás seguro de que quieres eliminar este ${itemToDelete.type}? Esta acción no se puede deshacer.`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
}
