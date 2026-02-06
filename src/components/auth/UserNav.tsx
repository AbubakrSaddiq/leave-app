import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Divider,
  Spinner,
  Center,
  Icon,
} from "@chakra-ui/react";
import { FiLogOut, FiUser, FiShield } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { LoginForm } from "../auth/LoginForm";

export const UserNav = () => {
  const { profile, isLoading } = useAuth();

  // 1. Loading State
  if (isLoading) {
    return (
      <Box p={6} bg="white" borderRadius="lg" boxShadow="sm" border="1px solid" borderColor="gray.100">
        <Center>
          <VStack spacing={3}>
            <Spinner size="sm" color="blue.500" />
            <Text fontSize="xs" color="gray.500">Authenticating...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  // 2. Authenticated State: Show Profile & Logout
  if (profile) {
    return (
      <Box
        p={4}
        bg="white"
        borderRadius="lg"
        boxShadow="sm"
        border="1px solid"
        borderColor="gray.100"
      >
        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between">
            <HStack spacing={3}>
              <Center bg="blue.50" p={2} borderRadius="md">
                <Icon as={FiUser} color="blue.500" />
              </Center>
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold" fontSize="sm" lineHeight="shorter">
                  {profile.full_name}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {profile.email}
                </Text>
              </VStack>
            </HStack>
          </HStack>

          <Divider />

          <HStack justify="space-between">
            <HStack spacing={2}>
              <Badge colorScheme="purple" variant="subtle" px={2}>
                <HStack spacing={1}>
                  <Icon as={FiShield} boxSize="10px" />
                  <Text>{profile.role}</Text>
                </HStack>
              </Badge>
              {profile.department && (
                <Badge colorScheme="gray" variant="outline">
                  {profile.department.code}
                </Badge>
              )}
            </HStack>

            <Button
              leftIcon={<FiLogOut />}
              size="xs"
              variant="ghost"
              colorScheme="red"
              onClick={() => authService.signOut()}
            >
              Logout
            </Button>
          </HStack>
        </VStack>
      </Box>
    );
  }

  // 3. Unauthenticated State: Show Login Form
  return (
    <Box>
      <LoginForm />
    </Box>
  );
};