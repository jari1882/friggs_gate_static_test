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
import FontSelector from "./FontSelector";
import { useFriggState } from "../hooks/useFriggState";
import { useWorkspaceCoordinator } from "../hooks/useWorkspaceCoordinator";
import { marked } from "marked";
import { Renderer } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/gradient-dark.css";

import "react-toastify/dist/ReactToastify.css";
import {
  Spinner,
} from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { Source } from "./SourceBubble";
import { apiBaseUrl } from "../utils/constants";

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
  const [llm, setLlm] = useState(
    searchParams.get("llm") ?? "openai_gpt_3_5_turbo",
  );
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

  const [chatHistory, setChatHistory] = useState<
    { human: string; ai: string }[]
  >([]);

  const sendMessage = async (message?: string) => {
    if (messageContainerRef.current) {
      messageContainerRef.current.classList.add("grow");
    }
    if (isLoading) {
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
      return `<pre class="highlight bg-gray-700" style="padding: 5px; border-radius: 5px; overflow: auto; overflow-wrap: anywhere; white-space: pre-wrap; max-width: 100%; display: block; line-height: 1.2"><code class="${language}" style="color: #d6e2ef; font-size: 12px; ">${highlightedCode}</code></pre>`;
    };
    marked.setOptions({ renderer });
    try {
      const bifrostPayload = {
        input: {
          version: "1.0",
          question: messageValue,
          chat_history: chatHistory,
          metadata: {
            caller: "frontend_app",
            purpose: "chat_request",
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
        },
      };

      const response = await fetch(apiBaseUrl + "/ask/invoke", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bifrostPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.output?.status === "failed") {
        throw new Error(data.output?.error || "API request failed");
      }

      // Process backend response for agent activations and UI state changes
      processBackendResponse(data);

      const answer = data.output?.answer || "No response received";
      runId = data.output?.run_id || Math.random().toString();
      
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
    } catch (e) {
      setMessages((prevMessages) => prevMessages.slice(0, -1));
      setIsLoading(false);
      setInput(messageValue);
      console.error("Error sending message:", e);
      
      // Add error message to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { 
          id: Math.random().toString(), 
          content: "Sorry, there was an error processing your message. Please try again.", 
          role: "assistant" 
        },
      ]);
    }
  };

  const sendInitialQuestion = async (question: string) => {
    try {
      await sendMessage(question);
    } catch (e) {
      console.error("Error sending initial question:", e);
    }
  };


  return (
    <div className={`flex flex-col h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      {/* Header with memory slider */}
      <div className={`flex-shrink-0 p-6 border-b transition-colors duration-200 ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-xl font-medium transition-colors duration-200 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Frigg&apos;s Gate</h1>
          <div className="flex items-center gap-3">
            <FontSelector />
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
          className={`flex-1 flex flex-col min-w-0 transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-900' : 'bg-white'
          }`}
        >
          {mainChatWidth > 200 ? (
            <>
              {/* Main question */}
              <div className="flex-shrink-0 p-6">
                <h2 className={`text-lg font-medium text-center mb-6 transition-colors duration-200 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  What can the Life Nervous System Help You With?
                </h2>
              </div>

              {/* Messages */}
              <div
                className="flex flex-col-reverse flex-1 overflow-auto px-4"
                ref={messageContainerRef}
              >
                {messages.length > 0 ? (
                  [...messages]
                    .reverse()
                    .map((m, index) => (
                      <ChatMessageBubble
                        key={m.id}
                        message={{ ...m }}
                        aiEmoji="🦜"
                        isMostRecent={index === 0}
                        messageCompleted={!isLoading}
                      ></ChatMessageBubble>
                    ))
                ) : (
                  showEmptyStateButtons && <EmptyState onChoice={sendInitialQuestion} />
                )}
              </div>

              {/* Input */}
              <div className="flex-shrink-0 p-4">
            <div className="max-w-2xl mx-auto">
              <div className={`relative rounded-3xl border p-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-0 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 focus-within:ring-blue-400 focus-within:border-blue-400' 
                  : 'bg-gray-100 border-gray-300 focus-within:ring-blue-500 focus-within:border-blue-500'
              }`}>
                <div className="pr-12">
                  <AutoResizeTextarea
                    value={input}
                    maxRows={5}
                    placeholder="Please type here...."
                    textColor={isDarkMode ? "white" : "black"}
                    borderColor={"transparent"}
                    backgroundColor={"transparent"}
                    focusBorderColor="transparent"
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
                  disabled={isLoading}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 rounded-full p-2 disabled:opacity-50 border transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700 border-gray-300'
                  }`}
                >
                  {isLoading ? <Spinner size="sm" /> : <ArrowUpIcon />}
                </button>
              </div>
            </div>
          </div>

              {/* Footer */}
              {messages.length === 0 && (
                <footer className="flex justify-center p-4">
                  <a
                    href="https://github.com/jari1882/friggs-gate"
                    target="_blank"
                    className={`flex items-center transition-colors duration-200 ${
                      isDarkMode 
                        ? 'text-gray-400 hover:text-gray-200' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <img src="/images/github-mark.svg" className="h-4 mr-1" alt="GitHub" />
                    <span>View Source</span>
                  </a>
                </footer>
              )}
            </>
          ) : (
            /* Drag indicator when too narrow */
            <div className="flex-1 flex items-center justify-center">
              <div className={`text-center select-none transition-colors duration-200 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                <div className="flex items-center gap-2 text-sm">
                  <span>←</span>
                  <span>Drag to Display</span>
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
