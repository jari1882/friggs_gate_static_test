'use client';

import { create } from 'zustand';

interface FriggState {
  // Layout state
  structuredInputWidth: number;
  structuredOutputDockWidth: number;
  isStructuredOutputOpen: boolean;
  isStructuredInputMinimized: boolean;
  isStructuredOutputMinimized: boolean;
  
  // Theme state
  isDarkMode: boolean;
  
  // Layout actions
  setStructuredInputWidth: (width: number) => void;
  setStructuredOutputDockWidth: (width: number) => void;
  setStructuredOutputOpen: (open: boolean) => void;
  setStructuredInputMinimized: (minimized: boolean) => void;
  setStructuredOutputMinimized: (minimized: boolean) => void;
  
  // Theme actions
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
  
  // Memory state
  memories: string[];
  selectedMemory: string | null;
  
  // Memory actions
  setMemories: (memories: string[]) => void;
  selectMemory: (memory: string) => void;
}

export const useFriggState = create<FriggState>((set) => ({
  // Initial layout state
  structuredInputWidth: 300,
  structuredOutputDockWidth: 300,
  isStructuredOutputOpen: true,
  isStructuredInputMinimized: false,
  isStructuredOutputMinimized: false,
  
  // Initial theme state
  isDarkMode: false,
  
  // Layout actions
  setStructuredInputWidth: (width) => set({ structuredInputWidth: width }),
  setStructuredOutputDockWidth: (width) => set({ structuredOutputDockWidth: width }),
  setStructuredOutputOpen: (open) => set({ isStructuredOutputOpen: open }),
  setStructuredInputMinimized: (minimized) => set({ isStructuredInputMinimized: minimized }),
  setStructuredOutputMinimized: (minimized) => set({ isStructuredOutputMinimized: minimized }),
  
  // Theme actions
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setTheme: (isDark) => set({ isDarkMode: isDark }),
  
  // Initial memory state
  memories: ['Conversation 1 - 10/31', 'Conversation 2 - Today', 'Conversation 3 - 10/29', 'Conversation 4 - 10/28', 'Conversation 5 - 10/27'],
  selectedMemory: null,
  
  // Memory actions
  setMemories: (memories) => set({ memories }),
  selectMemory: (memory) => set({ selectedMemory: memory }),
}));