"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { EmptyState } from "./EmptyState";
import { ChatMessageBubble, Message } from "./ChatMessageBubble";
import { AutoResizeTextarea } from "./AutoResizeTextarea";
import MemorySlider from "./MemorySlider";
import StructuredInput from "./StructuredInput";
import ThemeToggle from "./ThemeToggle";
import StructuredOutputDock from "./StructuredOutputDock";
import { useFriggState } from "../hooks/useFriggState";
import { useWorkspaceCoordinator } from "../hooks/useWorkspaceCoordinator";
import { marked } from "marked";
import { Renderer } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/gradient-dark.css";
import { colors, codeHighlight } from "../config/theme";
import { content } from "../config/content";
import { fontFamilies } from "../config/fonts";

import "react-toastify/dist/ReactToastify.css";
import {
  Spinner,
} from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { Source } from "./SourceBubble";
import { useWebSocket, WebSocketMessage } from "../hooks/useWebSocket";

const MODEL_TYPES = [
  "openai_gpt_3_5_turbo",
  "anthropic_claude_3_haiku",
  "google_gemini_pro",
  "fireworks_mixtral",
  "cohere_command",
];

const defaultLlmValue =
  MODEL_TYPES[Math.floor(Math.random() * MODEL_TYPES.length)];

