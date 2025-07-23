"use client";

import { v4 as uuidv4 } from "uuid";
import { ChatWindow } from "./components/ChatWindow";
import { ToastContainer } from "react-toastify";
import { WorkspaceProvider } from "./hooks/useWorkspace";

import { ChakraProvider } from "@chakra-ui/react";

export default function Home() {
  const conversationId = uuidv4();
  const userId = `user-${Math.random().toString(36).substring(2, 11)}`;

  return (
    <ChakraProvider>
      <WorkspaceProvider userId={userId} conversationId={conversationId}>
        <ToastContainer />
        <div className="h-screen overflow-hidden">
          <ChatWindow conversationId={conversationId}></ChatWindow>
        </div>
      </WorkspaceProvider>
    </ChakraProvider>
  );
}
