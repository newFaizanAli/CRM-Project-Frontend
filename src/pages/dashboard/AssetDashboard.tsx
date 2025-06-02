import {
  BanknotesIcon,
  RectangleGroupIcon,
  MapPinIcon,
  DocumentDuplicateIcon
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
  {
    name: "Salary Slip",
    icon: <DocumentDuplicateIcon className="h-8 w-8" />,
    path: "/asset/movement",
  },
];

export default function AssetDashboard() {
  return (
    <DashboardWidgets data={assetModules} title={'Assets'} />
  );
}