export function ChatWindow(props: { conversationId: string }) {
  const conversationId = props.conversationId;
  const userId = "user-" + Math.random().toString(36).substring(2, 11);

  const searchParams = useSearchParams();

  // Frigg state
  const {
    structuredInputWidth,
    structuredOutputDockWidth,
    isStructuredOutputOpen,
    isDarkMode,
    selectedFont,
    memories,
    setStructuredInputWidth,
    setStructuredOutputDockWidth,
    selectMemory
  } = useFriggState();

  // Theme colors
  const themeColors = isDarkMode ? colors.dark : colors.light;

  // Workspace coordinator - handles agent-driven panel behavior
  const {
    isStructuredInputMinimized,
    isStructuredOutputMinimized,
    selectedTool,
    showEmptyStateButtons,
    processBackendResponse,
    hideEmptyStateButtons,
    toggleStructuredInput,
    toggleStructuredOutput
  } = useWorkspaceCoordinator();

  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const mainChatRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mainChatWidth, setMainChatWidth] = useState(0);
  const [chatHistory, setChatHistory] = useState<Array<{ human: string; ai: string }>>([]);
  const [llm, setLlm] = useState(
    searchParams.get("llm") ?? "openai_gpt_3_5_turbo",
  );
  
  // WebSocket hook for real-time communication
  const { sendMessage: sendWebSocketMessage, status: wsStatus, error: wsError, isConnected } = useWebSocket();
  
  useEffect(() => {
    setLlm(searchParams.get("llm") ?? defaultLlmValue);
  }, [searchParams]);

  // Handle font changes
  useEffect(() => {
    const fontOptions = [
      { value: 'inter', family: 'Inter, sans-serif' },
      { value: 'roboto', family: 'Roboto, sans-serif' },
      { value: 'open-sans', family: 'Open Sans, sans-serif' },
      { value: 'lato', family: 'Lato, sans-serif' },
      { value: 'poppins', family: 'Poppins, sans-serif' },
      { value: 'montserrat', family: 'Montserrat, sans-serif' },
      { value: 'source-sans', family: 'Source Sans Pro, sans-serif' },
      { value: 'ubuntu', family: 'Ubuntu, sans-serif' },
      { value: 'nunito', family: 'Nunito, sans-serif' },
      { value: 'system', family: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif' },
      { value: 'fira-code', family: 'Fira Code, Consolas, Monaco, monospace' },
      { value: 'jetbrains-mono', family: 'JetBrains Mono, Consolas, Monaco, monospace' }
    ];
    
    const selectedFontOption = fontOptions.find(font => font.value === selectedFont);
    if (selectedFontOption) {
      document.body.style.fontFamily = selectedFontOption.family;
    }
  }, [selectedFont]);

  // Track main chat area width
  useEffect(() => {
    const mainChatElement = mainChatRef.current;
    if (!mainChatElement) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setMainChatWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(mainChatElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const sendMessage = async (message?: string) => {
    console.log('sendMessage called with:', message);
    console.log('WebSocket status:', wsStatus, 'isConnected:', isConnected, 'isLoading:', isLoading);
    
    if (messageContainerRef.current) {
      messageContainerRef.current.classList.add("grow");
    }
    if (isLoading) {
      console.log('Exiting early - already loading');
      return;
    }
    if (!isConnected) {
      console.log('WebSocket not connected, status:', wsStatus);
      // Add error message to chat instead of silently failing
      setMessages((prevMessages) => [
        ...prevMessages,
        { 
          id: Math.random().toString(), 
          content: content.errors.websocketNotConnected, 
          role: "assistant" 
        },
      ]);
      return;
    }
    const messageValue = message ?? input;
    if (messageValue === "") return;
    
    // Hide empty state buttons when user sends a message
    hideEmptyStateButtons();
    
    setInput("");
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: Math.random().toString(), content: messageValue, role: "user" },
    ]);
    setIsLoading(true);

    let accumulatedMessage = "";
    let runId: string | undefined = undefined;
    let sources: Source[] | undefined = undefined;

    // Setup markdown renderer
    let renderer = new Renderer();
    renderer.paragraph = (text) => {
      return text + "\n";
    };
    renderer.list = (text) => {
      return `${text}\n\n`;
    };
    renderer.listitem = (text) => {
      return `\n• ${text}`;
    };
    renderer.code = (code, language) => {
      const validLanguage = hljs.getLanguage(language || "")
        ? language
        : "plaintext";
      const highlightedCode = hljs.highlight(
        code,
        { language: validLanguage || "plaintext" },
      ).value;
      return `<pre class="highlight bg-gray-700" style="padding: 5px; border-radius: 5px; overflow: auto; overflow-wrap: anywhere; white-space: pre-wrap; max-width: 100%; display: block; line-height: 1.2"><code class="${language}" style="color: ${codeHighlight.text}; font-size: 12px; ">${highlightedCode}</code></pre>`;
    };
    marked.setOptions({ renderer });

    // Create WebSocket message (direct BifrostState format, no input wrapper)
    const webSocketMessage: WebSocketMessage = {
      question: messageValue,
      chat_history: chatHistory,
      metadata: {
        caller: content.metadata.caller,
        purpose: content.metadata.purpose,
        timestamp: new Date().toISOString(),
      },
      session: {
        user_id: userId,
        context: {
          conversation_id: conversationId,
          llm: llm ?? "openai_gpt_3_5_turbo",
        },
      },
      stream: false,
    };

    // Send via WebSocket
    sendWebSocketMessage(
      webSocketMessage,
      (response) => {
        // Success handler
        const answer = response.output?.answer || content.errors.noResponse;
        runId = response.output?.run_id || Math.random().toString();
        
        // Process backend response if needed
        if (response.output) {
          processBackendResponse({ output: response.output });
        }
        
        const parsedResult = marked.parse(answer);
        accumulatedMessage = answer;

        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages.push({
            id: Math.random().toString(),
            content: parsedResult.trim(),
            runId: runId,
            sources: sources,
            role: "assistant",
          });
          return newMessages;
        });
        
        setChatHistory((prevChatHistory) => [
          ...prevChatHistory,
          { human: messageValue, ai: accumulatedMessage },
        ]);
        
        setIsLoading(false);
      },
      (error) => {
        // Error handler
        setMessages((prevMessages) => prevMessages.slice(0, -1));
        setIsLoading(false);
        setInput(messageValue);
        console.error("WebSocket error:", error);
        
        // Add error message to chat
        setMessages((prevMessages) => [
          ...prevMessages,
          { 
            id: Math.random().toString(), 
            content: content.errors.generalWebsocketError.replace('{error}', error), 
            role: "assistant" 
          },
        ]);
      }
    );
  };

  const sendInitialQuestion = async (question: string) => {
    console.log('=== sendInitialQuestion called ===');
    console.log('Question received:', question);
    console.log('Current WebSocket state:', { wsStatus, isConnected, error: wsError });
    try {
      await sendMessage(question);
    } catch (e) {
      console.error("Error sending initial question:", e);
    }
  };


  return (
    <div className={`flex flex-col h-screen transition-colors duration-200`}
      style={{ backgroundColor: themeColors.background }}>
      {/* Header with memory slider */}
      <div className={`flex-shrink-0 p-6 border-b transition-colors duration-200`}
        style={{ 
          backgroundColor: isDarkMode ? themeColors.chakra.gray[800] : themeColors.background,
          borderColor: isDarkMode ? themeColors.chakra.gray[700] : themeColors.chakra.gray[200]
        }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <h1 className={`text-2xl font-medium transition-colors duration-200`}
              style={{ 
                color: themeColors.text,
                fontFamily: fontFamilies.roboto 
              }}>{content.app.appName}</h1>
            <img 
              src="/lns-logo.png" 
              alt="Life Nervous System Logo" 
              className="w-12 h-12 ml-3"
            />
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
        
        {/* Memory slider in header */}
        <div className="mb-2">
          <MemorySlider
            memories={memories}
            onSelect={selectMemory}
          />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-row flex-1 min-h-0">
        {/* Left Sidebar - Structured Input */}
        <StructuredInput
          width={structuredInputWidth}
          onResize={setStructuredInputWidth}
          isMinimized={isStructuredInputMinimized}
          onToggleMinimize={toggleStructuredInput}
        />

        {/* Main Chat Area */}
        <div 
          ref={mainChatRef}
          className={`flex-1 flex flex-col min-w-0 transition-colors duration-200`}
          style={{ backgroundColor: themeColors.background }}
        >
          {mainChatWidth > 200 ? (
            <>
              {messages.length > 0 ? (
                <>
                  {/* Main question */}
                  <div className="flex-shrink-0 p-6">
                    <h2 className={`text-2xl font-medium text-center mb-6 transition-colors duration-200`}
                      style={{ color: themeColors.text }}>
                      {content.app.mainQuestion}
                    </h2>
                  </div>

                  {/* Messages */}
                  <div
                    className="flex flex-col-reverse flex-1 overflow-auto px-4"
                    ref={messageContainerRef}
                  >
                    {[...messages]
                      .reverse()
                      .map((m, index) => (
                        <ChatMessageBubble
                          key={m.id}
                          message={{ ...m }}
                          aiEmoji="🦜"
                          isMostRecent={index === 0}
                          messageCompleted={!isLoading}
                        ></ChatMessageBubble>
                      ))}
                  </div>

                  {/* Input */}
                  <div className="flex-shrink-0 p-4">
                    <div className="max-w-2xl mx-auto">
                      <div className={`relative rounded-3xl border p-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-0`}
                        style={{
                          backgroundColor: 'transparent',
                          borderColor: isDarkMode ? themeColors.chakra.gray[600] : themeColors.chakra.gray[300]
                        }}>
                        <div className="pr-12">
                          <AutoResizeTextarea
                            value={input}
                            maxRows={5}
                            placeholder={content.placeholders.chatInput}
                            textColor={themeColors.text}
                            borderColor={"transparent"}
                            backgroundColor={"transparent"}
                            focusBorderColor="transparent"
                            fontFamily="'Inter', sans-serif"
                            fontSize="md"
                            _focus={{
                              boxShadow: "none",
                              outline: "none",
                            }}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={async (e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              try {
                                await sendMessage();
                              } catch (error) {
                                console.error("Error in onKeyDown:", error);
                              }
                            } else if (e.key === "Enter" && e.shiftKey) {
                              e.preventDefault();
                              setInput(input + "\n");
                            }
                          }}
                          />
                        </div>
                        <button
                          onClick={async (e) => {
                            e.preventDefault();
                            try {
                              await sendMessage();
                            } catch (error) {
                              console.error("Error in onClick:", error);
                            }
                          }}
                          disabled={isLoading || !isConnected}
                          title={!isConnected ? `${content.tooltips.websocketError} ${wsStatus}` : content.buttons.send}
                          className={`absolute right-3 top-1/2 transform -translate-y-1/2 rounded-full w-9 h-9 flex items-center justify-center disabled:opacity-50 bg-black text-white border-2 border-black ${!isConnected ? 'border-red-500' : ''}`}
                        >
                          {isLoading ? <Spinner size="sm" /> : <ArrowUpIcon strokeWidth={3} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <footer className="flex justify-center p-4">
                    <a
                      href={content.navigation.githubLink}
                      target="_blank"
                      className={`flex items-center transition-colors duration-200`}
                      style={{
                        color: isDarkMode ? themeColors.chakra.gray[400] : themeColors.chakra.gray[600]
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = isDarkMode ? themeColors.chakra.gray[200] : themeColors.chakra.gray[800];
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = isDarkMode ? themeColors.chakra.gray[400] : themeColors.chakra.gray[600];
                      }}
                    >
                      <img src="/images/github-mark.svg" className="h-4 mr-1" alt="GitHub" />
                      <span>{content.buttons.viewSource}</span>
                    </a>
                  </footer>
                </>
              ) : (
                /* Empty state - properly centered */
                <>
                  {/* Top spacer */}
                  <div className="flex-1"></div>
                  
                  {/* Centered content group */}
                  <div className="flex-shrink-0 px-4">
                    {/* Main question */}
                    <h2 className={`text-2xl font-medium text-center mb-12 transition-colors duration-200`}
                      style={{ color: themeColors.text }}>
                      {content.app.mainQuestion}
                    </h2>
                    
                    {/* EmptyState buttons */}
                    <div className="flex justify-center mb-8">
                      {showEmptyStateButtons && <EmptyState onChoice={sendInitialQuestion} />}
                    </div>
                    
                    {/* Input centered below buttons */}
                    <div className="max-w-2xl mx-auto">
                      <div className={`relative rounded-3xl border p-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-0`}
                        style={{
                          backgroundColor: 'transparent',
                          borderColor: isDarkMode ? themeColors.chakra.gray[600] : themeColors.chakra.gray[300]
                        }}>
                        <div className="pr-12">
                          <AutoResizeTextarea
                            value={input}
                            maxRows={5}
                            placeholder={content.placeholders.chatInput}
                            textColor={themeColors.text}
                            borderColor={"transparent"}
                            backgroundColor={"transparent"}
                            focusBorderColor="transparent"
                            fontFamily="'Inter', sans-serif"
                            fontSize="md"
                            _focus={{
                              boxShadow: "none",
                              outline: "none",
                            }}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={async (e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              try {
                                await sendMessage();
                              } catch (error) {
                                console.error("Error in onKeyDown:", error);
                              }
                            } else if (e.key === "Enter" && e.shiftKey) {
                              e.preventDefault();
                              setInput(input + "\n");
                            }
                          }}
                          />
                        </div>
                        <button
                          onClick={async (e) => {
                            e.preventDefault();
                            try {
                              await sendMessage();
                            } catch (error) {
                              console.error("Error in onClick:", error);
                            }
                          }}
                          disabled={isLoading || !isConnected}
                          title={!isConnected ? `${content.tooltips.websocketError} ${wsStatus}` : content.buttons.send}
                          className={`absolute right-3 top-1/2 transform -translate-y-1/2 rounded-full w-9 h-9 flex items-center justify-center disabled:opacity-50 bg-black text-white border-2 border-black ${!isConnected ? 'border-red-500' : ''}`}
                        >
                          {isLoading ? <Spinner size="sm" /> : <ArrowUpIcon strokeWidth={3} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom spacer */}
                  <div className="flex-1"></div>
                  
                  {/* Footer */}
                  <footer className="flex-shrink-0 flex justify-center p-4">
                    <a
                      href={content.navigation.githubLink}
                      target="_blank"
                      className={`flex items-center transition-colors duration-200`}
                      style={{
                        color: isDarkMode ? themeColors.chakra.gray[400] : themeColors.chakra.gray[600]
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = isDarkMode ? themeColors.chakra.gray[200] : themeColors.chakra.gray[800];
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = isDarkMode ? themeColors.chakra.gray[400] : themeColors.chakra.gray[600];
                      }}
                    >
                      <img src="/images/github-mark.svg" className="h-4 mr-1" alt="GitHub" />
                      <span>{content.buttons.viewSource}</span>
                    </a>
                  </footer>
                </>
              )}
            </>
          ) : (
            /* Drag indicator when too narrow */
            <div className="flex-1 flex items-center justify-center">
              <div className={`text-center select-none transition-colors duration-200`}
                style={{ color: isDarkMode ? themeColors.chakra.gray[500] : themeColors.chakra.gray[400] }}>
                <div className="flex items-center gap-2 text-sm">
                  <span>←</span>
                  <span>{content.labels.dragToDisplay}</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Structured Output */}
        {(isStructuredOutputOpen || !isStructuredOutputMinimized) && (
          <StructuredOutputDock
            isOpen={isStructuredOutputOpen || !isStructuredOutputMinimized}
            width={structuredOutputDockWidth}
            onResize={setStructuredOutputDockWidth}
            isMinimized={isStructuredOutputMinimized}
            onToggleMinimize={toggleStructuredOutput}
          />
        )}
      </div>
    </div>
  );
}
