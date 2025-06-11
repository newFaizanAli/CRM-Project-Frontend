import {
  ClipboardDocumentListIcon,
  WrenchScrewdriverIcon,
  BuildingLibraryIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import DashboardWidgets from "../../components/custom/DashboardWidgets";

const maintenanceModules = [
  {
    name: "BOM",
    icon: <ClipboardDocumentListIcon className="h-8 w-8" />,
    path: "/manufacturing/bom",
  },
  {
    name: "Workstaions",
    icon: <WrenchScrewdriverIcon className="h-8 w-8" />,
    path: "/manufacturing/workstations",
  },
  {
    name: "Workstaion Type",
    icon: <BuildingLibraryIcon className="h-8 w-8" />,
    path: "/manufacturing/workstations-types",
  },
  {
    name: "Operation",
    icon: <Cog6ToothIcon className="h-8 w-8" />,
    path: "/manufacturing/operations",
  },
];

export default function ManufacturingDashboard() {
  return (
    <DashboardWidgets data={maintenanceModules} title={"Manufacturings"} />
  );
}
