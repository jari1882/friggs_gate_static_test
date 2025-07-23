'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { useFriggState } from '../hooks/useFriggState';

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useFriggState();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
      }`}
      whileTap={{ scale: 0.95 }}
    >
      <span className="sr-only">Toggle theme</span>
      <motion.span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
          isDarkMode ? 'translate-x-6' : 'translate-x-1'
        }`}
        animate={{
          x: isDarkMode ? 24 : 4,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      />
      {/* Icons */}
      <SunIcon 
        className={`absolute left-1 h-3 w-3 transition-opacity ${
          isDarkMode ? 'opacity-30' : 'opacity-70'
        }`}
        color={isDarkMode ? 'white' : 'orange.400'}
      />
      <MoonIcon 
        className={`absolute right-1 h-3 w-3 transition-opacity ${
          isDarkMode ? 'opacity-70' : 'opacity-30'
        }`}
        color={isDarkMode ? 'blue.200' : 'gray.400'}
      />
    </motion.button>
  );
};

export default ThemeToggle;