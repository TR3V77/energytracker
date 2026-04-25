import React, { useState } from "react";
import { ResetProgressModal } from "./ResetProgressModal";

/**
 * ResetProgressButton Component
 * Handle UI for reset action (button + modal state)
 * Only accepts onReset callback, nothing else
 */
export const ResetProgressButton = ({ onReset }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirm = () => {
    onReset();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  if (!onReset) return null;

  return (
    <>
      <button
        className="btn btn-outline-secondary btn-sm rounded-pill"
        onClick={() => setIsModalOpen(true)}
        title="Reset all implementation progress"
      >
        🔄 Reset Progress
      </button>
      
      <ResetProgressModal
        isOpen={isModalOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};