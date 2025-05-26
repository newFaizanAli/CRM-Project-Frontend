// hooks/useInitialData.ts
import { useEffect, useState } from "react";
import useContactsStore from "../store/contacts";
import useDealsStore from "../store/deal";
import useEmployeesStore from "../store/employee";
import useLeadsStore from "../store/leads";
import useTasksStore from "../store/tasks";
import useCategoriesStore from "../store/categories";
import useProductsStore from "../store/products";
import useWarehouseStore from "../store/warehouse";
import useStockEntryStore from "../store/stock_entry";
import useStockLedgerStore from "../store/store_ledger";
import useSupplierStore from "../store/suppliers";
import usePurchaseOrderStore from "../store/purchase-orders";
import usePurchaseReceiptStore from "../store/purchase-receipts";
import usePurchaseInvoiceStore from "../store/purchase-invoices";
import usePurchaseReturnStore from "../store/purchase-returns";
import useCustomerStore from "../store/customers";
import useSaleOrderStore from "../store/sale-orders";
import useSaleInvoiceStore from "../store/sale-invoice";
import useSalesReturnStore from "../store/sale-return";
import useTransactionStore from "../store/transactions";
import useDepartmentsStore from "../store/departments";
import useProjectsStore from "../store/projects";

const useInitialData = () => {
  const { fetchDeals } = useDealsStore();
  const { fetchLeads } = useLeadsStore();
  const { fetchContacts } = useContactsStore();
  const { fetchTasks } = useTasksStore();

  // Stock

  const { fetchCategories } = useCategoriesStore();
  const { fetchProducts } = useProductsStore();
  const { fetchWarehouses } = useWarehouseStore();
  const { fetchStockEntries } = useStockEntryStore();
  const { fetchStockLedgers } = useStockLedgerStore();

  // Purchase

  const { fetchSuppliers } = useSupplierStore();
  const { fetchPurchaseOrders } = usePurchaseOrderStore();
  const { fetchPurchaseReceipts } = usePurchaseReceiptStore();
  const { fetchPurchaseInvoices } = usePurchaseInvoiceStore();
  const { fetchPurchaseReturns } = usePurchaseReturnStore();

  // Sale

  const { fetchCustomers } = useCustomerStore();
  const { fetchSaleOrders } = useSaleOrderStore();
  const { fetchSaleInvoices } = useSaleInvoiceStore();
  const { fetchSalesReturns } = useSalesReturnStore();
  const { fetchTransactions } = useTransactionStore();

  // hr

   const { fetchEmployees } = useEmployeesStore();
   const { fetchDepartments } = useDepartmentsStore();

   const { fetchProjects } = useProjectsStore();


  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([
        fetchContacts(),
        fetchDeals(),
        fetchLeads(),
    
        fetchTasks(),
        fetchProjects(),

        fetchCategories(),
        fetchWarehouses(),
        fetchProducts(),
        fetchStockEntries(),
        fetchStockLedgers(),

        fetchSuppliers(),
        fetchPurchaseOrders(),
        fetchPurchaseReceipts(),
        fetchPurchaseInvoices(),
        fetchPurchaseReturns(),

        
        fetchCustomers(),
        fetchSaleOrders(),
        fetchSaleInvoices(),
        fetchSalesReturns(),

        fetchTransactions(),

        fetchEmployees(),
        fetchDepartments(),
      ]);
      setLoading(false);
    };

    fetchAll();
  }, []);

  return loading;
};

export default useInitialData;
