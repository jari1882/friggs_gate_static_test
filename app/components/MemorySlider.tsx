'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ViewOffIcon, ViewIcon } from '@chakra-ui/icons';
import { useFriggState } from '../hooks/useFriggState';

interface MemorySliderProps {
  memories: string[];
  onSelect: (memory: string) => void;
}

const MemorySlider: React.FC<MemorySliderProps> = ({ memories, onSelect }) => {
  const { isDarkMode } = useFriggState();
  const [isMinimized, setIsMinimized] = useState(true);
  
  // Add dynamic CSS for dark mode scrollbar
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .memory-slider-scrollbar::-webkit-scrollbar-thumb {
        background: ${isDarkMode ? '#4B5563' : '#D1D5DB'};
      }
      .memory-slider-scrollbar::-webkit-scrollbar-thumb:hover {
        background: ${isDarkMode ? '#6B7280' : '#9CA3AF'};
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [isDarkMode]);
  
  if (isMinimized) {
    return (
      <div className="w-full">
        <div className={`border rounded-lg p-3 transition-colors duration-200 relative ${
          isDarkMode 
            ? 'border-gray-600 bg-gray-800' 
            : 'border-gray-300 bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium transition-colors duration-200 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Memory ({memories.length} items)
            </span>
            <button 
              onClick={() => setIsMinimized(false)}
              className={`p-1 rounded transition-colors duration-200 ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <ViewIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className={`border rounded-lg p-6 transition-colors duration-200 relative ${
        isDarkMode 
          ? 'border-gray-600 bg-gray-800' 
          : 'border-gray-300 bg-white'
      }`}>
        <button 
          onClick={() => setIsMinimized(true)}
          className={`absolute top-1 right-1 p-1 rounded transition-colors duration-200 ${
            isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          }`}
        >
          <ViewOffIcon className="w-4 h-4" />
        </button>
        
        <div 
          className="flex gap-4 overflow-x-auto pb-6 memory-slider-scrollbar pr-12" 
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: isDarkMode ? '#4B5563 #1F2937' : '#D1D5DB #F9FAFB'
          }}
        >
          {memories.map((memory, index) => (
            <motion.button
              key={index}
              onClick={() => onSelect(memory)}
              className={`flex-shrink-0 border rounded-lg px-6 py-4 text-base font-medium transition-colors whitespace-nowrap ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 hover:border-gray-500' 
                  : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {memory}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemorySlider;