'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useFriggState } from '../hooks/useFriggState';

interface MemorySliderProps {
  memories: string[];
  onSelect: (memory: string) => void;
}

const MemorySlider: React.FC<MemorySliderProps> = ({ memories, onSelect }) => {
  const { isDarkMode } = useFriggState();
  
  return (
    <div className="w-full">
      <div className={`border rounded-lg p-6 transition-colors duration-200 ${
        isDarkMode 
          ? 'border-gray-600 bg-gray-800' 
          : 'border-gray-300 bg-white'
      }`}>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
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