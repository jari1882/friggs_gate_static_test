"use client";

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useParams } from 'next/navigation';
import { ChakraProvider, Box, Button, HStack, IconButton, Text, Spinner, Center } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon } from '@chakra-ui/icons';

// Configure PDF.js worker to use local file
pdfjs.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.js';

export default function PDFViewerPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const pdfUrl = `/docs/${slug}.pdf`;

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error);
    setLoading(false);
    setError(true);
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${slug}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ChakraProvider>
      <Box
        minH="100vh"
        bg="gray.50"
        display="flex"
        flexDirection="column"
      >
        {/* Header */}
        <Box
          bg="white"
          borderBottom="1px solid"
          borderColor="gray.200"
          p={4}
          position="sticky"
          top={0}
          zIndex={10}
          boxShadow="sm"
        >
          <HStack justify="space-between" maxW="1200px" mx="auto">
            <Text fontSize="lg" fontWeight="medium" color="gray.800">
              {slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Text>
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
        </Box>

        {/* PDF Viewer */}
        <Box flex={1} overflow="auto" py={8}>
          {loading && !error && (
            <Center h="70vh">
              <Spinner size="xl" color="blue.500" />
            </Center>
          )}

          {error && (
            <Center h="70vh">
              <Box textAlign="center">
                <Text fontSize="xl" color="red.500" mb={2}>
                  Error loading PDF
                </Text>
                <Text color="gray.600">
                  The file &quot;{slug}.pdf&quot; could not be found or loaded.
                </Text>
              </Box>
            </Center>
          )}

          {!error && (
            <Box display="flex" justifyContent="center" alignItems="flex-start">
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={null}
              >
                <Box
                  bg="white"
                  boxShadow="lg"
                  borderRadius="md"
                  overflow="hidden"
                >
                  <Page
                    pageNumber={pageNumber}
                    renderAnnotationLayer={true}
                    renderTextLayer={true}
                    width={Math.min(typeof window !== 'undefined' ? window.innerWidth * 0.8 : 800, 900)}
                  />
                </Box>
              </Document>
            </Box>
          )}
        </Box>

        {/* Navigation Footer */}
        {numPages > 0 && !error && (
          <Box
            bg="white"
            borderTop="1px solid"
            borderColor="gray.200"
            p={4}
            position="sticky"
            bottom={0}
            boxShadow="sm"
          >
            <HStack justify="center" spacing={4}>
              <IconButton
                aria-label="Previous page"
                icon={<ChevronLeftIcon />}
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
                size="md"
                colorScheme="blue"
                variant="outline"
              />
              <Text fontSize="md" color="gray.700" minW="120px" textAlign="center">
                Page {pageNumber} of {numPages}
              </Text>
              <IconButton
                aria-label="Next page"
                icon={<ChevronRightIcon />}
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
                size="md"
                colorScheme="blue"
                variant="outline"
              />
            </HStack>
          </Box>
        )}
      </Box>
    </ChakraProvider>
  );
}
