'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useFriggState } from '../hooks/useFriggState';

type ToolType = 'QuickQuote' | 'LifeExpectancy';

interface QuickQuoteParams {
  age: string;
  gender: 'male' | 'female' | '';
  smoker: 'yes' | 'no' | '';
  coverageAmount: string;
}

interface LifeExpectancyParams {
  age: string;
  gender: 'male' | 'female' | '';
  healthConditions: string;
  lifestyle: 'sedentary' | 'active' | 'very_active' | '';
  generateImage: boolean;
}

interface StructuredInputProps {
  width: number;
  onResize: (width: number) => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

const StructuredInput: React.FC<StructuredInputProps> = ({ 
  width, 
  onResize,
  isMinimized = false,
  onToggleMinimize 
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ToolType>('QuickQuote');
  const [quickQuoteParams, setQuickQuoteParams] = useState<QuickQuoteParams>({
    age: '',
    gender: '',
    smoker: '',
    coverageAmount: ''
  });
  const [lifeExpectancyParams, setLifeExpectancyParams] = useState<LifeExpectancyParams>({
    age: '',
    gender: '',
    healthConditions: '',
    lifestyle: '',
    generateImage: false
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useFriggState();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const newWidth = e.clientX - rect.left;
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

  const handleQuickQuoteChange = (field: keyof QuickQuoteParams, value: string) => {
    setQuickQuoteParams(prev => ({ ...prev, [field]: value }));
  };

  const handleLifeExpectancyChange = (field: keyof LifeExpectancyParams, value: string | boolean) => {
    setLifeExpectancyParams(prev => ({ ...prev, [field]: value }));
  };

  // Helper functions for consistent theming
  const inputClassName = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
    isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
  }`;
  
  const labelClassName = `block text-sm font-medium mb-1 transition-colors duration-200 ${
    isDarkMode ? 'text-gray-300' : 'text-gray-700'
  }`;
  
  const buttonClassName = (color: string) => `w-full text-white py-2 px-4 rounded-md transition-colors ${
    color === 'blue' 
      ? 'bg-blue-600 hover:bg-blue-700' 
      : 'bg-green-600 hover:bg-green-700'
  }`;

  const renderQuickQuoteForm = () => (
    <div className="space-y-4">
      <div>
        <label className={labelClassName}>Age</label>
        <input
          type="number"
          value={quickQuoteParams.age}
          onChange={(e) => handleQuickQuoteChange('age', e.target.value)}
          className={inputClassName}
          placeholder="Enter age"
        />
      </div>
      
      <div>
        <label className={labelClassName}>Gender</label>
        <select
          value={quickQuoteParams.gender}
          onChange={(e) => handleQuickQuoteChange('gender', e.target.value)}
          className={inputClassName}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      
      <div>
        <label className={labelClassName}>Smoker</label>
        <select
          value={quickQuoteParams.smoker}
          onChange={(e) => handleQuickQuoteChange('smoker', e.target.value)}
          className={inputClassName}
        >
          <option value="">Select smoking status</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
      
      <div>
        <label className={labelClassName}>Coverage Amount ($)</label>
        <input
          type="number"
          value={quickQuoteParams.coverageAmount}
          onChange={(e) => handleQuickQuoteChange('coverageAmount', e.target.value)}
          className={inputClassName}
          placeholder="Enter coverage amount"
        />
      </div>
      
      <button className={buttonClassName('blue')}>
        Get Quote
      </button>
    </div>
  );

  const renderLifeExpectancyForm = () => (
    <div className="space-y-4">
      <div>
        <label className={labelClassName}>Age</label>
        <input
          type="number"
          value={lifeExpectancyParams.age}
          onChange={(e) => handleLifeExpectancyChange('age', e.target.value)}
          className={inputClassName}
          placeholder="Enter age"
        />
      </div>
      
      <div>
        <label className={labelClassName}>Gender</label>
        <select
          value={lifeExpectancyParams.gender}
          onChange={(e) => handleLifeExpectancyChange('gender', e.target.value)}
          className={inputClassName}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      
      <div>
        <label className={labelClassName}>Health Conditions</label>
        <textarea
          value={lifeExpectancyParams.healthConditions}
          onChange={(e) => handleLifeExpectancyChange('healthConditions', e.target.value)}
          className={`${inputClassName} resize-none`}
          rows={3}
          placeholder="List any health conditions"
        />
      </div>
      
      <div>
        <label className={labelClassName}>Lifestyle</label>
        <select
          value={lifeExpectancyParams.lifestyle}
          onChange={(e) => handleLifeExpectancyChange('lifestyle', e.target.value)}
          className={inputClassName}
        >
          <option value="">Select lifestyle</option>
          <option value="sedentary">Sedentary</option>
          <option value="active">Active</option>
          <option value="very_active">Very Active</option>
        </select>
      </div>
      
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={lifeExpectancyParams.generateImage}
            onChange={(e) => handleLifeExpectancyChange('generateImage', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className={`text-sm font-medium transition-colors duration-200 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Generate visualization image</span>
        </label>
      </div>
      
      <button className={buttonClassName('blue')}>
        Calculate Life Expectancy
      </button>
    </div>
  );

  if (isMinimized) {
    return (
      <div className={`h-full border-r shadow-sm relative flex-shrink-0 w-12 transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className={`p-2 border-b flex items-center justify-center transition-colors duration-200 ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button 
            onClick={onToggleMinimize}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronUpIcon className="w-5 h-5 text-gray-600 transform rotate-90" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`h-full border-r shadow-sm relative flex-shrink-0 transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}
      style={{ width }}
    >
      <div 
        className="absolute top-0 right-0 w-1 h-full bg-gray-200 hover:bg-gray-300 cursor-col-resize transition-colors"
        onMouseDown={() => setIsResizing(true)}
      />
      
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Structured Input</h3>
        <button 
          onClick={onToggleMinimize}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronDownIcon className="w-5 h-5 text-gray-600 transform rotate-90" />
        </button>
      </div>
      
      <div className="p-4 border-b border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Tool</label>
        <select
          value={selectedTool}
          onChange={(e) => setSelectedTool(e.target.value as ToolType)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="QuickQuote">Quick Quote</option>
          <option value="LifeExpectancy">Life Expectancy</option>
        </select>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTool}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {selectedTool === 'QuickQuote' ? renderQuickQuoteForm() : renderLifeExpectancyForm()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StructuredInput;