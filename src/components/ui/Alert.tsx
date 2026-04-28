import React from 'react';
import { AlertCircle } from 'lucide-react';

interface AlertProps {
  type: 'error' | 'success' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const bgColor = {
    error: 'bg-red-100',
    success: 'bg-green-100',
    warning: 'bg-yellow-100',
    info: 'bg-blue-100',
  };

  const textColor = {
    error: 'text-red-800',
    success: 'text-green-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  };

  const borderColor = {
    error: 'border-red-300',
    success: 'border-green-300',
    warning: 'border-yellow-300',
    info: 'border-blue-300',
  };

  return (
    <div className={`${bgColor[type]} ${textColor[type]} border-l-4 ${borderColor[type]} p-4 mb-4 flex items-start justify-between`}>
      <div className="flex items-start gap-2">
        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <p>{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-xl font-bold">
          ×
        </button>
      )}
    </div>
  );
};
