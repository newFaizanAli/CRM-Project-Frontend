import {
  BanknotesIcon,
  RectangleGroupIcon,
  MapPinIcon,
  WrenchScrewdriverIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import DashboardWidgets from "../../components/custom/DashboardWidgets";

const assetModules = [
  {
    name: "Assets",
    icon: <BanknotesIcon className="h-8 w-8" />,
    path: "/asset/assets",
  },
  {
    name: "Asset Category",
    icon: <RectangleGroupIcon className="h-8 w-8" />,
    path: "/asset/category",
  },
  {
    name: "Asset Location",
    icon: <MapPinIcon className="h-8 w-8" />,
    path: "/asset/location",
  },
];

const maintenanceModules = [
  {
    name: "Maintenance Request",
    icon: <WrenchScrewdriverIcon className="h-8 w-8" />,
    path: "/asset/maintenance/request",
  },
  {
    name: "Maintenance Schedule",
    icon: <CalendarDaysIcon className="h-8 w-8" />,
    path: "/asset/maintenance/schedule",
  },
  {
    name: "Maintenance Log",
    icon: <ClipboardDocumentListIcon className="h-8 w-8" />,
    path: "/asset/maintenance/log",
  },
   {
    name: "Maintenance Team",
    icon: <UsersIcon className="h-8 w-8" />,
    path: "/asset/maintenance/team",
  },
];

export default function AssetDashboard() {
  return (
    <>
      <DashboardWidgets data={assetModules} title={"Assets"} />
      <DashboardWidgets data={maintenanceModules} title={"Maintenance"} />
    </>
  );
}
