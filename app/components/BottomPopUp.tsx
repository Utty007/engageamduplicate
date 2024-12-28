import React, { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BottomPopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const BottomPopup: React.FC<BottomPopupProps> = ({ 
  isOpen, 
  onClose, 
  children,
  title 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Popup Container */}
          <motion.div 
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-white"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            style={{ 
              height: '70vh', 
              maxHeight: '70vh' 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Popup Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              {title && (
                <h2 className="text-xl font-semibold text-gray-800">
                  {title}
                </h2>
              )}
              <button 
                onClick={onClose}
                className="ml-auto text-gray-500 hover:text-gray-700"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="overflow-y-auto p-6 h-[calc(70vh-60px)]">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Example Usage Component
const BottomPopupExample: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div>
      <button 
        onClick={togglePopup} 
        className="bg-primary text-white px-4 py-2 rounded"
      >
        Open Popup
      </button>

      <BottomPopup 
        isOpen={isPopupOpen} 
        onClose={togglePopup}
        title="Example Popup"
      >
        <div>
          <h3 className="text-lg font-medium mb-4">Popup Content</h3>
          <p>
            This is a reusable bottom popup component with an overlay effect. 
            You can place any content inside it.
          </p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li>Fully responsive</li>
            <li>Animated with framer-motion</li>
            <li>Clickable overlay</li>
            <li>Customizable title</li>
          </ul>
        </div>
      </BottomPopup>
    </div>
  );
};

export { BottomPopup, BottomPopupExample };