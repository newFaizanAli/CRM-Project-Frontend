import {
  IdentificationIcon,
  BuildingLibraryIcon
} from "@heroicons/react/24/outline";
import DashboardWidgets from "../components/custom/DashboardWidgets";

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
];

export default function HRDashboard() {
  return (
    <DashboardWidgets data={accountModules} title={'HR'} />
  );
}
