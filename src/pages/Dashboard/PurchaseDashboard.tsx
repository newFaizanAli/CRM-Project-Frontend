
import { Link } from "react-router-dom";
import {
 
    ClipboardList,
  FileText,
  Handshake,
  Inbox,
} from "lucide-react";

const purchaseModules = [
  {
    name: "Supplier",
    icon: <Handshake size={32} />,
    path: "/purchase/suppliers",
  },
  {
    name: "Orders",
    icon: <ClipboardList size={32} />,
    path: "/purchase/orders",
  },
  {
    name: "Receipts",
    icon: <Inbox size={32} />,
    path: "/purchase/receipts",
  },
  {
    name: "Invoices",
    icon: <FileText size={32} />,
    path: "/purchase/invoices",
  },
];
export default function PurchaseDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Purchase</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {purchaseModules.map((module) => (
          <Link
            key={module.name}
            to={module.path}
            className="bg-white rounded-2xl shadow hover:shadow-md transition p-6 flex items-center space-x-4 border hover:border-primary-500"
          >
            <div className="text-primary-600">{module.icon}</div>
            <div>
              <h2 className="text-lg font-semibold">{module.name}</h2>
              <p className="text-sm text-gray-500">Manage {module.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
