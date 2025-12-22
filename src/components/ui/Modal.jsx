import React, { useEffect, useRef } from 'react';
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
    const modalRef = useRef(null);

    // Handle ESC key to close
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Focus trap
    useEffect(() => {
        if (isOpen && modalRef.current) {
            const focusableElements = modalRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }
    }, [isOpen]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles['modal-backdrop']} onClick={handleBackdropClick} role="dialog" aria-modal="true">
            <div className={styles.modal} ref={modalRef}>
                {title && (
                    <div className={styles['modal-header']}>
                        <h2 className={styles['modal-title']}>{title}</h2>
                        <button
                            className={styles['modal-close']}
                            onClick={onClose}
                            aria-label="Close modal"
                        >
                            ×
                        </button>
                    </div>
                )}
                <div className={styles['modal-body']}>{children}</div>
                {footer && <div className={styles['modal-footer']}>{footer}</div>}
            </div>
        </div>
    );
};

export default Modal;
