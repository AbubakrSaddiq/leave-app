import React from "react";
import {
  Box, Heading, Text, VStack, HStack, Select, Badge, Spinner,
  Alert, AlertIcon, AlertDescription, SimpleGrid, Divider
} from "@chakra-ui/react";
import { LeaveApplicationCard } from "./LeaveApplicationCard";
import { useApprovalQueue } from "@/hooks/useApprovalQueue";
import { LeaveStatus } from "@/types/models";

interface ApprovalQueueProps {
  role: "director" | "hr";
}

export const ApprovalQueue: React.FC<ApprovalQueueProps> = ({ role }) => {
  const {
    applications,
    pendingCount,
    rolePendingStatus,
    statusFilter,
    setStatusFilter,
    isLoading,
    error,
    handleApprove,
    handleReject,
  } = useApprovalQueue(role);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <VStack spacing={6} align="stretch">
      <QueueHeader 
        role={role} 
        pendingCount={pendingCount} 
        statusFilter={statusFilter} 
        onFilterChange={setStatusFilter} 
      />

      {applications.length === 0 ? (
        <EmptyState />
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {applications.map((app) => (
            <LeaveApplicationCard
              key={app.id}
              application={app}
              showActions={app.status === rolePendingStatus}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </SimpleGrid>
      )}

      <WorkflowGuide role={role} />
    </VStack>
  );
};

// --- Sub-components for better readability ---

const QueueHeader = ({ role, pendingCount, statusFilter, onFilterChange }: any) => (
  <HStack justify="space-between" align="center" wrap="wrap" gap={4}>
    <Box>
      <Heading size="lg" mb={1} textTransform="capitalize">
        {role} Approval Queue
      </Heading>
      <HStack>
        <Text color="gray.600">Review and manage leave requests</Text>
        {pendingCount > 0 && (
          <Badge colorScheme="orange" variant="solid" borderRadius="full" px={2}>
            {pendingCount} Action Required
          </Badge>
        )}
      </HStack>
    </Box>

    <Select
      value={statusFilter}
      onChange={(e) => onFilterChange(e.target.value as LeaveStatus | "all")}
      width="220px"
      bg="white"
    >
      <option value="all">Needs My Action</option>
      <Divider />
      <option value={LeaveStatus.PENDING_DIRECTOR}>Pending Director</option>
      <option value={LeaveStatus.PENDING_HR}>Pending HR</option>
      <option value={LeaveStatus.APPROVED}>Approved</option>
      <option value={LeaveStatus.REJECTED}>Rejected</option>
    </Select>
  </HStack>
);

const WorkflowGuide = ({ role }: { role: "director" | "hr" }) => (
  <Box bg="blue.50" p={4} borderRadius="lg" borderLeft="4px solid" borderLeftColor="blue.400">
    <Text fontWeight="bold" fontSize="sm" mb={2} color="blue.800">📋 {role.toUpperCase()} RESPONSIBILITIES:</Text>
    <VStack align="flex-start" spacing={1} fontSize="xs" color="blue.700">
      {role === "director" ? (
        <>
          <Text>• Ensure team coverage during the requested period.</Text>
          <Text>• Approval moves the request to HR for final validation.</Text>
        </>
      ) : (
        <>
          <Text>• Verify leave balance and adherence to company policy.</Text>
          <Text>• Approval marks the request as Final and notifies the staff.</Text>
        </>
      )}
    </VStack>
  </Box>
);

const LoadingState = () => (
  <Box textAlign="center" py={20}>
    <Spinner size="xl" color="blue.500" thickness="4px" />
    <Text mt={4} fontWeight="medium">Fetching applications...</Text>
  </Box>
);

const ErrorState = () => (
  <Alert status="error" borderRadius="md">
    <AlertIcon />
    <AlertDescription>We couldn't load the queue. Please refresh the page.</AlertDescription>
  </Alert>
);

const EmptyState = () => (
  <Box py={10} textAlign="center" border="2px dashed" borderColor="gray.200" borderRadius="xl">
    <Text color="gray.500" fontSize="lg">No applications found in this category. 🎉</Text>
  </Box>
);