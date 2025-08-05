import { MouseEvent } from "react";
import {
  Heading,
  Link,
  Card,
  CardHeader,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { useFriggState } from '../hooks/useFriggState';

export function EmptyState(props: { onChoice: (question: string) => any }) {
  const { isDarkMode } = useFriggState();
  
  const handleClick = (e: MouseEvent) => {
    const text = (e.target as HTMLDivElement).innerText;
    console.log('Button clicked, sending:', text);
    props.onChoice(text);
  };
  return (
    <div className="rounded flex flex-col items-center max-w-full md:p-8">
      <Flex marginTop={"25px"} grow={1} maxWidth={"800px"} width={"100%"}>
        <Card
          onMouseUp={handleClick}
          width={"48%"}
          backgroundColor={isDarkMode ? "gray.800" : "white"}
          border={"1px solid"}
          borderColor={isDarkMode ? "gray.600" : "gray.300"}
          _hover={{ backgroundColor: isDarkMode ? "gray.700" : "gray.50" }}
          cursor={"pointer"}
          justifyContent={"center"}
          rounded={"lg"}
        >
          <CardHeader justifyContent={"center"}>
            <Heading
              fontSize="lg"
              fontWeight={"medium"}
              mb={1}
              color={isDarkMode ? "gray.200" : "gray.700"}
              textAlign={"center"}
            >
              Run an illustration
            </Heading>
          </CardHeader>
        </Card>
        <Spacer />
        <Card
          onMouseUp={handleClick}
          width={"48%"}
          backgroundColor={isDarkMode ? "gray.800" : "white"}
          border={"1px solid"}
          borderColor={isDarkMode ? "gray.600" : "gray.300"}
          _hover={{ backgroundColor: isDarkMode ? "gray.700" : "gray.50" }}
          cursor={"pointer"}
          justifyContent={"center"}
          rounded={"lg"}
        >
          <CardHeader justifyContent={"center"}>
            <Heading
              fontSize="lg"
              fontWeight={"medium"}
              mb={1}
              color={isDarkMode ? "gray.200" : "gray.700"}
              textAlign={"center"}
            >
              Get a quick quote
            </Heading>
          </CardHeader>
        </Card>
      </Flex>
      <Flex marginTop={"25px"} grow={1} maxWidth={"800px"} width={"100%"}>
        <Card
          onMouseUp={handleClick}
          width={"48%"}
          backgroundColor={isDarkMode ? "gray.800" : "white"}
          border={"1px solid"}
          borderColor={isDarkMode ? "gray.600" : "gray.300"}
          _hover={{ backgroundColor: isDarkMode ? "gray.700" : "gray.50" }}
          cursor={"pointer"}
          justifyContent={"center"}
          rounded={"lg"}
        >
          <CardHeader justifyContent={"center"}>
            <Heading
              fontSize="lg"
              fontWeight={"medium"}
              mb={1}
              color={isDarkMode ? "gray.200" : "gray.700"}
              textAlign={"center"}
            >
              Experience SIM-KB
            </Heading>
          </CardHeader>
        </Card>
        <Spacer />
        <Card
          onMouseUp={handleClick}
          width={"48%"}
          backgroundColor={isDarkMode ? "gray.800" : "white"}
          border={"1px solid"}
          borderColor={isDarkMode ? "gray.600" : "gray.300"}
          _hover={{ backgroundColor: isDarkMode ? "gray.700" : "gray.50" }}
          cursor={"pointer"}
          justifyContent={"center"}
          rounded={"lg"}
        >
          <CardHeader justifyContent={"center"}>
            <Heading
              fontSize="lg"
              fontWeight={"medium"}
              mb={1}
              color={isDarkMode ? "gray.200" : "gray.700"}
              textAlign={"center"}
            >
              About Frigg and the life nervous system
            </Heading>
          </CardHeader>
        </Card>
      </Flex>
    </div>
  );
}
