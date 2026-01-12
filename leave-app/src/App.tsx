import {
  ChakraProvider,
  Container,
  Heading,
  Text,
  Box,
  Button,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { BalanceDashboard } from "@/components/balances/BalanceDashboard";
import { LeaveApplicationForm } from "@/components/leaves/LeaveApplicationForm";

const queryClient = new QueryClient();

function LoginButton() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "test@company.com",
      password: "Test123!",
    });

    if (error) {
      alert("❌ " + error.message);
    } else {
      setUser(data.user);
      window.location.reload();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.reload();
  };

  return (
    <Box mb={6} p={4} bg="white" borderRadius="lg" boxShadow="sm">
      {user ? (
        <VStack align="flex-start" spacing={2}>
          <Text fontWeight="bold">✅ Logged in as: {user.email}</Text>
          <Button size="sm" onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </VStack>
      ) : (
        <VStack align="flex-start" spacing={2}>
          <Text>❌ Not logged in</Text>
          <Button size="sm" onClick={handleLogin} colorScheme="blue">
            Quick Login (test@company.com)
          </Button>
        </VStack>
      )}
    </Box>
  );
}

function App() {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <Container maxW="container.xl" py={8}>
          <Heading mb={2}>Leave Management System 🎉</Heading>
          <Text mb={6} color="gray.600">
            Module 2 Complete - Balance Dashboard + Leave Application
          </Text>

          <LoginButton />

          <Tabs colorScheme="blue" variant="enclosed">
            <TabList>
              <Tab>My Balances</Tab>
              <Tab>Apply for Leave</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <BalanceDashboard />
              </TabPanel>

              <TabPanel>
                <LeaveApplicationForm
                  onSuccess={() => {
                    alert("✅ Leave application submitted successfully!");
                  }}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
