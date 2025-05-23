import {
  UserIcon,
  ShoppingCartIcon,
  DocumentTextIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";
import DashboardWidgets from "../components/custom/DashboardWidgets";

const saleModules = [
  {
    name: "Customers",
    icon: <UserIcon className="h-8 w-8" />,
    path: "/sale/customers",
  },
  {
    name: "Orders",
    icon: <ShoppingCartIcon className="h-8 w-8" />,
    path: "/sale/orders",
  },
  {
    name: "Invoices",
    icon: <DocumentTextIcon className="h-8 w-8" />,
    path: "/sale/invoices",
  },
  {
    name: "Returns",
    icon: <ArrowUturnLeftIcon className="h-8 w-8" />,
    path: "/sale/returns",
  },
];

export default function SaleDashboard() {
  return <DashboardWidgets data={saleModules} title={'Sales'} />;
}
