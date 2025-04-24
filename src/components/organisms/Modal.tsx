import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-md p-6 rounded-t-lg max-h-[50vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="mb-4 text-[#800080]"
          aria-label="Close modal"
        >
          Close
        </button>
        {children}
      </div>
    </div>
  );
};