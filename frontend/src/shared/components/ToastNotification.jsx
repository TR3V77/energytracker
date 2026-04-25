import React, { useEffect } from "react";

/**
 * ToastNotification Component
 * Display temporary notification messages
 * Can be reused across any feature
 */
export const ToastNotification = ({ message, type = "success", duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getBgClass = () => {
    switch (type) {
      case "success": return "bg-success";
      case "error": return "bg-danger";
      case "warning": return "bg-warning";
      default: return "bg-primary";
    }
  };

  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
      <div className="toast show" role="alert">
        <div className={`toast-header ${getBgClass()} text-white`}>
          <strong className="me-auto">
            {type === "success" && "✅"}
            {type === "error" && "❌"}
            {type === "warning" && "⚠️"}
            {type === "info" && "ℹ️"}
          </strong>
          <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
        </div>
        <div className="toast-body">
          {message}
        </div>
      </div>
    </div>
  );
};
