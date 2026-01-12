// ============================================
// Leave Application Form Component
// ============================================

import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useCreateLeaveApplication } from "@/hooks/useLeaveApplication";
import { useMyLeaveBalances } from "@/hooks/useLeaveBalance";
import { LeaveType } from "@/types/models";
import { format, addDays } from "date-fns";

const LEAVE_TYPE_OPTIONS = [
  {
    value: "annual",
    label: "Annual Leave",
    description: "30 days/year - 14 days notice",
  },
  {
    value: "casual",
    label: "Casual Leave",
    description: "7 days/year - 14 days notice",
  },
  {
    value: "sick",
    label: "Sick Leave",
    description: "10 days/year (reapplicable) - No notice",
  },
  {
    value: "maternity",
    label: "Maternity Leave",
    description: "16 weeks - 4 weeks notice",
  },
  {
    value: "paternity",
    label: "Paternity Leave",
    description: "14 days - 14 days notice",
  },
];

interface FormData {
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
}

interface LeaveApplicationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const LeaveApplicationForm: React.FC<LeaveApplicationFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const createMutation = useCreateLeaveApplication();
  const { data: balanceData } = useMyLeaveBalances();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      leave_type: "annual" as LeaveType,
      start_date: format(addDays(new Date(), 14), "yyyy-MM-dd"),
      end_date: format(addDays(new Date(), 14), "yyyy-MM-dd"),
      reason: "",
    },
  });

  const leaveType = watch("leave_type");
  const startDate = watch("start_date");
  const endDate = watch("end_date");

  const currentBalance = balanceData?.balances.find(
    (b) => b.leave_type === leaveType
  );

  const onSubmit = async (data: FormData) => {
    try {
      await createMutation.mutateAsync(data);
      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to submit:", error);
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(onSubmit)}
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

        {/* Leave Type */}
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
              {
                LEAVE_TYPE_OPTIONS.find((o) => o.value === leaveType)
                  ?.description
              }
            </FormHelperText>
          )}
        </FormControl>

        {/* Current Balance */}
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
                {currentBalance.leave_type === "sick" && (
                  <Text fontSize="sm" mt={1}>
                    Note: Sick leave can be reapplied if needed
                  </Text>
                )}
              </AlertDescription>
            </Box>
          </Alert>
        )}

        {/* Dates */}
        <HStack spacing={4} align="flex-start">
          <FormControl isInvalid={!!errors.start_date} isRequired flex={1}>
            <FormLabel>Start Date</FormLabel>
            <Input
              type="date"
              {...register("start_date", {
                required: "Start date is required",
              })}
              size="lg"
              min={format(new Date(), "yyyy-MM-dd")}
            />
            {errors.start_date && (
              <FormErrorMessage>{errors.start_date.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.end_date} isRequired flex={1}>
            <FormLabel>End Date</FormLabel>
            <Input
              type="date"
              {...register("end_date", {
                required: "End date is required",
                validate: (value) => {
                  if (value < startDate) {
                    return "End date must be after start date";
                  }
                  return true;
                },
              })}
              size="lg"
              min={startDate || format(new Date(), "yyyy-MM-dd")}
            />
            {errors.end_date && (
              <FormErrorMessage>{errors.end_date.message}</FormErrorMessage>
            )}
          </FormControl>
        </HStack>

        {/* Reason */}
        <FormControl isInvalid={!!errors.reason} isRequired>
          <FormLabel>Reason for Leave</FormLabel>
          <Textarea
            {...register("reason", {
              required: "Reason is required",
              minLength: {
                value: 10,
                message: "Reason must be at least 10 characters",
              },
              maxLength: {
                value: 500,
                message: "Reason must not exceed 500 characters",
              },
            })}
            placeholder="Please provide a detailed reason for your leave request..."
            size="lg"
            rows={4}
          />
          {errors.reason && (
            <FormErrorMessage>{errors.reason.message}</FormErrorMessage>
          )}
          <FormHelperText>Minimum 10 characters, maximum 500</FormHelperText>
        </FormControl>

        {/* Success/Error Messages */}
        {createMutation.isError && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <AlertDescription>
              {(createMutation.error as Error)?.message ||
                "Failed to submit application"}
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <HStack spacing={4} justify="flex-end" pt={4}>
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              isDisabled={createMutation.isPending}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={createMutation.isPending}
            loadingText="Submitting..."
            size="lg"
          >
            Submit Leave Request
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};
