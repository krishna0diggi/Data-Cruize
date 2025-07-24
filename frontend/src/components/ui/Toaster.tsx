import React from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  type: ToastType;
  message: string;
  onClose?: () => void;
}

const iconMap = {
  success: <CheckCircle className="text-green-600" size={20} />,
  error: <XCircle className="text-red-600" size={20} />,
  info: <Info className="text-blue-600" size={20} />,
  warning: <AlertTriangle className="text-yellow-600" size={20} />,
};

const Toaster: React.FC<ToastProps> = ({ type, message, onClose }) => {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded shadow-lg bg-white border-l-4 transition-all duration-300
      ${type === 'success' ? 'border-green-600' : ''}
      ${type === 'error' ? 'border-red-600' : ''}
      ${type === 'info' ? 'border-blue-600' : ''}
      ${type === 'warning' ? 'border-yellow-600' : ''}
    `}>
      {iconMap[type]}
      <span className="text-sm text-gray-800">{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-700">
          <XCircle size={18} />
        </button>
      )}
    </div>
  );
};

export default Toaster;
