import React, { useEffect } from 'react';

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColorClass?: string;
  cancelColorClass?: string;
  icon?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title = 'Confirm',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmColorClass = 'bg-blue-600 text-white hover:bg-blue-700',
  cancelColorClass = 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  icon,
  onConfirm,
  onCancel,
}) => {
  // Auto close after 2 seconds
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (open) {
      timer = setTimeout(() => {
        onCancel(); // Or use onConfirm() if you want auto-confirm
      }, 2000);
    }
    return () => clearTimeout(timer); // Clear on unmount or prop change
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-100">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        {icon && <div className="flex justify-center mb-2">{icon}</div>}
        <h3 className="text-lg font-semibold mb-2 text-center">{title}</h3>
        <p className="mb-6 text-gray-700 text-center">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            className={`px-4 py-2 rounded ${cancelColorClass}`}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className={`px-4 py-2 rounded ${confirmColorClass}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
