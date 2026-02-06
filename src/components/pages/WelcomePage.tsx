import React from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Icon,
  VStack,
  HStack,
  Stack,
  useColorModeValue,
  Circle,
} from "@chakra-ui/react";
import { 
  FiZap, 
  FiClock, 
  FiShield, 
  FiCheckCircle, 
  FiSend, 
  FiSearch 
} from "react-icons/fi";

export const WelcomePage = ({ onLoginClick }: { onLoginClick: () => void }) => {
  return (
    <Box bg="gray.50" minH="100vh">
      {/* 1. Hero Section */}
      <Container maxW="container.xl" pt={{ base: 20, md: 32 }} pb={20}>
        <Stack spacing={10} align="center" textAlign="center">
          <VStack spacing={4} maxW="3xl">
            <Badge px={3} py={1} colorScheme="blue" borderRadius="full" textTransform="uppercase" fontSize="xs" fontWeight="bold">
              New: Automated Leave Workflows 🚀
            </Badge>
            <Heading as="h1" size="3xl" fontWeight="black" lineHeight="tight">
              Streamline Your <Text as="span" color="blue.500">Leave Management</Text>
            </Heading>
            <Text fontSize="xl" color="gray.600" lineHeight="tall">
              A centralized platform for staff, directors, and HR to manage time-off requests 
              efficiently. No more paper forms, no more email chains.
            </Text>
          </VStack>

          <Stack direction={{ base: "column", md: "row" }} spacing={4}>
            <Button
              size="lg"
              colorScheme="blue"
              px={10}
              height="60px"
              fontSize="md"
              onClick={onLoginClick}
              boxShadow="0 4px 14px 0 rgba(0, 118, 255, 0.39)"
              _hover={{ transform: 'translateY(-2px)' }}
            >
              Access Dashboard
            </Button>
            <Button size="lg" variant="ghost" px={10} height="60px">
              View Policy Guide
            </Button>
          </Stack>
        </Stack>
      </Container>

      {/* 2. Benefits Grid */}
      <Box bg="white" py={20}>
        <Container maxW="container.lg">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <FeatureItem
              icon={FiZap}
              title="Instant Calculations"
              desc="Automatic working day calculations excluding weekends and public holidays."
            />
            <FeatureItem
              icon={FiClock}
              title="Real-time Tracking"
              desc="Monitor your application status from submission to final HR approval."
            />
            <FeatureItem
              icon={FiShield}
              title="Secure & Compliant"
              desc="Role-based access ensures data privacy and policy adherence."
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* 3. Workflow Process Section */}
      <Container maxW="container.lg" py={20}>
        <VStack spacing={16}>
          <Heading size="xl">How It Works</Heading>
          
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} width="full">
            <ProcessStep step="1" icon={FiSend} title="Apply" desc="Staff submits a request" />
            <ProcessStep step="2" icon={FiSearch} title="Review" desc="Director checks coverage" />
            <ProcessStep step="3" icon={FiCheckCircle} title="Validate" desc="HR verifies policy" />
            <ProcessStep step="4" icon={FiZap} title="Notify" desc="System updates user" />
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

// --- Helper Components ---

const FeatureItem = ({ icon, title, desc }: any) => (
  <VStack align="start" spacing={4}>
    <Circle size="12" bg="blue.50" color="blue.500">
      <Icon as={icon} boxSize="6" />
    </Circle>
    <Text fontWeight="bold" fontSize="lg">{title}</Text>
    <Text color="gray.600">{desc}</Text>
  </VStack>
);

const ProcessStep = ({ step, icon, title, desc }: any) => (
  <VStack textAlign="center" spacing={4} p={6} bg="white" borderRadius="xl" boxShadow="sm">
    <Circle size="8" bg="blue.500" color="white" fontWeight="bold" fontSize="sm">
      {step}
    </Circle>
    <Icon as={icon} boxSize="6" color="blue.500" />
    <Box>
      <Text fontWeight="bold">{title}</Text>
      <Text fontSize="sm" color="gray.500">{desc}</Text>
    </Box>
  </VStack>
);

const Badge = (props: any) => (
  <Box
    as="span"
    bg={useColorModeValue("blue.50", "blue.900")}
    color={useColorModeValue("blue.600", "blue.200")}
    {...props}
  />
);