'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useFriggState } from '../hooks/useFriggState';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

interface StructuredOutputDockProps {
  content: React.ReactNode;
  isOpen: boolean;
  width: number;
  onResize: (width: number) => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

const StructuredOutputDock: React.FC<StructuredOutputDockProps> = ({ 
  content, 
  isOpen, 
  width, 
  onResize,
  isMinimized = false,
  onToggleMinimize 
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useFriggState();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const newWidth = rect.right - e.clientX;
      // Remove artificial limits - allow full screen width
      const clampedWidth = Math.max(200, Math.min(window.innerWidth - 50, newWidth));
      onResize(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, onResize]);

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className={`h-full border-l shadow-sm relative flex-shrink-0 w-12 transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className={`p-2 border-b flex items-center justify-center transition-colors duration-200 ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button 
            onClick={onToggleMinimize}
            className={`p-1 rounded transition-colors duration-200 ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <ChevronUpIcon className={`w-5 h-5 transition-colors duration-200 transform -rotate-90 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`h-full border-l shadow-sm relative flex-shrink-0 transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}
      style={{ width }}
    >
      <div 
        className={`absolute top-0 left-0 w-1 h-full cursor-col-resize transition-colors ${
          isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
        }`}
        onMouseDown={() => setIsResizing(true)}
      />
      
      <div className={`p-4 border-b flex items-center justify-between transition-colors duration-200 ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold transition-colors duration-200 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>Structured Output</h3>
        <button 
          onClick={onToggleMinimize}
          className={`p-1 rounded transition-colors duration-200 ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <ChevronDownIcon className={`w-5 h-5 transition-colors duration-200 transform rotate-90 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`} />
        </button>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {content}
        </motion.div>
      </div>
    </div>
  );
};

export default StructuredOutputDock;