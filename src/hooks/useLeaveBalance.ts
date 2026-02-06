// ============================================
// Leave Balance Hook
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';
import {
  getMyLeaveBalances,
  getUserLeaveBalances,
  allocateLeaveForUser,
  allocateLeaveForAllUsers,
} from '@/api/balances.api';

// ============================================
// QUERY HOOKS
// ============================================

export const useMyLeaveBalances = (year?: number) => {
  return useQuery({
    queryKey: ['my-leave-balances', year],
    queryFn: () => getMyLeaveBalances(year),
    staleTime: 60000,
  });
};

export const useUserLeaveBalances = (userId: string, year?: number) => {
  return useQuery({
    queryKey: ['user-leave-balances', userId, year],
    queryFn: () => getUserLeaveBalances(userId, year),
    enabled: !!userId,
    staleTime: 60000,
  });
};

// ============================================
// MUTATION HOOKS
// ============================================

export const useAllocateLeaveForUser = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ userId, year }: { userId: string; year: number }) =>
      allocateLeaveForUser(userId, year),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['user-leave-balances', variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['my-leave-balances'],
      });

      toast({
        title: 'Leave Allocated',
        description: `Leave has been allocated for ${variables.year}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Allocation Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};

export const useAllocateLeaveForAllUsers = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (year?: number) => allocateLeaveForAllUsers(year),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leave-balances'] });
      queryClient.invalidateQueries({ queryKey: ['my-leave-balances'] });

      toast({
        title: 'Annual Allocation Complete',
        description: `Leave allocated for ${data.user_count} users for ${data.year}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Allocation Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};

// ============================================
// UTILITY HOOKS
// ============================================

export const useTotalAvailableDays = () => {
  const { data } = useMyLeaveBalances();
  return data?.summary.total_available || 0;
};