import { QRCodeSVG } from 'qrcode.react';
import './QRModal.css';

export default function QRModal({ open, onClose, codigo, titulo }) {
  if (!open) return null;

  return (
    <div className="qr-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="qr-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="qr-modal-title"
      >
        <button type="button" className="qr-modal__close" onClick={onClose} aria-label="Cerrar">
          ×
        </button>
        <h2 id="qr-modal-title" className="qr-modal__title">
          {titulo || 'Tu cupón Ecoo'}
        </h2>
        <p className="qr-modal__hint">Muestra este código en caja para canjear</p>
        <div className="qr-modal__code-wrap">
          <QRCodeSVG value={codigo} size={200} level="H" includeMargin />
        </div>
        <p className="qr-modal__uuid">{codigo}</p>
      </div>
    </div>
  );
}
