'use client';

import { Select } from '@chakra-ui/react';
import { useFriggState } from '../hooks/useFriggState';

const fontOptions = [
  { value: 'inter', label: 'Inter (Default)', family: 'Inter, sans-serif' },
  { value: 'roboto', label: 'Roboto', family: 'Roboto, sans-serif' },
  { value: 'open-sans', label: 'Open Sans', family: 'Open Sans, sans-serif' },
  { value: 'lato', label: 'Lato', family: 'Lato, sans-serif' },
  { value: 'poppins', label: 'Poppins', family: 'Poppins, sans-serif' },
  { value: 'montserrat', label: 'Montserrat', family: 'Montserrat, sans-serif' },
  { value: 'source-sans', label: 'Source Sans Pro', family: 'Source Sans Pro, sans-serif' },
  { value: 'ubuntu', label: 'Ubuntu', family: 'Ubuntu, sans-serif' },
  { value: 'nunito', label: 'Nunito', family: 'Nunito, sans-serif' },
  { value: 'system', label: 'System Default', family: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif' },
  { value: 'fira-code', label: 'Fira Code (Mono)', family: 'Fira Code, Consolas, Monaco, monospace' },
  { value: 'jetbrains-mono', label: 'JetBrains Mono', family: 'JetBrains Mono, Consolas, Monaco, monospace' }
];

export default function FontSelector() {
  const { selectedFont, setFont, isDarkMode } = useFriggState();

  const handleFontChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newFont = event.target.value;
    setFont(newFont);
    
    // Apply the font to the body immediately
    const selectedFontOption = fontOptions.find(font => font.value === newFont);
    if (selectedFontOption) {
      document.body.style.fontFamily = selectedFontOption.family;
    }
  };

  return (
    <Select
      value={selectedFont}
      onChange={handleFontChange}
      size="sm"
      width="180px"
      bg={isDarkMode ? 'gray.700' : 'white'}
      color={isDarkMode ? 'white' : 'gray.800'}
      borderColor={isDarkMode ? 'gray.600' : 'gray.300'}
      _hover={{
        borderColor: isDarkMode ? 'gray.500' : 'gray.400'
      }}
      _focus={{
        borderColor: 'blue.500',
        boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)'
      }}
    >
      {fontOptions.map((font) => (
        <option 
          key={font.value} 
          value={font.value}
          style={{ 
            backgroundColor: isDarkMode ? '#2D3748' : '#FFFFFF',
            color: isDarkMode ? '#FFFFFF' : '#1A202C'
          }}
        >
          {font.label}
        </option>
      ))}
    </Select>
  );
}