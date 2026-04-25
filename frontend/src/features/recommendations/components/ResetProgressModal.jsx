import React from "react";

/**
 * ResetProgressModal Component
 * Single Responsibility: Display confirmation dialog for reset action
 * Open/Closed: Can be extended with different messages without modifying core logic
 */
export const ResetProgressModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Reset All Progress?</h5>
            <button type="button" className="btn-close" onClick={onCancel} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>This will reset all recommendation statuses to "Not Started".</p>
            <p className="text-muted small mb-0">
              Progress will be set to 0% and all implemented/completed recommendations 
              will be marked as not started.
            </p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>
              Yes, Reset Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};