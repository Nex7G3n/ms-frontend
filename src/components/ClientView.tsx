import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, Mail, Phone, MapPin, Users, Loader2 } from 'lucide-react';
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from '../services/apiClient';
import type { Client, CreateClientDTO } from '../types/modelClient';
import ClientModal from './ClientModal';
import ConfirmationModal from './ConfirmationModal';
import { getDocumentTypes, getDepartments, getProvinces, getDistricts } from '../services/apiClient';
import type { DocumentType, Department, Province, District } from '../types/modelClient';

export default function ClientesView() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<number | null>(null);

  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loadingModalData, setLoadingModalData] = useState(false);
  const [modalDataLoaded, setModalDataLoaded] = useState(false);

  const itemsPerPage = 10;
  const loadingRef = useRef(false);
  const prevSearchQueryRef = useRef(searchQuery);

  // Resetear página cuando cambia la búsqueda
  useEffect(() => {
    if (prevSearchQueryRef.current !== searchQuery && currentPage !== 1) {
      setCurrentPage(1);
    }
    prevSearchQueryRef.current = searchQuery;
  }, [searchQuery, currentPage]);

  // Cargar clientes cuando cambia la búsqueda o la página
  useEffect(() => {
    // Evitar múltiples llamadas simultáneas
    if (loadingRef.current) return;
    
    loadClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery]);

  // Cargar datos del modal solo cuando se necesita
  const loadModalData = useCallback(async () => {
    if (modalDataLoaded) return; // Ya están cargados
    
    setLoadingModalData(true);
    try {
      const [docTypes, depts, provs, dists] = await Promise.all([
        getDocumentTypes(),
        getDepartments(),
        getProvinces(),
        getDistricts(),
      ]);
      setDocumentTypes(docTypes);
      setDepartments(depts);
      setProvinces(provs);
      setDistricts(dists);
      setModalDataLoaded(true);
    } catch (error) {
      console.error("Error loading modal data:", error);
    } finally {
      setLoadingModalData(false);
    }
  }, [modalDataLoaded]);

  // Cargar datos del modal cuando se abre el modal
  useEffect(() => {
    if (showModal && !modalDataLoaded) {
      loadModalData();
    }
  }, [showModal, modalDataLoaded, loadModalData]);

  const loadClients = useCallback(async () => {
    // Prevenir múltiples llamadas simultáneas
    if (loadingRef.current) return;
    
    try {
      loadingRef.current = true;
      setLoading(true);
      const response = await getClients(currentPage, itemsPerPage, searchQuery);
      setClients(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error loading clients:", error);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [currentPage, itemsPerPage, searchQuery]);

  const handleCreate = () => {
    setEditingClient(null);
    setShowModal(true);
  };

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // El reset de página se maneja en el useEffect
  }, []);

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setShowModal(true);
  };

  const handleDeleteClick = (idClient: number) => {
    setClientToDelete(idClient);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = useCallback(async () => {
    if (clientToDelete === null) return;

    try {
      await deleteClient(clientToDelete);
      await loadClients();
      setShowConfirmModal(false);
      setClientToDelete(null);
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("Error al eliminar el cliente");
    }
  }, [clientToDelete, loadClients]);

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setClientToDelete(null);
  };

  const handleSave = useCallback(async (data: CreateClientDTO) => {
    try {
      if (editingClient) {
        await updateClient(editingClient.idClient, data);
      } else {
        await createClient(data);
      }
      await loadClients();
      setShowModal(false);
      setEditingClient(null);
    } catch (error) {
      console.error("Error saving client:", error);
      throw error;
    }
  }, [editingClient, loadClients]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
        <p className="text-slate-400">Cargando clientes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg shadow-rose-500/25">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Clientes</h2>
            <p className="text-sm text-slate-400">Gestiona tu cartera de clientes</p>
          </div>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-teal-500/25 font-medium cursor-pointer"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
        <input
          type="text"
          placeholder="Buscar por nombre, email o documento..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {clients.length === 0 && !loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-500">
            <Users className="h-16 w-16 mb-4 text-slate-600" />
            <p className="text-lg font-medium">No se encontraron clientes</p>
            <p className="text-sm">Intenta con otros términos de búsqueda</p>
          </div>
        ) : (
          clients.map((client, index) => (
            <div
              key={client.idClient}
              style={{ animationDelay: `${index * 50}ms` }}
              className="group relative bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-2xl p-6 card-hover animate-fade-in"
            >
              {/* Header de la tarjeta */}
              <div className="flex items-start gap-4 mb-5">
                {/* Avatar con iniciales */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg shadow-rose-500/20">
                  {client.firstName[0]}{client.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate group-hover:text-teal-400 transition-colors">
                    {client.firstName} {client.lastName}
                  </h3>
                  <span className="badge badge-default mt-1">
                    {client.documentType?.name}: {client.documentNumber}
                  </span>
                </div>
                {/* Acciones */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => handleEdit(client)}
                    className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-teal-400 transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(client.idClient)}
                    className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-red-400 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Info de contacto */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-400 group/item hover:text-slate-300 transition-colors">
                  <div className="p-2 rounded-lg bg-slate-700/50 group-hover/item:bg-teal-500/20 transition-colors">
                    <Mail className="h-4 w-4 text-teal-500" />
                  </div>
                  <span className="truncate text-sm">{client.email}</span>
                </div>

                <div className="flex items-center gap-3 text-slate-400 group/item hover:text-slate-300 transition-colors">
                  <div className="p-2 rounded-lg bg-slate-700/50 group-hover/item:bg-teal-500/20 transition-colors">
                    <Phone className="h-4 w-4 text-teal-500" />
                  </div>
                  <span className="text-sm">{client.phone}</span>
                </div>

                {client.address && (
                  <div className="flex items-start gap-3 text-slate-400 group/item hover:text-slate-300 transition-colors">
                    <div className="p-2 rounded-lg bg-slate-700/50 group-hover/item:bg-teal-500/20 transition-colors shrink-0">
                      <MapPin className="h-4 w-4 text-teal-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">
                        {client.address.street} {client.address.number}
                      </p>
                      {client.address.district && (
                        <p className="text-xs text-slate-500 truncate">
                          {client.address.district.name}
                          {client.address.district.province &&
                            `, ${client.address.district.province.name}`}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2.5 bg-slate-800/50 text-slate-300 rounded-xl hover:bg-slate-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all border border-slate-700/50"
            >
              Anterior
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-xl font-medium transition-all ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/25'
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2.5 bg-slate-800/50 text-slate-300 rounded-xl hover:bg-slate-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all border border-slate-700/50"
            >
              Siguiente
            </button>
          </div>
          <span className="text-sm text-slate-500">
            Página {currentPage} de {totalPages}
          </span>
        </div>
      )}

      {showModal && (
        <ClientModal
          client={editingClient}
          documentTypes={documentTypes}
          departments={departments}
          provinces={provinces}
          districts={districts}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {showConfirmModal && (
        <ConfirmationModal
          message="¿Está seguro de eliminar este cliente?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}
