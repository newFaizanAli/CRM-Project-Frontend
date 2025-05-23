import { 
  TruckIcon, 
  ShoppingCartIcon, 
  ReceiptRefundIcon, 
  DocumentTextIcon, 
  ArrowUturnLeftIcon 
} from "@heroicons/react/24/outline";
import DashboardWidgets from "../components/custom/DashboardWidgets";

const purchaseModules = [
  {
    name: "Supplier",
    icon: <TruckIcon className="h-8 w-8" />,
    path: "/purchase/suppliers",
  },
  {
    name: "Orders",
    icon: <ShoppingCartIcon className="h-8 w-8" />,
    path: "/purchase/orders",
  },
  {
    name: "Receipts",
    icon: <ReceiptRefundIcon className="h-8 w-8" />,
    path: "/purchase/receipts",
  },
  {
    name: "Invoices",
    icon: <DocumentTextIcon className="h-8 w-8" />,
    path: "/purchase/invoices",
  },
  {
    name: "Return",
    icon: <ArrowUturnLeftIcon className="h-8 w-8" />, // ← fixed icon
    path: "/purchase/returns",
  },
];
export default function PurchaseDashboard() {
  return (
    <DashboardWidgets data={purchaseModules} />
  );
}
