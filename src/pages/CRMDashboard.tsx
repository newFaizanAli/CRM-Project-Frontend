import {
  UserPlusIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/outline";
import DashboardWidgets from "../components/custom/DashboardWidgets";

const crmModules = [
  {
    name: "Leads",
    icon: <UserPlusIcon className="h-8 w-8" />,
    path: "/crm/leads",
  },
  {
    name: "Deals",
    icon: <CurrencyDollarIcon className="h-8 w-8" />,
    path: "/crm/deals",
  },
];

export default function CRMDashboard() {
  return (
    <DashboardWidgets data={crmModules} title={'CRM'} />
  );
}
