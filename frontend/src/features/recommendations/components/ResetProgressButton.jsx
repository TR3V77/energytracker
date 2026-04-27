import React, { useState } from "react";

export const ResetProgressButton = ({ onReset }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirm = () => {
    onReset();  // This calls resetAllProgress from the hook
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        className="btn btn-outline-secondary btn-sm rounded-pill"
        onClick={() => setIsModalOpen(true)}
        title="Reset all implementation progress"
      >
        🔄 Reset Progress
      </button>
      
      {isModalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reset All Progress?</h5>
                <button type="button" className="btn-close" onClick={handleCancel}></button>
              </div>
              <div className="modal-body">
                <p>This will reset all recommendation statuses to "Not Started".</p>
                <p className="text-muted small mb-0">
                  Progress will be set to 0% and all implemented/completed recommendations will be marked as not started.
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleConfirm}>
                  Yes, Reset Progress
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};