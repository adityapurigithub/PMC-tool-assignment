import React from 'react';
import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
      <div className="bg-white p-6 md:p-8 rounded-3xl w-full max-w-lg shadow-2xl transform scale-100 transition-transform">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors focus:outline-none"
            title="Close"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default Modal;
