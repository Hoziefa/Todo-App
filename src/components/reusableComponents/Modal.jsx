import React from "react";
import ReactDOM from "react-dom";

const Modal = ({ active, onClose, className = "", children }) => {
    if (!active) return null;

    return ReactDOM.createPortal(
        <div className={`modal-container ${className}`} onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        document.getElementById("modal"),
    );
};

export default Modal;
