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
import useCompaniesStore from "../store/companies";
import useSalaryComponentStore from "../store/payroll/salary-compoents";
import useSalaryStructureStore from "../store/payroll/salary-structure";
import useSalarySlipStore from "../store/payroll/salary-slip";

import useAttendanceStore from "../store/hr/attendances";
import useLeaveStore from "../store/hr/leaves";
import useAssetCategoryStore from "../store/asset/asset-category";
import useAssetLocationStore from "../store/asset/asset-locations";
import useAssetStore from "../store/asset/asset";
import useMaintenanceRequestStore from "../store/asset/maintainance/maintainance-request";
import useMaintenanceLogStore from "../store/asset/maintainance/maintainance-log";
import useMaintenanceTeamStore from "../store/asset/maintainance/maintainance-team";
import useWorkstationTypeStore from "../store/manufacturing/workstation-type";
import useWorkstationStore from "../store/manufacturing/workstations";
import useOperationStore from "../store/manufacturing/operations";

const useInitialData = () => {
  // crm
  const { fetchDeals } = useDealsStore();
  const { fetchLeads } = useLeadsStore();

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
  const { fetchContacts } = useContactsStore();
  const { fetchCompanies } = useCompaniesStore();
  const { fetchAttendances } = useAttendanceStore();
  const { fetchLeaves } = useLeaveStore();

  // projects

  const { fetchProjects } = useProjectsStore();
  const { fetchTasks } = useTasksStore();

  // payroll
  const { fetchSalaryComponents } = useSalaryComponentStore();
  const { fetchSalaryStructures } = useSalaryStructureStore();
  const { fetchSalarySlips } = useSalarySlipStore();

  // assets

  const { fetchAssetCategories } = useAssetCategoryStore();
  const { fetchAssetLocations } = useAssetLocationStore();
  const { fetchAssets } = useAssetStore();

  // maintanance
  const { fetchRequests } = useMaintenanceRequestStore();
  const { fetchTeams } = useMaintenanceTeamStore();
  const { fetchLogs } = useMaintenanceLogStore();


  // manufacturing

  const { fetchWorkstationTypes } = useWorkstationTypeStore();
  const { fetchWorkstations } = useWorkstationStore();
  const { fetchOperations } = useOperationStore();




  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([
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
        fetchCompanies(),
        fetchContacts(),
        fetchAttendances(),
        fetchLeaves(),

        fetchSalaryComponents(),
        fetchSalaryStructures(),
        fetchSalarySlips(),

        fetchAssetCategories(),
        fetchAssetLocations(),
        fetchAssets(),

        fetchRequests(),
        fetchTeams(),
        fetchLogs(),


        fetchWorkstationTypes(),
        fetchWorkstations(),
        fetchOperations()
      ]);
      setLoading(false);
    };

    fetchAll();
  }, []);

  return loading;
};

export default useInitialData;
