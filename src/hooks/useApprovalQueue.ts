import { useState } from "react";
import { 
  useLeaveApplications, 
  useApproveLeaveApplication, 
  useRejectLeaveApplication 
} from "@/hooks/useLeaveApplication";
import { LeaveStatus, LeaveApplication } from "@/types/models";

export const useApprovalQueue = (role: "director" | "hr") => {
  const [statusFilter, setStatusFilter] = useState<LeaveStatus | "all">("all");

  // Define what "pending" means for the current user
  const rolePendingStatus = role === "director" 
    ? LeaveStatus.PENDING_DIRECTOR 
    : LeaveStatus.PENDING_HR;

  // Determine which statuses to fetch
  const queryParams = {
    status: statusFilter === "all" ? [rolePendingStatus] : [statusFilter as LeaveStatus],
    page: 1,
    limit: 50,
  };

  const { data, isLoading, error } = useLeaveApplications(queryParams);
  const approveMutation = useApproveLeaveApplication();
  const rejectMutation = useRejectLeaveApplication();

  const handleApprove = async (id: string, comments?: string) => {
    // Workflow Logic: Director moves it to HR, HR moves it to Approved
    const nextStatus = role === "director" 
      ? LeaveStatus.PENDING_HR 
      : LeaveStatus.APPROVED;

    return approveMutation.mutateAsync({
      id,
      status: nextStatus,
      comments: comments || "Approved",
    });
  };

  const handleReject = async (id: string, comments: string) => {
    return rejectMutation.mutateAsync({ id, comments });
  };

  const applications = data?.data || [];
  const pendingCount = applications.filter(app => app.status === rolePendingStatus).length;

  return {
    applications,
    pendingCount,
    rolePendingStatus,
    statusFilter,
    setStatusFilter,
    isLoading,
    error,
    handleApprove,
    handleReject,
    isProcessing: approveMutation.isPending || rejectMutation.isPending,
  };
};