'use client';

// Centralized agent activation detection and UI state coordination
// This service interprets backend responses and dispatches appropriate UI actions

export interface AgentActivationResponse {
  activatedAgents?: string[];
  // Future: add other response metadata here
}

export interface UIAction {
  type: 'OPEN_STRUCTURED_INPUT' | 'OPEN_STRUCTURED_OUTPUT' | 'SHOW_MESSAGE';
  payload?: any;
}

export class ResponseInterpreter {
  
  /**
   * Interprets backend response and returns UI actions that should be taken
   * This is the single source of truth for backend→frontend behavior mapping
   */
  static interpretResponse(response: any): UIAction[] {
    const actions: UIAction[] = [];
    
    // Extract agent activation metadata from backend response
    const activatedAgents = this.extractActivatedAgents(response);
    
    if (activatedAgents.length > 0) {
      console.log('🤖 Agent activation detected:', activatedAgents);
      
      // Map agent activations to UI actions
      for (const agent of activatedAgents) {
        const uiAction = this.mapAgentToUIAction(agent);
        if (uiAction) {
          actions.push(uiAction);
        }
      }
    }
    
    return actions;
  }
  
  /**
   * Extracts activated agents from backend response
   * Handles multiple possible response formats for flexibility
   */
  private static extractActivatedAgents(response: any): string[] {
    // Try multiple possible locations for agent metadata
    const possibleLocations = [
      response.output?.activatedAgents,
      response.activatedAgents,
      response.output?.metadata?.activatedAgents,
      response.metadata?.activatedAgents
    ];
    
    for (const location of possibleLocations) {
      if (Array.isArray(location)) {
        return location;
      }
    }
    
    // Fallback: check if response content mentions specific agents (temporary)
    return this.detectAgentsFromContent(response);
  }
  
  /**
   * Maps backend agent names to UI actions
   * This is where we define the agent→panel activation rules
   */
  private static mapAgentToUIAction(agentName: string): UIAction | null {
    const agentMap: Record<string, UIAction> = {
      'quick-quote-agent': {
        type: 'OPEN_STRUCTURED_INPUT',
        payload: { tool: 'QuickQuote' }
      },
      'life-insurance-illustration-agent': {
        type: 'OPEN_STRUCTURED_INPUT', 
        payload: { tool: 'LifeExpectancy' }
      }
      // Future agents can be added here without touching UI code
    };
    
    const action = agentMap[agentName];
    if (!action) {
      console.warn(`⚠️ Unknown agent activation: ${agentName}`);
      return null;
    }
    
    return action;
  }
  
  /**
   * Temporary: Detect agent activations from response content
   * This provides backwards compatibility until backend sends proper metadata
   */
  private static detectAgentsFromContent(response: any): string[] {
    const content = response.output?.answer || response.answer || '';
    const agents: string[] = [];
    const lowerContent = content.toLowerCase();
    
    // Look for agent activation patterns in response text
    // Quick quote agent - more flexible detection
    if ((lowerContent.includes('quote') && lowerContent.includes('insurance')) ||
        (lowerContent.includes('quick') && lowerContent.includes('quote')) ||
        (lowerContent.includes('coverage') && lowerContent.includes('amount')) ||
        lowerContent.includes('quick-quote')) {
      agents.push('quick-quote-agent');
    }
    
    // Life expectancy agent
    if (lowerContent.includes('life expectancy') || 
        lowerContent.includes('illustration') ||
        (lowerContent.includes('life') && lowerContent.includes('insurance') && lowerContent.includes('illustration'))) {
      agents.push('life-insurance-illustration-agent');
    }
    
    return agents;
  }
  
  /**
   * Debug helper: Log response interpretation for troubleshooting
   */
  static debugResponse(response: any): void {
    console.group('🔍 Response Interpretation Debug');
    console.log('Raw response:', response);
    console.log('Extracted agents:', this.extractActivatedAgents(response));
    console.log('Generated actions:', this.interpretResponse(response));
    console.groupEnd();
  }
}