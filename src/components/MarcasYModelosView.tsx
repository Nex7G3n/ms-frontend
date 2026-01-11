import { useState, useEffect } from 'react';
import { Car, Loader2, RefreshCw } from 'lucide-react';
import MarcaView from './MarcaView';
import ModeloView from './ModeloView';
import { getMarcas } from '../services/apiMarcas';
import type { Marca } from '../types/modelMarca';

export default function MarcasYModelosView() {
  const [selectedMarcaId, setSelectedMarcaId] = useState<number | null>(null);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMarcas = async () => {
    try {
      setLoading(true);
      const fetchedMarcas = await getMarcas();
      setMarcas(fetchedMarcas);
    } catch (error) {
      console.error('Error loading marcas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarcas();
  }, []);

  const handleSelectMarca = (marcaId: number | null) => {
    setSelectedMarcaId(marcaId);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
        <p className="text-slate-400">Cargando marcas y modelos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-violet-500/25">
            <Car className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Marcas y Modelos</h2>
            <p className="text-sm text-slate-400">Gestiona las marcas y sus modelos de vehículos</p>
          </div>
        </div>
        <button
          onClick={loadMarcas}
          className="inline-flex items-center justify-center px-4 py-2 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-600/50 transition-all border border-slate-600/50 font-medium cursor-pointer"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </button>
      </div>

      {/* Split View Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Marcas Panel */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-5 min-h-[500px]">
          <MarcaView 
            marcas={marcas} 
            onSelectMarca={handleSelectMarca} 
            onMarcaChange={loadMarcas}
            selectedMarcaId={selectedMarcaId}
          />
        </div>
        
        {/* Modelos Panel */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-5 min-h-[500px]">
          <ModeloView 
            selectedMarcaId={selectedMarcaId} 
            marcas={marcas} 
          />
        </div>
      </div>
    </div>
  );
}
