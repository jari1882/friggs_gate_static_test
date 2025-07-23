'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  SessionContext,
  WorkspaceEvent,
  WorkspaceEventType,
  PanelType,
  ConversationMessage,
  StructuredInputData,
  StructuredOutputData,
  WorkspaceSuggestion,
  PanelState
} from '../types/workspace';

// Workspace Actions
type WorkspaceAction = 
  | { type: 'ADD_MESSAGE'; message: ConversationMessage }
  | { type: 'UPDATE_STRUCTURED_INPUT'; id: string; data: StructuredInputData }
  | { type: 'ADD_STRUCTURED_OUTPUT'; output: StructuredOutputData }
  | { type: 'UPDATE_PANEL_STATE'; panel: PanelType; state: Partial<PanelState> }
  | { type: 'ADD_SUGGESTION'; suggestion: WorkspaceSuggestion }
  | { type: 'REMOVE_SUGGESTION'; id: string }
  | { type: 'UPDATE_CONTEXT'; updates: Record<string, any> }
  | { type: 'EMIT_EVENT'; event: WorkspaceEvent }
  | { type: 'SET_ACTIVE_WORKFLOW'; workflowId?: string };

// Initial state factory
const createInitialState = (userId: string, conversationId: string): SessionContext => ({
  userId,
  conversationId,
  conversationHistory: [],
  structuredInputs: {},
  structuredOutputs: {},
  contextualData: {},
  suggestedActions: [],
  panelStates: {
    'structured-input': {
      isMinimized: false,
      width: 350,
      isVisible: true,
      hasUnreadUpdates: false
    },
    'conversation': {
      isMinimized: false,
      width: 0, // Flex-grow
      isVisible: true,
      hasUnreadUpdates: false
    },
    'structured-output': {
      isMinimized: false,
      width: 400,
      isVisible: false,
      hasUnreadUpdates: false
    }
  }
});

// Workspace reducer
function workspaceReducer(state: SessionContext, action: WorkspaceAction): SessionContext {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        conversationHistory: [...state.conversationHistory, action.message]
      };

    case 'UPDATE_STRUCTURED_INPUT':
      return {
        ...state,
        structuredInputs: {
          ...state.structuredInputs,
          [action.id]: action.data
        }
      };

    case 'ADD_STRUCTURED_OUTPUT':
      return {
        ...state,
        structuredOutputs: {
          ...state.structuredOutputs,
          [action.output.id]: action.output
        },
        panelStates: {
          ...state.panelStates,
          'structured-output': {
            ...state.panelStates['structured-output'],
            isVisible: true,
            hasUnreadUpdates: true
          }
        }
      };

    case 'UPDATE_PANEL_STATE':
      return {
        ...state,
        panelStates: {
          ...state.panelStates,
          [action.panel]: {
            ...state.panelStates[action.panel],
            ...action.state
          }
        }
      };

    case 'ADD_SUGGESTION':
      return {
        ...state,
        suggestedActions: [...state.suggestedActions, action.suggestion]
      };

    case 'REMOVE_SUGGESTION':
      return {
        ...state,
        suggestedActions: state.suggestedActions.filter(s => s.id !== action.id)
      };

    case 'UPDATE_CONTEXT':
      return {
        ...state,
        contextualData: {
          ...state.contextualData,
          ...action.updates
        }
      };

    case 'SET_ACTIVE_WORKFLOW':
      return {
        ...state,
        activeWorkflow: action.workflowId
      };

    case 'EMIT_EVENT':
      // Event emission is handled by the context, but we can update state based on the event
      return state;

    default:
      return state;
  }
}

// Event bus type
type EventHandler = (event: WorkspaceEvent) => void;

// Workspace Context
interface WorkspaceContextType {
  state: SessionContext;
  
  // Message actions
  addMessage: (message: Omit<ConversationMessage, 'id' | 'timestamp'>) => void;
  
  // Structured input actions
  updateStructuredInput: (id: string, data: StructuredInputData) => void;
  
  // Structured output actions
  addStructuredOutput: (output: Omit<StructuredOutputData, 'timestamp'>) => void;
  
  // Panel management
  updatePanelState: (panel: PanelType, state: Partial<PanelState>) => void;
  
  // Suggestions
  addSuggestion: (suggestion: Omit<WorkspaceSuggestion, 'id'>) => void;
  removeSuggestion: (id: string) => void;
  
  // Context management
  updateContext: (updates: Record<string, any>) => void;
  
