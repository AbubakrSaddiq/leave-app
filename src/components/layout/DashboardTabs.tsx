import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { UserRole } from "@/types/auth";
import { BalanceDashboard } from "@/components/balances/BalanceDashboard";
import { LeaveApplicationForm } from "@/components/leaves/LeaveApplicationForm";
import { MyLeaveApplications } from "@/components/leaves/MyLeaveApplications";
import { ApprovalQueue } from "@/components/leaves/ApprovalQueue";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { DepartmentManagement } from "@/components/admin/DepartmentManagement";
import { UserManagement } from "@/components/admin/UserManagement";
interface DashboardTabsProps {
  role: UserRole;
}

export const DashboardTabs = ({ role }: DashboardTabsProps) => {
  const isAdmin = role === "admin";
  const isHR = role === "hr";
  const isDirector = role === "director";

  return (
    <Tabs colorScheme="blue" variant="enclosed" isLazy>
      <TabList>
        <Tab>📊 My Balances</Tab>
        <Tab>✍️ Apply</Tab>
        <Tab>📋 My Applications</Tab>
        {isDirector && <Tab>✅ Director Approvals</Tab>}
        {isHR && <Tab>✅ HR Approvals</Tab>}
        {isAdmin && <Tab>👥 Users</Tab>}
        {isAdmin && <Tab>🏢 Departments</Tab>}
      </TabList>

      <TabPanels>
        <TabPanel><BalanceDashboard /></TabPanel>
        <TabPanel><LeaveApplicationForm /></TabPanel>
        <TabPanel><MyLeaveApplications /></TabPanel>
        {isDirector && <TabPanel><ApprovalQueue role="director" /></TabPanel>}
        {isHR && <TabPanel><ApprovalQueue role="hr" /></TabPanel>}
        {isAdmin && <TabPanel><UserManagement /></TabPanel>}
        {isAdmin && <TabPanel><DepartmentManagement /></TabPanel>}
      </TabPanels>
    </Tabs>
  );
};