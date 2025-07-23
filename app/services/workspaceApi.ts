'use client';

import { 
  APIRequest, 
  APIResponse, 
  SessionContext, 
  StructuredOutputData,
  WorkspaceSuggestion 
} from '../types/workspace';
import { apiBaseUrl } from '../utils/constants';

// Enhanced API service that handles both conversational and structured interactions
export class WorkspaceApiService {
  private baseUrl: string;

  constructor(baseUrl: string = apiBaseUrl) {
    this.baseUrl = baseUrl;
  }

  // Main unified API call that can handle any type of request
  async makeRequest(request: APIRequest): Promise<APIResponse> {
    try {
      // Build the payload based on the existing Bifröst contract
      const bifrostPayload = this.buildBifrostPayload(request);
      
      const response = await fetch(`${this.baseUrl}/ask/invoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bifrostPayload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform the response into our unified format
      return this.transformBifrostResponse(data, request);
      
    } catch (error) {
      console.error('API request failed:', error);
      return {
        id: request.id,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Conversational API - for natural language interactions
  async sendConversation(
    message: string, 
    context: SessionContext,
    llm?: string
  ): Promise<APIResponse> {
    const request: APIRequest = {
      id: `conv-${Date.now()}`,
      endpoint: '/ask/invoke',
      payload: {
        question: message,
        chat_history: this.buildChatHistory(context),
        metadata: {
          caller: 'frontend_app',
          purpose: 'chat_request',
          timestamp: new Date().toISOString()
        },
        session: {
          user_id: context.userId,
          context: {
            conversation_id: context.conversationId,
            llm: llm || 'openai_gpt_3_5_turbo',
            // Include structured context for cross-panel awareness
            structured_inputs: Object.keys(context.structuredInputs),
            contextual_data: context.contextualData
          }
        }
      },
      context,
      expectedOutputType: 'conversational'
    };

    return this.makeRequest(request);
  }

  // Structured API - for form-based interactions
  async sendStructuredInput(
    toolType: string,
    formData: Record<string, any>,
    context: SessionContext
  ): Promise<APIResponse> {
    const request: APIRequest = {
      id: `struct-${Date.now()}`,
      endpoint: '/ask/invoke',
      payload: {
        question: `Process ${toolType} with provided data`,
        chat_history: this.buildChatHistory(context),
        metadata: {
          caller: 'frontend_app',
          purpose: 'structured_calculation',
          timestamp: new Date().toISOString(),
          tool_type: toolType,
          structured_data: formData
        },
        session: {
          user_id: context.userId,
          context: {
            conversation_id: context.conversationId,
            tool_type: toolType,
            form_data: formData,
            contextual_data: context.contextualData
          }
        }
      },
      context,
      expectedOutputType: 'structured'
    };

    return this.makeRequest(request);
  }

  // Hybrid API - for interactions that expect both types of responses
  async sendHybridRequest(
    message: string,
    structuredData: Record<string, any> | null,
    context: SessionContext
  ): Promise<APIResponse> {
    const request: APIRequest = {
      id: `hybrid-${Date.now()}`,
      endpoint: '/ask/invoke',
      payload: {
        question: message,
        chat_history: this.buildChatHistory(context),
        metadata: {
          caller: 'frontend_app',
          purpose: 'hybrid_request',
          timestamp: new Date().toISOString(),
          has_structured_data: !!structuredData
        },
        session: {
          user_id: context.userId,
          context: {
            conversation_id: context.conversationId,
            structured_data: structuredData,
            contextual_data: context.contextualData
          }
        }
      },
      context,
      expectedOutputType: 'both'
    };

    return this.makeRequest(request);
  }

  // Build the existing Bifröst payload format
  private buildBifrostPayload(request: APIRequest) {
    return {
      input: {
        version: "1.0",
        ...request.payload,
        stream: false
      }
    };
  }

  // Transform chat history to the expected format
  private buildChatHistory(context: SessionContext): Array<{human: string, ai: string}> {
    const chatHistory: Array<{human: string, ai: string}> = [];
    let humanMessage: string | null = null;

    for (const message of context.conversationHistory) {
      if (message.role === 'user') {
        humanMessage = message.content;
      } else if (message.role === 'assistant' && humanMessage) {
        chatHistory.push({
          human: humanMessage,
          ai: message.content
        });
        humanMessage = null;
      }
    }

    return chatHistory;
  }

  // Transform Bifröst response into our unified format
  private transformBifrostResponse(bifrostData: any, originalRequest: APIRequest): APIResponse {
    const output = bifrostData.output;
    
    if (output?.status === 'failed') {
      return {
        id: originalRequest.id,
        status: 'error',
        error: output.error || 'API request failed'
      };
    }

    const response: APIResponse = {
      id: originalRequest.id,
      status: 'success'
    };

    // Always include conversational response if available
    if (output?.answer) {
      response.conversationalResponse = output.answer;
    }

    // Generate structured output based on the request type and response content
    if (originalRequest.expectedOutputType === 'structured' || originalRequest.expectedOutputType === 'both') {
      response.structuredResponse = this.generateStructuredOutput(output, originalRequest);
    }

    // Generate suggestions based on the response
    response.suggestions = this.generateSuggestions(output, originalRequest);

    // Extract contextual updates
    response.contextUpdates = this.extractContextUpdates(output, originalRequest);

    return response;
  }

  // Generate structured output from the response
  private generateStructuredOutput(
    bifrostOutput: any, 
    originalRequest: APIRequest
  ): StructuredOutputData | undefined {
    // This is where we'll parse the response and create structured data
    // For now, we'll create a basic structure - this will be enhanced as backend evolves
    
    const metadata = originalRequest.payload.metadata;
    
    if (metadata?.tool_type) {
      return {
        id: `output-${Date.now()}`,
        type: 'calculation',
        title: `${metadata.tool_type} Results`,
        data: {
          rawResponse: bifrostOutput.answer,
          toolType: metadata.tool_type,
          inputData: metadata.structured_data,
          runId: bifrostOutput.run_id
        },
        sourceInputId: `struct-${metadata.tool_type}`,
        timestamp: new Date(),
        exportFormats: ['json', 'pdf']
      };
    }

    return undefined;
  }

  // Generate contextual suggestions based on the response
  private generateSuggestions(
    bifrostOutput: any, 
    originalRequest: APIRequest
  ): WorkspaceSuggestion[] {
    const suggestions: WorkspaceSuggestion[] = [];
    
    // Analyze the response for potential next actions
    const answer = bifrostOutput.answer?.toLowerCase() || '';
    
    // If response mentions numbers/calculations, suggest structured input
    if (answer.includes('age') || answer.includes('amount') || answer.includes('calculate')) {
      suggestions.push({
        id: `suggest-${Date.now()}-struct`,
        type: 'structured-input',
        title: 'Use Structured Input',
        description: 'Get more precise results with our structured forms',
        priority: 'medium',
        action: {
          id: `action-${Date.now()}`,
          type: 'conversation-suggests-structured-input',
          source: 'conversation',
          target: 'structured-input',
          payload: {
            suggestedTool: answer.includes('quote') ? 'QuickQuote' : 'LifeExpectancy'
          },
          timestamp: new Date()
        }
      });
    }

    // If structured data was processed, suggest export
    if (originalRequest.expectedOutputType === 'structured') {
      suggestions.push({
        id: `suggest-${Date.now()}-export`,
        type: 'export-data',
        title: 'Export Results',
        description: 'Download your results in various formats',
        priority: 'low',
        action: {
          id: `action-${Date.now()}`,
          type: 'backend-response-structured',
          source: 'structured-output',
          target: 'all',
          payload: {
            exportFormats: ['pdf', 'json', 'csv']
          },
          timestamp: new Date()
        }
      });
    }

    return suggestions;
  }

  // Extract contextual updates from the response
  private extractContextUpdates(
    bifrostOutput: any, 
    originalRequest: APIRequest
  ): Record<string, any> {
    const updates: Record<string, any> = {};
    
    // Extract entities and preferences from the response
    const answer = bifrostOutput.answer || '';
    
    // Simple entity extraction - this would be enhanced with proper NLP
    const ageMatch = answer.match(/(\d+)[\s-]year[\s-]old/i);
    if (ageMatch) {
      updates.extractedAge = parseInt(ageMatch[1]);
    }
    
    // Track tool usage
    if (originalRequest.payload.metadata?.tool_type) {
      updates.lastUsedTool = originalRequest.payload.metadata.tool_type;
      updates.toolUsageCount = (originalRequest.context.contextualData.toolUsageCount || 0) + 1;
    }
    
    // Track conversation patterns
    updates.lastApiCall = new Date().toISOString();
    updates.totalApiCalls = (originalRequest.context.contextualData.totalApiCalls || 0) + 1;
    
    return updates;
  }
}

// Singleton instance
export const workspaceApi = new WorkspaceApiService();