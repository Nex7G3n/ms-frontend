import { useState, useEffect } from 'react';
import { Search, Package, Tag, Car, Grid3x3 } from 'lucide-react';
import './dashboard.css';
import AutoparteForm from '../forms/formAutoPartes';
import MarcaForm from '../forms/formMarca';
import ModeloForm from '../forms/formModelo';
import PiezaForm from '../forms/formPieza';
import ConfirmationModal from '../components/ConfirmationModal';
import type { Autoparte, Marca, Modelo, Pieza, CreateAutoparteDTO, CreateMarcaDTO, CreateModeloDTO, CreatePiezaDTO } from '../types/models';
import { useAutopartes, useMarcas, useModelos, usePiezas } from '../hooks/useAutoPartes';
import { marcasApi, modelosApi, piezasApi, autopartesApi } from '../services/api';

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

  return (
    <>
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="dashboard-header-content">
            <div className="dashboard-header-flex">
              <div className="dashboard-title-group">
                <Package className="dashboard-icon-package" />
                <h1 className="dashboard-title">AutoPartes Manager</h1>
              </div>
              <div className="dashboard-user-info">
                <span className="dashboard-user-text">Admin</span>
                <div className="dashboard-user-avatar">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-main-content">
          {/* Search Bar */}
          <div className="search-bar-container">
            <div className="search-bar-relative">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Buscar por código, pieza o modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            {statCards.map((stat, idx) => (
              <div key={idx} className="stat-card">
                <div className="stat-card-content">
                  <div>
                    <p className="stat-label">{stat.label}</p>
                    <p className="stat-value">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} stat-icon-wrapper`}>
                    <stat.icon className="stat-icon" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-grid">
            <button className="quick-action-button blue" onClick={() => setShowAutoparteForm(true)}>
              Nueva Autoparte
            </button>
            <button className="quick-action-button green" onClick={() => setShowMarcaForm(true)}>
              Nueva Marca
            </button>
            <button className="quick-action-button purple" onClick={() => setShowModeloForm(true)}>
              Nuevo Modelo
            </button>
            <button className="quick-action-button orange" onClick={() => setShowPiezaForm(true)}>
              Nueva Pieza
            </button>
          </div>

          {/* Alerts */}
          <div className="alert-container">
            <div className="alert-flex">
              <div className="alert-icon-wrapper">
                <svg className="alert-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="alert-text-wrapper">
                <p className="alert-text">
                  <span className="alert-text-semibold">{stats.stockBajo} productos</span> con stock bajo requieren atención
                </p>
              </div>
            </div>
          </div>

          {/* Recent Items Table */}
          <div className="recent-items-table-container">
            <div className="recent-items-table-header">
              <h2 className="recent-items-table-title">Autopartes Recientes</h2>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead className="table-header-row">
                  <tr>
                    <th className="table-header-cell">
                      Código
                    </th>
                    <th className="table-header-cell">
                      Pieza
                    </th>
                    <th className="table-header-cell">
                      Modelo
                    </th>
                    <th className="table-header-cell">
                      Stock
                    </th>
                    <th className="table-header-cell">
                      Precio
                    </th>
                    <th className="table-header-cell">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="table-cell text-center">Cargando autopartes...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={6} className="table-cell text-center text-red-500">{error}</td>
                    </tr>
                  ) : autopartes.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="table-cell text-center">No hay autopartes disponibles.</td>
                    </tr>
                  ) : (
                    autopartes.map((item: Autoparte) => (
                      <tr key={item.id} className="table-row">
                        <td className="table-cell font-medium">
                          {item.codigoProducto}
                        </td>
                        <td className="table-cell text-gray-600">
                          {item.pieza.nombre}
                        </td>
                        <td className="table-cell text-gray-600">
                          {item.modelo.nombre}
                        </td>
                        <td className="table-cell">
                          <span className={`stock-badge ${
                            item.stock < 10 ? 'red' : 'green'
                          }`}>
                            {item.stock} unidades
                          </span>
                        </td>
                        <td className="table-cell price">
                          ${item.precio.toFixed(2)}
                        </td>
                        <td className="table-cell">
                          <button className="action-button blue">
                            Ver
                          </button>
                          <button className="action-button green" onClick={() => handleEditAutoparte(item)}>
                            Editar
                          </button>
                          <button className="action-button red" onClick={() => handleDeleteClick(item.id, 'autoparte')}>
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Marcas Table */}
          <div className="recent-items-table-container">
            <div className="recent-items-table-header">
              <h2 className="recent-items-table-title">Marcas</h2>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead className="table-header-row">
                  <tr>
                    <th className="table-header-cell">Nombre</th>
                    <th className="table-header-cell">País de Origen</th>
                    <th className="table-header-cell">Acciones</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {loadingMarcas ? (
                    <tr><td colSpan={3} className="table-cell text-center">Cargando marcas...</td></tr>
                  ) : errorMarcas ? (
                    <tr><td colSpan={3} className="table-cell text-center text-red-500">{errorMarcas}</td></tr>
                  ) : marcas.length === 0 ? (
                    <tr><td colSpan={3} className="table-cell text-center">No hay marcas.</td></tr>
                  ) : (
                    marcas.map((m: Marca) => (
                      <tr key={m.id} className="table-row">
                        <td className="table-cell font-medium">{m.nombre}</td>
                        <td className="table-cell text-gray-600">{m.paisOrigen}</td>
                        <td className="table-cell">
                          <button
                            className="action-button green"
                            onClick={() => {
                              setEditingMarca({ nombre: m.nombre, paisOrigen: m.paisOrigen });
                              setEditingMarcaId(m.id);
                              setShowMarcaForm(true);
                            }}
                          >
                            Editar
                          </button>
                          <button
                            className="action-button red"
                            onClick={() => handleDeleteClick(m.id, 'marca')}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modelos Table */}
          <div className="recent-items-table-container">
            <div className="recent-items-table-header">
              <h2 className="recent-items-table-title">Modelos</h2>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead className="table-header-row">
                  <tr>
                    <th className="table-header-cell">Nombre</th>
                    <th className="table-header-cell">Año</th>
                    <th className="table-header-cell">Marca</th>
                    <th className="table-header-cell">Acciones</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {loadingModelos ? (
                    <tr><td colSpan={4} className="table-cell text-center">Cargando modelos...</td></tr>
                  ) : errorModelos ? (
                    <tr><td colSpan={4} className="table-cell text-center text-red-500">{errorModelos}</td></tr>
                  ) : modelos.length === 0 ? (
                    <tr><td colSpan={4} className="table-cell text-center">No hay modelos.</td></tr>
                  ) : (
                    modelos.map((mo: Modelo) => (
                      <tr key={mo.id} className="table-row">
                        <td className="table-cell font-medium">{mo.nombre}</td>
                        <td className="table-cell text-gray-600">{mo.anio}</td>
                        <td className="table-cell text-gray-600">{mo.marca?.nombre}</td>
                        <td className="table-cell">
                          <button
                            className="action-button green"
                            onClick={() => {
                              setEditingModelo({ nombre: mo.nombre, anio: mo.anio, marcaId: mo.marca?.id || 0 });
                              setEditingModeloId(mo.id);
                              setShowModeloForm(true);
                            }}
                          >
                            Editar
                          </button>
                          <button
                            className="action-button red"
                            onClick={() => handleDeleteClick(mo.id, 'modelo')}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Piezas Table */}
          <div className="recent-items-table-container">
            <div className="recent-items-table-header">
              <h2 className="recent-items-table-title">Piezas</h2>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead className="table-header-row">
                  <tr>
                    <th className="table-header-cell">Nombre</th>
                    <th className="table-header-cell">Categoría</th>
                    <th className="table-header-cell">Descripción</th>
                    <th className="table-header-cell">Acciones</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {loadingPiezas ? (
                    <tr><td colSpan={4} className="table-cell text-center">Cargando piezas...</td></tr>
                  ) : errorPiezas ? (
                    <tr><td colSpan={4} className="table-cell text-center text-red-500">{errorPiezas}</td></tr>
                  ) : piezas.length === 0 ? (
                    <tr><td colSpan={4} className="table-cell text-center">No hay piezas.</td></tr>
                  ) : (
                    piezas.map((p: Pieza) => (
                      <tr key={p.id} className="table-row">
                        <td className="table-cell font-medium">{p.nombre}</td>
                        <td className="table-cell text-gray-600">{p.categoria}</td>
                        <td className="table-cell text-gray-600">{p.descripcion}</td>
                        <td className="table-cell">
                          <button
                            className="action-button green"
                            onClick={() => {
                              setEditingPieza({ nombre: p.nombre, categoria: p.categoria, descripcion: p.descripcion });
                              setEditingPiezaId(p.id);
                              setShowPiezaForm(true);
                            }}
                          >
                            Editar
                          </button>
                          <button
                            className="action-button red"
                            onClick={() => handleDeleteClick(p.id, 'pieza')}
                          >
                            Eliminar
                          </button>
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
