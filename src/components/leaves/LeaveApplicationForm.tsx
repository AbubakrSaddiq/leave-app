import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Select,
  Textarea,
  VStack,
  HStack,
  Input,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Text,
  Divider,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import { useLeaveForm } from "@/hooks/useLeaveForm";
import { LEAVE_TYPE_OPTIONS } from "@/constants/leaveConstants";
import { formatDisplayDate } from "@/utils/dateUtils";
import { format } from "date-fns";

interface LeaveApplicationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const LeaveApplicationForm: React.FC<LeaveApplicationFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  // Pulling everything from our custom hook
  const {
    form,
    workingDays,
    setWorkingDays,
    calculatedEndDate,
    resumptionDate,
    isCalculating,
    currentBalance,
    submitForm,
    isSubmitting,
    error,
  } = useLeaveForm(onSuccess);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = form;

  const leaveType = watch("leave_type");

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(submitForm)}
      bg="white"
      p={6}
      borderRadius="lg"
      boxShadow="md"
    >
      <VStack spacing={6} align="stretch">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={2}>
            Apply for Leave
          </Text>
          <Text color="gray.600">
            Fill in the details below to submit your leave request
          </Text>
        </Box>

        <Divider />

        {/* Leave Type Selection */}
        <FormControl isInvalid={!!errors.leave_type} isRequired>
          <FormLabel>Leave Type</FormLabel>
          <Select {...register("leave_type", { required: true })} size="lg">
            {LEAVE_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          {leaveType && (
            <FormHelperText>
              {LEAVE_TYPE_OPTIONS.find((o) => o.value === leaveType)?.description}
            </FormHelperText>
          )}
        </FormControl>

        {/* Dynamic Leave Balance Alert */}
        {currentBalance && (
          <Alert
            status={currentBalance.available_days < 5 ? "warning" : "info"}
            borderRadius="md"
          >
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>Current Balance</AlertTitle>
              <AlertDescription>
                Available: <strong>{currentBalance.available_days} days</strong>
                {" / "}
                Allocated: {currentBalance.allocated_days} days
              </AlertDescription>
            </Box>
          </Alert>
        )}

        {/* Start Date & Working Days Inputs */}
        <HStack spacing={4} align="flex-start">
          <FormControl isInvalid={!!errors.start_date} isRequired flex={1}>
            <FormLabel>Start Date</FormLabel>
            <Input
              type="date"
              {...register("start_date", { required: "Start date is required" })}
              size="lg"
              min={format(new Date(), "yyyy-MM-dd")}
            />
            <FormErrorMessage>{errors.start_date?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired flex={1}>
            <FormLabel>Working Days</FormLabel>
            <NumberInput
              value={workingDays}
              onChange={(_, value) => setWorkingDays(value || 1)}
              min={1}
              max={currentBalance?.available_days || 365}
              size="lg"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormHelperText>Excludes weekends & holidays</FormHelperText>
          </FormControl>
        </HStack>

        {/* Calculated Leave Summary Section */}
        {(isCalculating || calculatedEndDate) && (
          <Alert status="info" variant="left-accent" borderRadius="md" bg="blue.50">
            <Box flex="1">
              <AlertTitle fontSize="md" mb={3} color="blue.900">
                📊 Leave Summary
              </AlertTitle>

              {isCalculating ? (
                <HStack>
                  <Spinner size="sm" color="blue.500" />
                  <Text fontSize="sm">Calculating dates...</Text>
                </HStack>
              ) : (
                <VStack align="stretch" spacing={3}>
                  <SummaryItem 
                    label="END DATE (Last day of leave)" 
                    value={formatDisplayDate(calculatedEndDate)} 
                    color="orange.700" 
                  />
                  <SummaryItem 
                    label="RESUMPTION DATE (Return to work)" 
                    value={formatDisplayDate(resumptionDate)} 
                    color="green.700" 
                  />
                  <Divider />
                  <HStack justify="space-between">
                    <Text fontSize="sm" fontWeight="bold">Total Working Days:</Text>
                    <Badge colorScheme="purple" fontSize="md" px={3}>
                      {workingDays} {workingDays === 1 ? "day" : "days"}
                    </Badge>
                  </HStack>
                </VStack>
              )}
            </Box>
          </Alert>
        )}

        {/* Reason Field */}
        <FormControl isInvalid={!!errors.reason} isRequired>
          <FormLabel>Reason for Leave</FormLabel>
          <Textarea
            {...register("reason", {
              required: "Reason is required",
              minLength: { value: 10, message: "Minimum 10 characters" },
            })}
            placeholder="Provide a detailed reason..."
            size="lg"
            rows={4}
          />
          <FormErrorMessage>{errors.reason?.message}</FormErrorMessage>
        </FormControl>

        {/* API Error Handling */}
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <AlertDescription>{(error as Error).message}</AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <HStack spacing={4} justify="flex-end" pt={4}>
          {onCancel && (
            <Button variant="outline" onClick={onCancel} isDisabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isSubmitting || isCalculating}
            loadingText={isCalculating ? "Calculating..." : "Submitting..."}
            size="lg"
            isDisabled={!calculatedEndDate || isCalculating}
          >
            Submit Leave Request
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

/**
 * Helper component for clean summary items
 */
const SummaryItem = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <Box p={3} bg="white" borderRadius="md">
    <Text fontSize="xs" color="gray.600" fontWeight="semibold" mb={1}>
      {label}
    </Text>
    <Text fontSize="md" fontWeight="bold" color={color}>
      📅 {value}
    </Text>
  </Box>
);