import React from 'react';
import { X } from './AppleIcon';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border shadow-lg bg-white rounded-3">
          <div className="modal-header border-bottom">
            <div>
              <h5 className="modal-title fw-bold text-navy" style={{ color: '#112E51' }}>{title}</h5>
              {description && <p className="text-muted small mb-0">{description}</p>}
            </div>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>

          <div className="modal-body max-h-70vh overflow-auto">
            {children}
          </div>

          {footer && (
            <div className="modal-footer border-top">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
