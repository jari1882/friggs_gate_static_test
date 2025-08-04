import { useState, useRef, useCallback, useEffect } from 'react';
import { wsEndpoint } from '../utils/constants';

export type WebSocketStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface WebSocketMessage {
  question: string;
  chat_history: Array<{ human: string; ai: string }>;
  metadata: {
    caller: string;
    purpose: string;
    timestamp: string;
  };
  session: {
    user_id: string;
    context: {
      conversation_id: string;
      llm: string;
    };
  };
  stream: boolean;
}

export interface WebSocketResponse {
  status: 'success' | 'error';
  output?: {
    answer: string;
    run_id?: string;
    agent?: string;
    status?: string;
  };
  message?: string;
}

export const useWebSocket = () => {
  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setStatus('connecting');
    setError(null);

    try {
      const ws = new WebSocket(wsEndpoint);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('🔌 WebSocket connected successfully');
        setStatus('connected');
        setError(null);
        reconnectAttempts.current = 0;
      };

      ws.onclose = (event) => {
        console.log('🔌 WebSocket disconnected:', event.code, event.reason);
        setStatus('disconnected');
        wsRef.current = null;

        // Auto-reconnect unless it was a clean disconnect
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(`🔄 Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})...`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectDelay);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setStatus('error');
        setError('WebSocket connection failed');
      };

    } catch (err) {
      console.error('❌ WebSocket connection error:', err);
      setStatus('error');
      setError('Failed to create WebSocket connection');
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }
    
    setStatus('disconnected');
    setError(null);
    reconnectAttempts.current = 0;
  }, []);

  const sendMessage = useCallback((
    message: WebSocketMessage,
    onResponse: (response: WebSocketResponse) => void,
    onError: (error: string) => void
  ) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      onError('WebSocket is not connected');
      return;
    }

    try {
      // Create response handler for this specific message
      const handleMessage = (event: MessageEvent) => {
        try {
          const response: WebSocketResponse = JSON.parse(event.data);
          
          // Remove this specific listener after handling
          wsRef.current?.removeEventListener('message', handleMessage);
          
          if (response.status === 'success') {
            onResponse(response);
          } else {
            onError(response.message || 'Unknown error occurred');
          }
        } catch (parseError) {
          console.error('❌ Failed to parse WebSocket response:', parseError);
          onError('Failed to parse server response');
        }
      };

      // Add message listener for this request
      wsRef.current.addEventListener('message', handleMessage);

      // Send the message (no input wrapper - direct BifrostState)
      wsRef.current.send(JSON.stringify(message));
      
    } catch (sendError) {
      console.error('❌ Failed to send WebSocket message:', sendError);
      onError('Failed to send message');
    }
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    status,
    error,
    connect,
    disconnect,
    sendMessage,
    isConnected: status === 'connected',
    isConnecting: status === 'connecting',
  };
};