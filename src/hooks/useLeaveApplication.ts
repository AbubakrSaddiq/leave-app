// ============================================
// Leave Application Hook
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';
import {
  getLeaveApplications,
  getLeaveApplication,
  createLeaveApplication,
  validateLeaveApplication,
  // approveLeaveApplication,
  updateLeaveStatus,
} from '@/api/leaves.api';
import type { CreateLeaveApplicationDto, LeaveStatus, LeaveType } from '@/types/models';

// ============================================
// QUERY HOOKS
// ============================================

export const useLeaveApplications = (params?: {
  status?: LeaveStatus | LeaveStatus[];
  leave_type?: LeaveType;
  user_id?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['leave-applications', params],
    queryFn: () => getLeaveApplications(params),
    staleTime: 30000,
  });
};

export const useMyLeaveApplications = (params?: {
  status?: LeaveStatus | LeaveStatus[];
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['my-leave-applications', params],
    queryFn: async () => {
      // Get current user from somewhere - we'll fix this later
      return getLeaveApplications(params);
    },
    staleTime: 30000,
  });
};

export const useLeaveApplication = (id: string) => {
  return useQuery({
    queryKey: ['leave-application', id],
    queryFn: () => getLeaveApplication(id),
    enabled: !!id,
  });
};

export const useValidateLeaveApplication = (
  userId: string,
  leaveType: LeaveType,
  startDate: string,
  endDate: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['validate-leave', userId, leaveType, startDate, endDate],
    queryFn: () => validateLeaveApplication(userId, leaveType, startDate, endDate),
    enabled: enabled && !!userId && !!startDate && !!endDate,
    staleTime: 0,
    retry: 1,
  });
};

// ============================================
// MUTATION HOOKS
// ============================================

export const useCreateLeaveApplication = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: CreateLeaveApplicationDto) => createLeaveApplication(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leave-applications'] });
      queryClient.invalidateQueries({ queryKey: ['my-leave-applications'] });
      queryClient.invalidateQueries({ queryKey: ['leave-balances'] });

      toast({
        title: 'Leave Application Submitted',
        description: `Application ${data.application_number} has been submitted.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Submission Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};


export const useApproveLeaveApplication = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    // mutationFn now accepts id, status, and comments
    mutationFn: ({ 
      id, 
      status, 
      comments 
    }: { 
      id: string; 
      status: 'approved' | 'pending_hr'; 
      comments: string 
    }) => updateLeaveStatus(id, status, comments),
    
    onSuccess: (data) => {
      // Refresh the list and the specific application
      queryClient.invalidateQueries({ queryKey: ['leave-applications'] });
      queryClient.invalidateQueries({ queryKey: ['leave-application', data.id] });
      // Refresh balances in case this was the final approval
      queryClient.invalidateQueries({ queryKey: ['leave-balances'] });

      toast({
        title: 'Application Approved',
        description: `Application ${data.application_number} has been updated to ${data.status.replace('_', ' ')}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Approval Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};

// Reject Leave Application

// export const useRejectLeaveApplication = () => {
//   const queryClient = useQueryClient();
//   const toast = useToast();

//   return useMutation({
//     mutationFn: ({ id, comments }: { id: string; comments: string }) =>
//       rejectLeaveApplication(id, comments),
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ['leave-applications'] });
//       queryClient.invalidateQueries({ queryKey: ['leave-application', data.id] });

//       toast({
//         title: 'Application Rejected',
//         description: `Application ${data.application_number} has been rejected.`,
//         status: 'info',
//         duration: 5000,
//         isClosable: true,
//       });
//     },
//     onError: (error: Error) => {
//       toast({
//         title: 'Rejection Failed',
//         description: error.message,
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//       });
//     },
//   });
// };

export const useRejectLeaveApplication = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    // We call the consolidated function and force 'rejected'
    mutationFn: ({ id, comments }: { id: string; comments: string }) =>
      updateLeaveStatus(id, 'rejected', comments), 
    
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leave-applications'] });
      queryClient.invalidateQueries({ queryKey: ['leave-application', data.id] });

      toast({
        title: 'Application Rejected',
        description: `Application ${data.application_number} has been rejected.`,
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Rejection Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};