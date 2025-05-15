// src/pages/Stock/index.tsx

import { Link } from "react-router-dom";
import {
  Boxes,
  Warehouse,
  PackageCheck,
  FilePlus2,
  BarChart3,
} from "lucide-react";

const stockModules = [
  {
    name: "Category",
    icon: <Boxes size={32} />,
    path: "/stock/categories",
  },
  {
    name: "Product",
    icon: <PackageCheck size={32} />,
    path: "/stock/products",
  },
  {
    name: "Warehouse",
    icon: <Warehouse size={32} />,
    path: "/stock/warehouses",
  },
  {
    name: "Stock Entry",
    icon: <FilePlus2 size={32} />,
    path: "/stock/stockentry",
  },
  {
    name: "Stock Ledger",
    icon: <BarChart3 size={32} />,
    path: "/stock/stockledger",
  },
];

export default function StockDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Stock</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {stockModules.map((module) => (
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
