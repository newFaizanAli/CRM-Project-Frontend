
import {
  Squares2X2Icon,       
  CubeIcon,              
  BuildingStorefrontIcon,
  ArrowDownTrayIcon,    
  ClipboardDocumentListIcon 
} from "@heroicons/react/24/outline";
import DashboardWidgets from "../components/custom/DashboardWidgets";

const stockModules = [
  {
    name: "Category",
    icon: <Squares2X2Icon className="h-8 w-8" />,
    path: "/stock/categories",
  },
  {
    name: "Product",
    icon: <CubeIcon className="h-8 w-8" />,
    path: "/stock/products",
  },
  {
    name: "Warehouse",
    icon: <BuildingStorefrontIcon className="h-8 w-8" />,
    path: "/stock/warehouses",
  },
  {
    name: "Stock Entry",
    icon: <ArrowDownTrayIcon className="h-8 w-8" />,
    path: "/stock/stockentry",
  },
  {
    name: "Stock Ledger",
    icon: <ClipboardDocumentListIcon className="h-8 w-8" />,
    path: "/stock/stockledger",
  },
];


export default function StockDashboard() {
  return (
    <DashboardWidgets data={stockModules} title={'Stocks'} />
  );
}
