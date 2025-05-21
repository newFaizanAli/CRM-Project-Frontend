import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ToastProvider from "./components/ToastProvider";

import Layout from "./components/Layout/Layout";
import PurchaseLayout from "./components/Layout/PurchaseLayout";
import StockLayout from "./components/Layout/StockLayout";
import SaleLayout from "./components/Layout/SaleLayout";

import PurchaseDashboard from "./pages/dashboard/PurchaseDashboard";
import StockDashboard from "./pages/dashboard/StockDashboard";
import SaleDashboard from "./pages/dashboard/SaleDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Leads from "./pages/Leads";
import Deals from "./pages/Deals";
import Tasks from "./pages/Tasks";
import Calendar from "./pages/Calendar";
import Reports from "./pages/Reports";
import Projects from "./pages/Projects";
import Settings from "./pages/Settings";
import Employees from "./pages/Employees";
import Activities from "./pages/Activities";
import Profile from "./pages/Profile";
// Stock
import Category from "./pages/stocks/Category";
import Product from "./pages/stocks/Products";
import Warehouses from "./pages/stocks/Warehouses";
import StockEntryPage from "./pages/stocks/StockEntry";
import StockLedger from "./pages/stocks/StockLedger";
// Purchase
import Suppliers from "./pages/purchases/Supplier";
import PurchaseOrders from "./pages/purchases/PurchaseOrder";
import PurchaseReceipts from "./pages/purchases/PurchaseReceipt";
import PurchaseInvoices from "./pages/purchases/PurchaseInvoice";
import PurchaseReturns from "./pages/purchases/PurchaseReturns";
// Sale
import Customers from "./pages/sales/Customers";
import SaleOrderPage from "./pages/sales/SaleOrder";
import SaleInvoice from "./pages/sales/SaleInvoice";
import SaleReturn from "./pages/sales/SaleReturn";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {/* Toast Provider */}
        <ToastProvider />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/employees" element={<Employees />} />

              <Route path="/stock" element={<StockLayout />}>
                <Route index element={<StockDashboard />} />
                <Route path="categories" element={<Category />} />
                <Route path="products" element={<Product />} />
                <Route path="warehouses" element={<Warehouses />} />
                <Route path="stockentry" element={<StockEntryPage />} />
                <Route path="stockledger" element={<StockLedger />} />
              </Route>

              <Route path="/purchase" element={<PurchaseLayout />}>
                <Route index element={<PurchaseDashboard />} />
                <Route path="suppliers" element={<Suppliers />} />
                <Route path="orders" element={<PurchaseOrders />} />
                <Route path="receipts" element={<PurchaseReceipts />} />
                <Route path="invoices" element={<PurchaseInvoices />} />
                <Route path="returns" element={<PurchaseReturns />} />
              </Route>

              <Route path="/sale" element={<SaleLayout />}>
                <Route index element={<SaleDashboard />} />
                <Route path="customers" element={<Customers />} />
                <Route path="orders" element={<SaleOrderPage />} />
                <Route path="invoices" element={<SaleInvoice />} />
                <Route path="returns" element={<SaleReturn />} />
              </Route>

              <Route path="/calendar" element={<Calendar />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/activities"
                element={<Activities isDashboard={false} />}
              />
            </Route>
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
