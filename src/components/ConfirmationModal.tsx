import { X, AlertTriangle } from 'lucide-react';
import React from 'react';

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({ message, onConfirm, onCancel }: ConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl max-w-sm w-full shadow-2xl animate-scale-in">
        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-white text-center mb-2">
            Confirmar Acción
          </h3>
          
          {/* Message */}
          <p className="text-slate-400 text-center mb-6">{message}</p>
          
          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 text-slate-300 bg-slate-700/50 rounded-xl hover:bg-slate-600/50 transition-colors font-medium border border-slate-600/50"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:to-rose-600 transition-all shadow-lg shadow-red-500/25 font-medium"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
