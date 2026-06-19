import React, { useEffect, useRef } from 'react';
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
  maxWidth = 'max-w-[560px]'
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap / Body scroll locking
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      } else {
        modalRef.current?.focus();
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-[8px] transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Dialog Box */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`
          relative w-full ${maxWidth} bg-[var(--co-surface-1)] border border-[var(--co-separator)]
          rounded-[20px] shadow-[var(--co-shadow-modal)] p-7 outline-none
          apple-scale-in flex flex-col z-[1010]
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-6">
            <h3 id="modal-title" className="text-[20px] font-bold tracking-[-0.1px] text-[var(--apple-text)]">
              {title}
            </h3>
            {description && (
              <p className="text-[14px] text-[var(--co-gray-1)] mt-1.5 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[var(--apple-surface-hover)] dark:hover:bg-[rgba(255,255,255,0.08)] text-[var(--co-gray-1)] hover:text-[var(--apple-text)] transition-colors active:scale-95 shrink-0"
            aria-label="Cerrar modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto max-h-[70vh] py-1 -webkit-overflow-scrolling-touch">
          {children}
        </div>

        {/* Footer Actions */}
        {footer && (
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[var(--co-separator)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
