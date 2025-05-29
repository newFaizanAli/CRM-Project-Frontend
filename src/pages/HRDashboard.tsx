import DashboardWidgets from "../components/custom/DashboardWidgets";

import {
  IdentificationIcon,
  BuildingLibraryIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

const mainModules = [
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

const attendanceModules = [
  {
    name: "Attendance",
    icon: <ClipboardDocumentCheckIcon className="h-8 w-8" />,
    path: "/hr/attendances",
  },
  {
    name: "Leave & Request",
    icon: <CalendarDaysIcon className="h-8 w-8" />,
    path: "/hr/leaves",
  },
];

export default function HRDashboard() {
  return (
    <>
      <DashboardWidgets data={mainModules} title={"HR"} />
      <DashboardWidgets
        titleTextSize={"text-lg"}
        data={attendanceModules}
        title={"Attendance"}
      />
    </>
  );
}
