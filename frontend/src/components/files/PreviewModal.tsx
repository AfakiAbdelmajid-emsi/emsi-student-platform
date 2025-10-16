// components/files/PreviewModal.tsx
'use client';
import React from 'react';

interface PreviewModalProps {
  url: string;
  type: 'image' | 'pdf' | 'office' | 'text';
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ url, type, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-4 relative w-full max-w-3xl h-[80vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center"
          aria-label="Close preview"
        >
          ×
        </button>

        <div className="w-full h-full overflow-auto">
          {type === 'image' && (
            <img 
              src={url} 
              alt="Preview" 
              className="w-full h-full object-contain" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/file-error.png';
              }}
            />
          )}
          
          {type === 'pdf' && (
            <iframe 
              src={url} 
              className="w-full h-full" 
              title="PDF Preview"
              frameBorder="0"
            />
          )}
          
          {type === 'office' && (
            <iframe 
              src={url} 
              className="w-full h-full" 
              title="Office Document Preview"
              frameBorder="0"
              allowFullScreen
            />
          )}
          
          {type === 'text' && (
            <iframe 
              src={url} 
              className="w-full h-full" 
              title="Text File Preview"
              frameBorder="0"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;