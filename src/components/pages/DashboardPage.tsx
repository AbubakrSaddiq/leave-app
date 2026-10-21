// ============================================
// DashboardPage - Dashboard Home Page
// Wraps BalanceDashboard with enterprise layout
// ============================================

import React from "react";
import { Box, Container, VStack } from "@chakra-ui/react";
import { BalanceDashboard } from "@/components/balances/BalanceDashboard";
import { DesiredMonthsChecker } from "@/components/desiredMonths/DesiredMonthsChecker";
import { AnalyticsDashboard } from "../analytics/AnalyticsDashboard";
import { useAuth } from "@/hooks/useAuth";

const DashboardPage: React.FC = () => {
  const { profile } = useAuth();

  // show hr, director analytics dashboard
  const showAnalytics =
    profile?.role === "hr" ||
    profile?.role === "admin" ||
    profile?.role === "director";

  if (showAnalytics) {
    return (
      <VStack spacing={8} align="stretch">
        <Box>
          <AnalyticsDashboard />
        </Box>
      </VStack>
    );
  }

  return (
    <VStack spacing={8} align="stretch">
      {/* Desired Months Modal Checker */}
      <DesiredMonthsChecker />
      {/* Main Dashboard Content */}
      <Box>
        <BalanceDashboard />
      </Box>
    </VStack>
  );
};

export default DashboardPage;
