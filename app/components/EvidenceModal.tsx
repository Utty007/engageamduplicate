'use client';
import React, { useState, useRef } from 'react';
import Overlay from './Overlay';
import { X, Upload } from 'lucide-react';

type EvidenceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File | null, description: string) => void;
  describe: string;
};

const EvidenceModal: React.FC<EvidenceModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  describe
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleModalClose = () => {
    setSelectedFile(null);
    setDescription('');
    onClose();
  }

  const handleSubmit = () => {
    // Now requires description to be non-empty
    if (description.trim() && (selectedFile || description.trim())) {
      onSubmit(selectedFile, description);
      // Reset form
      handleModalClose();
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Overlay isOpen={isOpen} onClose={() => {
      handleModalClose();
    }}>
      <div className="bg-white rounded-lg shadow-xl w-full sm:w-[500px] max-w-full p-6">
        {/* Modal Header */}
        <div className="flex justify-between border-b border-grey-stroke items-center pb-2 mb-4">
          <h2 className="text-xl font-semibold text-dark-100">
            Upload Evidence
          </h2>
          
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <p className='text-base text-grey-700 mb-4'>
          {describe}
        </p>
        {/* File Upload Section */}
        <div 
          className={`border-2 border-dashed rounded-lg p-6 mb-4 text-center 
            ${selectedFile 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-300 hover:border-primary'}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            id="file-upload"
          />
          
          {selectedFile ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Upload size={24} className="text-green-500" />
                <span className="text-sm truncate max-w-[300px]">
                  {selectedFile.name}
                </span>
              </div>
              <button 
                onClick={removeFile} 
                className="text-red-500 hover:text-red-700"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                <Upload size={40} className="text-gray-400 mb-2" />
                <p className="text-gray-600">
                  Drag and drop or <span className="text-primary">browse</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PNG, JPG, JPEG
                </p>
              </div>
            </label>
          )}
        </div>

        {/* Description Textarea */}
        <textarea 
          placeholder="Provide additional context for your evidence (Required)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 
            focus:outline-none focus:ring-2 focus:ring-primary/50 
            resize-y min-h-[100px]"
          required
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!description.trim()}
          className={`w-full py-3 rounded-lg text-white font-semibold 
            ${description.trim()
              ? 'bg-primary hover:bg-primary/90'
              : 'bg-gray-300 cursor-not-allowed'}`}
        >
          Submit Evidence
        </button>
      </div>
    </Overlay>
  );
};

export default EvidenceModal;