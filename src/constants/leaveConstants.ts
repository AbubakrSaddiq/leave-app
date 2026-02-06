import { LeaveType } from "@/types/models";

export const LEAVE_TYPE_OPTIONS = [
  {
    value: LeaveType.ANNUAL,
    label: "Annual Leave",
    description: "30 days/year - 14 days notice",
  },
  {
    value: LeaveType.CASUAL,
    label: "Casual Leave",
    description: "7 days/year - 14 days notice",
  },
  {
    value: LeaveType.SICK,
    label: "Sick Leave",
    description: "10 days/year (reapplicable) - No notice",
  },
  {
    value: LeaveType.MATERNITY,
    label: "Maternity Leave",
    description: "16 weeks - 4 weeks notice",
  },
  {
    value: LeaveType.PATERNITY,
    label: "Paternity Leave",
    description: "14 days - 14 days notice",
  },
];