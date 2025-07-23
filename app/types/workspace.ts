// Core types for the unified cognitive workspace

// Panel Identification
export type PanelType = 'structured-input' | 'conversation' | 'structured-output';

// Structured Input Types
export interface StructuredInputData {
  toolType: 'QuickQuote' | 'LifeExpectancy';
  formData: Record<string, any>;
  isComplete: boolean;
  validationErrors?: Record<string, string>;
}

// Conversation Types
export interface ConversationMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  runId?: string;
  sources?: Source[];
  relatedStructuredData?: string[]; // IDs of related structured inputs
}

export interface Source {
  title: string;
  url: string;
  content: string;
}

// Structured Output Types
export interface StructuredOutputData {
  id: string;
  type: 'calculation' | 'visualization' | 'export' | 'analysis';
  title: string;
  data: any;
  sourceInputId?: string; // Links back to the structured input that generated this
  sourceMessageId?: string; // Links back to the conversation message that generated this
  timestamp: Date;
  exportFormats?: string[];
}

// Cross-Panel Events
export interface WorkspaceEvent {
  id: string;
  type: WorkspaceEventType;
  source: PanelType;
  target?: PanelType | 'all';
  payload: any;
  timestamp: Date;
}

export type WorkspaceEventType = 
  // Conversation → Structure
  | 'conversation-suggests-structured-input'
  | 'conversation-provides-context'
  
  // Structure → Conversation
  | 'structured-data-ready'
  | 'structured-input-completed'
  
  // Backend → Output
  | 'backend-response-structured'
  | 'backend-response-conversational'
  
  // Cross-panel state
  | 'context-updated'
  | 'workflow-started'
  | 'workflow-completed'
  
  // UI state
  | 'panel-focus-changed'
  | 'panel-minimized'
  | 'panel-expanded';

// Session Context - the shared brain of the workspace
export interface SessionContext {
  userId: string;
  conversationId: string;
  
  // Current state
  activeWorkflow?: string;
  conversationHistory: ConversationMessage[];
  structuredInputs: Record<string, StructuredInputData>;
  structuredOutputs: Record<string, StructuredOutputData>;
  
  // Cross-panel awareness
  contextualData: Record<string, any>; // Extracted entities, preferences, etc.
  suggestedActions: WorkspaceSuggestion[];
  
  // UI state
  panelStates: Record<PanelType, PanelState>;
}

export interface WorkspaceSuggestion {
  id: string;
  type: 'structured-input' | 'conversation-followup' | 'export-data' | 'workflow-template';
  title: string;
  description: string;
  action: WorkspaceEvent;
  priority: 'low' | 'medium' | 'high';
  expiresAt?: Date;
}

export interface PanelState {
  isMinimized: boolean;
  width: number;
  isVisible: boolean;
  hasUnreadUpdates: boolean;
  lastInteraction?: Date;
}

// API Integration Types
export interface APIRequest {
  id: string;
  endpoint: string;
  payload: any;
  context: SessionContext;
  expectedOutputType: 'conversational' | 'structured' | 'both';
}

export interface APIResponse {
  id: string;
  status: 'success' | 'error' | 'partial';
  conversationalResponse?: string;
  structuredResponse?: StructuredOutputData;
  suggestions?: WorkspaceSuggestion[];
  contextUpdates?: Record<string, any>;
  error?: string;
}

// Workflow Definition Types (for future expansion)
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  category: string;
  tags: string[];
}

export interface WorkflowStep {
  id: string;
  type: 'structured-input' | 'conversation' | 'api-call' | 'user-decision';
  title: string;
  description: string;
  requiredData?: string[];
  produces?: string[];
  nextSteps?: string[];
}