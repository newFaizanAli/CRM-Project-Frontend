import {
  BanknotesIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import DashboardWidgets from "../../components/custom/DashboardWidgets";

const payrollModules = [
  {
    name: "Salary Component",
    icon: <BanknotesIcon className="h-8 w-8" />,
    path: "/payroll/salary-comonent",
  },
  {
    name: "Salary Structure",
    icon: <ClipboardDocumentListIcon className="h-8 w-8" />,
    path: "/payroll/salary-structure",
  },

  {
    name: "Salary Slip",
    icon: <DocumentTextIcon className="h-8 w-8" />,
    path: "/payroll/salary-slip",
  },
];

export default function PayrollDashboard() {
  return <DashboardWidgets data={payrollModules} title={"Payrolls"} />;
}
