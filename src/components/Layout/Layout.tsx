import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  ShoppingCartIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  PuzzlePieceIcon
} from "@heroicons/react/24/outline";
import Header from "../Header";
import useInitialData from "../../hooks/useInitialData";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const loading = useInitialData();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: HomeIcon },
    { path: "/crm", label: "CRM", icon: PuzzlePieceIcon },
    { path: "/account", label: "Accounts", icon: BuildingLibraryIcon },
    { path: "/purchase", label: "Purchases", icon: ShoppingCartIcon },
    { path: "/sale", label: "Sales", icon: BanknotesIcon },
    { path: "/stock", label: "Stocks", icon: CubeIcon },
    { path: "/hr", label: "HR", icon: UserIcon },
    { path: "/project", label: "Project", icon: ClipboardDocumentListIcon },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 via-primary-400 to-primary-600 bg-clip-text text-transparent animate-pulse">
          ERP
        </h1>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-y-auto`}
      >
        <div className="flex h-16 items-center justify-between px-4 sticky top-0 bg-white z-10">
          <h1 className="text-2xl font-bold text-primary-600">ERP</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="mt-4 flex-1 px-2 pb-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Header */}

        <Header setSidebarOpen={setSidebarOpen} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