  // Event system
  emitEvent: (type: WorkspaceEventType, payload: any, target?: PanelType | 'all') => void;
  subscribeToEvents: (handler: EventHandler) => () => void;
  
  // Workflow management
  setActiveWorkflow: (workflowId?: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

// Event bus implementation
class EventBus {
  private handlers: EventHandler[] = [];

  subscribe(handler: EventHandler): () => void {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter(h => h !== handler);
    };
  }

  emit(event: WorkspaceEvent): void {
    this.handlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error('Error in event handler:', error);
      }
    });
  }
}

// Provider component
interface WorkspaceProviderProps {
  children: React.ReactNode;
  userId?: string;
  conversationId?: string;
}

export const WorkspaceProvider: React.FC<WorkspaceProviderProps> = ({
  children,
  userId = `user-${uuidv4()}`,
  conversationId = uuidv4()
}) => {
  const [state, dispatch] = useReducer(
    workspaceReducer,
    createInitialState(userId, conversationId)
  );

  const eventBus = React.useMemo(() => new EventBus(), []);

  // Actions
  const addMessage = useCallback((message: Omit<ConversationMessage, 'id' | 'timestamp'>) => {
    const fullMessage: ConversationMessage = {
      ...message,
      id: uuidv4(),
      timestamp: new Date()
    };
    dispatch({ type: 'ADD_MESSAGE', message: fullMessage });
    
    // Emit event for cross-panel awareness
    emitEvent('context-updated', { 
      newMessage: fullMessage,
      contextType: 'conversation'
    });
  }, []);

  const updateStructuredInput = useCallback((id: string, data: StructuredInputData) => {
    dispatch({ type: 'UPDATE_STRUCTURED_INPUT', id, data });
    
    if (data.isComplete) {
      emitEvent('structured-data-ready', {
        inputId: id,
        data: data.formData,
        toolType: data.toolType
      });
    }
  }, []);

  const addStructuredOutput = useCallback((output: Omit<StructuredOutputData, 'timestamp'>) => {
    const fullOutput: StructuredOutputData = {
      ...output,
      timestamp: new Date()
    };
    dispatch({ type: 'ADD_STRUCTURED_OUTPUT', output: fullOutput });
    
    emitEvent('backend-response-structured', {
      outputId: fullOutput.id,
      outputType: fullOutput.type,
      data: fullOutput.data
    });
  }, []);

  const updatePanelState = useCallback((panel: PanelType, panelState: Partial<PanelState>) => {
    dispatch({ type: 'UPDATE_PANEL_STATE', panel, state: panelState });
    
    emitEvent('panel-focus-changed', {
      panel,
      state: panelState
    });
  }, []);

  const addSuggestion = useCallback((suggestion: Omit<WorkspaceSuggestion, 'id'>) => {
    const fullSuggestion: WorkspaceSuggestion = {
      ...suggestion,
      id: uuidv4()
    };
    dispatch({ type: 'ADD_SUGGESTION', suggestion: fullSuggestion });
  }, []);

  const removeSuggestion = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_SUGGESTION', id });
  }, []);

  const updateContext = useCallback((updates: Record<string, any>) => {
    dispatch({ type: 'UPDATE_CONTEXT', updates });
    
    emitEvent('context-updated', {
      updates,
      contextType: 'data'
    });
  }, []);

  const emitEvent = useCallback((type: WorkspaceEventType, payload: any, target?: PanelType | 'all') => {
    const event: WorkspaceEvent = {
      id: uuidv4(),
      type,
      source: 'conversation', // This would be set by the calling component
      target,
      payload,
      timestamp: new Date()
    };
    
    dispatch({ type: 'EMIT_EVENT', event });
    eventBus.emit(event);
  }, [eventBus]);

  const subscribeToEvents = useCallback((handler: EventHandler) => {
    return eventBus.subscribe(handler);
  }, [eventBus]);

  const setActiveWorkflow = useCallback((workflowId?: string) => {
    dispatch({ type: 'SET_ACTIVE_WORKFLOW', workflowId });
    
    emitEvent('workflow-started', {
      workflowId,
      timestamp: new Date()
    });
  }, []);

  const contextValue: WorkspaceContextType = {
    state,
    addMessage,
    updateStructuredInput,
    addStructuredOutput,
    updatePanelState,
    addSuggestion,
    removeSuggestion,
    updateContext,
    emitEvent,
    subscribeToEvents,
    setActiveWorkflow
  };

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
};

// Hook to use workspace context
export const useWorkspace = (): WorkspaceContextType => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};