'use client';
import React from 'react';

type OverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Overlay = ({ isOpen, onClose, children }: OverlayProps) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Overlay background */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Content container */}
      <div className="relative z-10 w-full p-8 sm:w-auto sm:p-0" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Overlay;
