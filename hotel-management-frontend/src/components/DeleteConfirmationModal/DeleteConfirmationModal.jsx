import React from 'react';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, hotelName }) => {
    if (!isOpen) return null;

    const handleConfirm = (e) => {
        e.preventDefault();
        onConfirm();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Confirm Deletion</h5>
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={onClose}
                        aria-label="Close"
                    ></button>
                </div>
                <div className="modal-body">
                    <p>Are you sure you want to delete the hotel "{hotelName}"?</p>
                    <p className="text-danger">This action cannot be undone.</p>
                </div>
                <div className="modal-footer">
                    <button 
                        type="button" 
                        className="btn btn-outline-secondary" 
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-danger" 
                        onClick={handleConfirm}
                    >
                        Delete Hotel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;