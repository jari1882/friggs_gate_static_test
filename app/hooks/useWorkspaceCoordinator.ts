'use client';

import { create } from 'zustand';
import { ResponseInterpreter, UIAction } from '../services/responseInterpreter';

// Centralized workspace coordination state
// Manages panel visibility, tool selection, and cross-panel communication

interface WorkspaceState {
  // Panel states
  isStructuredInputMinimized: boolean;
  isStructuredOutputMinimized: boolean;
  selectedTool: 'QuickQuote' | 'LifeExpectancy' | null;
  
  // UI state
  showEmptyStateButtons: boolean;
  structuredOutputContent: string;
  formValidationMessage: string | null;
  
  // Actions
  openStructuredInput: (tool: 'QuickQuote' | 'LifeExpectancy') => void;
  openStructuredOutput: (content?: string) => void;
  toggleStructuredInput: () => void;
  toggleStructuredOutput: () => void;
  hideEmptyStateButtons: () => void;
  setFormValidationMessage: (message: string | null) => void;
  processBackendResponse: (response: any) => void;
  resetToEmptyState: () => void;
  executeUIAction: (action: UIAction) => void;
}

export const useWorkspaceCoordinator = create<WorkspaceState>((set, get) => ({
  // Initial state - matches empty state requirements
  isStructuredInputMinimized: true,
  isStructuredOutputMinimized: true,
  selectedTool: null,
  showEmptyStateButtons: true,
  structuredOutputContent: 'This is where your structured result would appear.',
  formValidationMessage: null,
  
  // Actions
  openStructuredInput: (tool) => {
    console.log(`📱 Opening structured input with tool: ${tool}`);
    set({
      isStructuredInputMinimized: false,
      selectedTool: tool,
      showEmptyStateButtons: false
    });
  },
  
  openStructuredOutput: (content) => {
    console.log('📊 Opening structured output panel');
    set({
      isStructuredOutputMinimized: false,
      structuredOutputContent: content || 'This is where your structured result would appear.',
      showEmptyStateButtons: false
    });
  },
  
  toggleStructuredInput: () => {
    set(state => ({
      isStructuredInputMinimized: !state.isStructuredInputMinimized
    }));
  },
  
  toggleStructuredOutput: () => {
    set(state => ({
      isStructuredOutputMinimized: !state.isStructuredOutputMinimized
    }));
  },
  
  hideEmptyStateButtons: () => {
    set({ showEmptyStateButtons: false });
  },
  
  setFormValidationMessage: (message) => {
    set({ formValidationMessage: message });
  },
  
  /**
   * Process backend response through ResponseInterpreter and execute resulting actions
   * This is the main integration point between backend responses and UI state
   */
  processBackendResponse: (response) => {
    console.log('🔄 Processing backend response for UI actions');
    
    // Use ResponseInterpreter to determine what UI actions should be taken
    const actions = ResponseInterpreter.interpretResponse(response);
    
    // Execute each action
    actions.forEach(action => {
      get().executeUIAction(action);
    });
    
    // Always hide empty state buttons when we get a backend response
    get().hideEmptyStateButtons();
  },
  
  /**
   * Execute a specific UI action
   * This provides a clean separation between action detection and execution
   */
  executeUIAction: (action: UIAction) => {
    console.log(`⚡ Executing UI action:`, action);
    
    switch (action.type) {
      case 'OPEN_STRUCTURED_INPUT':
        if (action.payload?.tool) {
          get().openStructuredInput(action.payload.tool);
        }
        break;
        
      case 'OPEN_STRUCTURED_OUTPUT':
        get().openStructuredOutput(action.payload?.content);
        break;
        
      case 'SHOW_MESSAGE':
        // Future: handle message display
        console.log('💬 Message action:', action.payload);
        break;
        
      default:
        console.warn('⚠️ Unknown UI action type:', action.type);
    }
  },
  
  /**
   * Reset workspace to initial empty state
   */
  resetToEmptyState: () => {
    console.log('🔄 Resetting to empty state');
    set({
      isStructuredInputMinimized: true,
      isStructuredOutputMinimized: true,
      selectedTool: null,
      showEmptyStateButtons: true,
      structuredOutputContent: 'This is where your structured result would appear.',
      formValidationMessage: null
    });
  }
}));