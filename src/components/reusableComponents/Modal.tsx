import React, { MouseEventHandler } from 'react';
import ReactDOM from 'react-dom';

interface IModalProps {
    active: boolean;
    className: string;
    onClose: MouseEventHandler;
}

const Modal: React.FC<IModalProps> = ({ active, className = '', onClose, children }): null | JSX.Element => {
    if (!active) return null;

    return ReactDOM.createPortal(
        <div className={`modal-container ${className}`} onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>,

        document.getElementById('modal')!,
    );
};

export default Modal;
