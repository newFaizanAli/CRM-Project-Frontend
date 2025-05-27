import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ToastProvider from "./components/ToastProvider";

import ProtectedRoute from "./components/ProtectedRoute";

import Layout from "./components/Layout/Layout";
import PurchaseLayout from "./components/Layout/PurchaseLayout";
import StockLayout from "./components/Layout/StockLayout";
import SaleLayout from "./components/Layout/SaleLayout";
import AccountLayout from "./components/Layout/AccountLayout";
import HRLayout from "./components/Layout/HRLayout";
import ProjectLayout from "./components/Layout/ProjectLayout";
import CRMLayout from "./components/Layout/CRMLayout";

import PurchaseDashboard from "./pages/PurchaseDashboard";
import StockDashboard from "./pages/StockDashboard";
import SaleDashboard from "./pages/SaleDashboard";
import HRDashboard from "./pages/HRDashboard";
import ProjectDashboard from "./pages/ProjectDashboard";
import CRMDashboard from "./pages/CRMDashboard";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
// CRM
import Leads from "./pages/Leads";
import Deals from "./pages/Deals";
import Calendar from "./pages/Calendar";
import Reports from "./pages/Reports";
import Projects from "./pages/Projects";
import Settings from "./pages/Settings";
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
import SaleInvoicePage from "./pages/sales/SaleInvoice";
import SaleReturnPage from "./pages/sales/SaleReturn";
// Transaction
import TransactionPage from "./pages/account/Transactions";
import PaymentVoucher from "./pages/account/PaymentVoucher";
import ReceiptVoucher from "./pages/account/ReceiptVoucher";
import AccountDashboard from "./pages/AccountDashboard";
import AccountLedger from "./pages/account/AccountLedger";
// HR
import DepartmentPage from "./pages/Departments";
import Employees from "./pages/Employees";
// Project
import Tasks from "./pages/Tasks";
import ProjectPage from "./pages/Project";
import CompanyPage from "./pages/Companies";

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


              <Route path="/crm" element={<CRMLayout />}>
                <Route index element={<CRMDashboard />} />
                <Route path="leads" element={<Leads />} />
                <Route path="deals" element={<Deals />} />
              </Route>

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
                <Route path="invoices" element={<SaleInvoicePage />} />
                <Route path="returns" element={<SaleReturnPage />} />
              </Route>

              <Route path="/account" element={<AccountLayout />}>
                <Route index element={<AccountDashboard />} />
                <Route path="transactions" element={<TransactionPage />} />
                <Route path="payments" element={<PaymentVoucher />} />
                <Route path="receipts" element={<ReceiptVoucher />} />
                <Route path="ledgers" element={<AccountLedger />} />
              </Route>

              <Route path="/hr" element={<HRLayout />}>
                <Route index element={<HRDashboard />} />
                <Route path="employees" element={<Employees />} />
                <Route path="departments" element={<DepartmentPage />} />
                <Route path="companies" element={<CompanyPage />} />
                <Route path="contacts" element={<Contacts />} />
              </Route>

              <Route path="/project" element={<ProjectLayout />}>
                <Route index element={<ProjectDashboard />} />
                <Route path="projects" element={<ProjectPage />} />
                <Route path="tasks" element={<Tasks />} />
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
