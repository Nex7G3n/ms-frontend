import { X } from 'lucide-react';

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({ message, onConfirm, onCancel }: ConfirmationModalProps) {
  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal-content">
        <div className="confirmation-modal-header">
          <h2 className="confirmation-modal-title">Confirmar Eliminación</h2>
          <button onClick={onCancel} className="confirmation-modal-close-button">
            <X className="confirmation-modal-close-icon" />
          </button>
        </div>
        <div className="confirmation-modal-body">
          <p>{message}</p>
        </div>
        <div className="confirmation-modal-footer">
          <button onClick={onCancel} className="confirmation-modal-cancel-button">
            Cancelar
          </button>
          <button onClick={onConfirm} className="confirmation-modal-confirm-button">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
