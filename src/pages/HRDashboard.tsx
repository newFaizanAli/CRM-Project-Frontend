import DashboardWidgets from "../components/custom/DashboardWidgets";

import {
  IdentificationIcon,
  BuildingLibraryIcon,
  UserGroupIcon,
  BuildingOfficeIcon
} from "@heroicons/react/24/outline";

const accountModules = [
  {
    name: "Departments",
    icon: <BuildingLibraryIcon className="h-8 w-8" />,
    path: "/hr/departments",
  },
  {
    name: "Employees",
    icon: <IdentificationIcon className="h-8 w-8" />,
    path: "/hr/employees",
  },
  {
    name: "Companies",
    icon: <BuildingOfficeIcon className="h-8 w-8" />,
    path: "/hr/companies",
  },
  {
    name: "Contacts",
    icon: <UserGroupIcon className="h-8 w-8" />,
    path: "/hr/contacts",
  },
];

export default function HRDashboard() {
  return <DashboardWidgets data={accountModules} title={"HR"} />;
}
