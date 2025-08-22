"use client";

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure PDF.js worker to use local file
pdfjs.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.js';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  HStack,
  Text,
  IconButton,
  Box,
  Spinner,
  Center
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon } from '@chakra-ui/icons';
import { useFriggState } from '../hooks/useFriggState';

interface PDFPreviewOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  fileData: {
    name: string;
    type: string;
    url: string;
    blob: Blob;
  };
}

export default function PDFPreviewOverlay({ isOpen, onClose, fileData }: PDFPreviewOverlayProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useFriggState();

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error);
    setLoading(false);
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = fileData.url;
    link.download = fileData.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent 
        maxW="90vw" 
        maxH="90vh" 
        bg={isDarkMode ? "gray.800" : "white"}
        border={`2px solid ${isDarkMode ? '#4A5568' : '#E2E8F0'}`}
      >
        <ModalHeader 
          pb={4}
          borderBottom={`1px solid ${isDarkMode ? '#4A5568' : '#E2E8F0'}`}
        >
          <HStack justify="space-between" align="center">
            <Text fontSize="lg" fontWeight="medium" color={isDarkMode ? "white" : "gray.800"}>
              {fileData.name}
            </Text>
            <HStack spacing={2}>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<DownloadIcon />}
                onClick={downloadFile}
                colorScheme="blue"
              >
                Download
              </Button>
            </HStack>
          </HStack>
        </ModalHeader>
        
        <ModalCloseButton color={isDarkMode ? "white" : "gray.800"} />
        
        <ModalBody p={0} display="flex" flexDirection="column" height="calc(90vh - 120px)">
          {loading && (
            <Center flex={1}>
              <Spinner size="xl" color="blue.500" />
            </Center>
          )}
          
          <Box 
            flex={1} 
            overflow="auto" 
            display="flex" 
            justifyContent="center" 
            alignItems="flex-start"
            bg={isDarkMode ? "gray.900" : "gray.50"}
            p={4}
          >
            <Document
              file={fileData.blob}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={null}
            >
              <Page
                pageNumber={pageNumber}
                renderAnnotationLayer={false}
                renderTextLayer={true}
                width={Math.min(window.innerWidth * 0.7, 800)}
              />
            </Document>
          </Box>
          
          {numPages > 0 && (
            <HStack 
              justify="center" 
              p={4} 
              borderTop={`1px solid ${isDarkMode ? '#4A5568' : '#E2E8F0'}`}
              bg={isDarkMode ? "gray.800" : "white"}
            >
              <IconButton
                aria-label="Previous page"
                icon={<ChevronLeftIcon />}
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
                size="sm"
              />
              <Text fontSize="sm" color={isDarkMode ? "gray.300" : "gray.600"}>
                Page {pageNumber} of {numPages}
              </Text>
              <IconButton
                aria-label="Next page"
                icon={<ChevronRightIcon />}
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
                size="sm"
              />
            </HStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}