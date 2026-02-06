import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format, addDays } from "date-fns";
import { leaveService } from "@/services/leaveService";
import { useCreateLeaveApplication } from "@/hooks/useLeaveApplication";
import { useMyLeaveBalances } from "@/hooks/useLeaveBalance";
import { LeaveType, CreateLeaveApplicationDto } from "@/types/models"; // Import DTO

export const useLeaveForm = (onSuccess?: () => void) => {
  const createMutation = useCreateLeaveApplication();
  const { data: balanceData } = useMyLeaveBalances();
  
  const [workingDays, setWorkingDays] = useState<number>(1);
  const [calculatedEndDate, setCalculatedEndDate] = useState<string>("");
  const [resumptionDate, setResumptionDate] = useState<string>("");
  const [isCalculating, setIsCalculating] = useState(false);

  // 1. Use CreateLeaveApplicationDto here
  const form = useForm<CreateLeaveApplicationDto>({
    defaultValues: {
      leave_type: LeaveType.ANNUAL, // Use the Enum directly
      start_date: format(addDays(new Date(), 14), "yyyy-MM-dd"),
      end_date: "",
      reason: "",
      working_days: 1, 
    },
  });

  const { watch, setValue, reset } = form;
  const leaveType = watch("leave_type");
  const startDate = watch("start_date");

  const currentBalance = balanceData?.balances.find(b => b.leave_type === leaveType);

  useEffect(() => {
    const updateDates = async () => {
      if (!startDate || workingDays <= 0) return;
      
      setIsCalculating(true);
      try {
        const endDate = await leaveService.calculateEndDate(startDate, workingDays);
        const resumption = await leaveService.calculateResumptionDate(endDate);
        
        setCalculatedEndDate(endDate);
        setResumptionDate(resumption);
        
        // 2. Keep the form state in sync
        setValue("end_date", endDate);
        setValue("working_days", workingDays); 
      } finally {
        setIsCalculating(false);
      }
    };
    updateDates();
  }, [startDate, workingDays, setValue]);

  const submitForm = async (data: CreateLeaveApplicationDto) => {
    if (!calculatedEndDate) return;
    
    // 3. Now 'data' is already the correct type!
    await createMutation.mutateAsync({
      ...data,
      end_date: calculatedEndDate,
      working_days: workingDays,
    });

    reset();
    setWorkingDays(1);
    onSuccess?.();
  };

  return {
    form,
    workingDays,
    setWorkingDays,
    calculatedEndDate,
    resumptionDate,
    isCalculating,
    currentBalance,
    submitForm,
    isSubmitting: createMutation.isPending,
    error: createMutation.error,
  };
};