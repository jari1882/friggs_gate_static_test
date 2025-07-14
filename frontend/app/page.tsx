"use client";

import { v4 as uuidv4 } from "uuid";
import { ChatWindow } from "./components/ChatWindow";
import { ToastContainer } from "react-toastify";

import { ChakraProvider } from "@chakra-ui/react";

export default function Home() {
  return (
    <ChakraProvider>
      <ToastContainer />
      <div className="h-screen overflow-hidden">
        <ChatWindow conversationId={uuidv4()}></ChatWindow>
      </div>
    </ChakraProvider>
  );
}
