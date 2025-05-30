// -------------Categoyr------------

export interface Category {
  _id: number;
  name: string;
  description: string;
  parentCategory: string | { _id: string; name: string } | null;
  isActive: boolean;
}

// -------------Employees------------

export type EmployeeType =
  | "Permanent"
  | "Contract"
  | "Intern"
  | "Consultant"
  | "Part-Time"
  | "Temporary"
  | "Freelancer"
  | "Probation"
  | "Casual"
  | "Remote";

export interface Employee {
  _id?: number;
  name: string;
  // department: string;
  department: {
    _id: string;
    name: string;
  } | null;
  position: string;
  hireDate: string;
  email: string;
  ID?: string;
  types: EmployeeType;
  phone: string;
}

// Form data without _id and ID
export type EmployeeFormData = Omit<Employee, "_id" | "ID">;

// Form values when editing
export type EmployeeFormWithId = EmployeeFormData & { _id: number };

// -------------Product----------

export interface Product {
  _id?: string;
  name: string;
  itemCode: string;
  description: string;
  unit: string;
  brand: string;
  costPrice: number;
  sellingPrice: number;
  isStockItem: boolean;
  hasBatch: boolean;
  hasSerial: boolean;
  isActive: boolean;
  category?: string | { _id: string; name: string } | null;
}

// -------------Tasks------------

export type TaskStatus = "pending" | "in-progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface TaskInput {
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: { _id: string; name: string } | null;
  project: { _id: string; title: string; ID: string } | null;
}

export interface Task extends TaskInput {
  _id: number;
}

// ------- warehouse -------

export interface Warehouse {
  _id?: number;
  name: string;
  description: string;
  location: string;
  ID?: string;
  isActive: boolean;
}

// Form data without _id and ID
export type WarehouseFormData = Omit<Warehouse, "_id" | "ID">;

// Form values when editing
export type WahouseFormWithId = WarehouseFormData & { _id: number };

// -------------Stock entry-----------

export interface StockEntry {
  _id?: number;
  entryType: string;
  remarks: string;
  entryDate: string;
  quantity: number;
  rate: number;
  total: number;
  warehouse?: string | { _id: string; name: string } | null;
  product?: string | { _id: string; name: string } | null;
  ID?: string;
}

// Form data without _id and ID
export type StockEntryFormData = Omit<StockEntry, "_id" | "ID">;

// Form values when editing
export type StockEntryFormWithId = StockEntryFormData & { _id: number };

export interface StockLedger {
  _id?: number;
  entryType: string;
  balance: number;
  date: string;
  quantity: number;
  direction: string;
  entryRefId?: { _id: string; ID: string } | string | null;
  warehouse?: string | { _id: string; name: string } | null;
  product?: string | { _id: string; name: string } | null;
}

// -------------Supplier------------

export interface Supplier {
  _id?: string;
  ID?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  status: "Active" | "Inactive";
  remarks: string;
  supplierType: "Company" | "Individual";
  gstNumber: number;
}

// Form data without _id and ID
export type SupplierFormData = Omit<Supplier, "_id" | "ID">;

// Form values when editing
export type SupplierFormWithId = SupplierFormData & { _id: number };

// -----------Purchase Order--------------

export interface PurchaseOrderItem {
  product: string; // Product _id
  quantity: number;
  rate: number;
  amount: number;
}

export type PurchaseOrderStatus =
  | "Draft"
  | "To Receive"
  | "Completed"
  | "Cancelled";

export interface PurchaseOrder {
  _id?: string;
  ID?: string;
  supplier: {
    _id: string;
    name: string;
  };
  orderDate?: string;
  expectedDeliveryDate: string;
  status?: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  totalAmount: number;
  taxesAndCharges?: number;
  discount?: number;
  grandTotal: number;
  remarks?: string;
}

export type PurchaseOrderFormData = Omit<
  PurchaseOrder,
  "_id" | "createdAt" | "updatedAt"
>;

export type PurchaseOrderFormWithId = PurchaseOrderFormData & { _id: string };

// --------- Purchase Receipt-----------

export interface PurchaseReceiptItem {
  productName: string;
  product: string;
  receivedQty: number;
  rate: number;
  amount: number;
  maxQty: number;
}

export type PurchaseReceiptStatus =
  | "Draft"
  | "To Receive"
  | "Completed"
  | "Cancelled";

export interface PurchaseReceipt {
  _id?: string;
  ID?: string;
  purchaseOrder: {
    _id: string;
    ID: string;
  };
  supplier: {
    _id: string;
    name: string;
  };
  receiptDate?: string;
  warehouse: {
    _id: string;
    name: string;
    location: string;
  };
  status: PurchaseReceiptStatus;
  remarks: string;

  items: PurchaseReceiptItem[];
  totalAmount: number;
}

export type PurchaseReceiptFormData = Omit<
  PurchaseReceipt,
  "_id" | "createdAt" | "updatedAt"
>;

export type PurchaseRecieptFormWithId = PurchaseReceiptFormData & {
  _id: string;
};

// --------- Purchase Invoice-----------

export interface PurchaseInvoiceItem {
  productName: string;
  product: string;
  quantity: number;
  rate: number;
  amount: number;
  maxQty: number;
}

export type PurchaseInvoiceStatus =
  | "Unpaid"
  | "Partially Paid"
  | "Paid"
  | "Cancelled";

export interface PurchaseInvoice {
  _id?: string;
  ID?: string;
  purchaseReceipt: {
    _id: string;
    ID: string;
  };
  supplier: {
    _id: string;
    name: string;
  };
  invoiceDate?: string;
  dueDate?: string;
  status: PurchaseInvoiceStatus;
  remarks: string;
  stockEntered: boolean;
  items: PurchaseInvoiceItem[];
  totalAmount: number;
}

export type PurchaseInvoiceFormData = Omit<
  PurchaseInvoice,
  "_id" | "createdAt" | "updatedAt"
>;

export type PurchaseInvoiceFormWithId = PurchaseInvoiceFormData & {
  _id: string;
};

// --------- Purchase Return -----------

export interface PurchaseReturnItem {
  productName: string;
  product: string;
  quantity: number;
  rate: number;
  amount: number;
  maxQty: number;
}

export type PurchaseReturnStatus = "Draft" | "Submitted" | "Cancelled";

export interface PurchaseReturn {
  _id?: string;
  purchaseReceipt: {
    _id: string;
    ID: string;
  };
  supplier: {
    _id: string;
    name: string;
  };
  returnDate?: string;
  status: PurchaseReturnStatus;
  reason: string;
  items: PurchaseReturnItem[];
}

export type PurchaseReturnFormData = Omit<
  PurchaseReturn,
  "_id" | "createdAt" | "updatedAt"
>;

export type PurchaseReturnFormWithId = PurchaseReturnFormData & {
  _id: string;
};

// --------- Customer -----------

export type CustomerStatus = "active" | "inactive" | "lead";

export type CustomerType = "Regular" | "Walk-in" | "Wholesale" | "Retail";

export interface Customer {
  _id?: string;
  ID?: string;
  name?: string;
  email?: string;
  phone?: string;
  status: CustomerStatus;
  type: CustomerType;
  address: string;
  contactPerson: string;
  company: string;
  remarks: string;
  notes: string;
}

export type CustomerFormData = Omit<
  Customer,
  "_id" | "createdAt" | "updatedAt"
>;

export type CustomerFormWithId = CustomerFormData & {
  _id: string;
};

// -----------Sale Order--------------

export interface SaleOrderItem {
  product: string; // Product _id
  quantity: number;
  rate: number;
  amount: number;
}

export type SaleOrderStatus =
  | "Pending"
  | "Partially Delivered"
  | "Delivered"
  | "Cancelled";

export interface SaleOrder {
  _id?: string;
  ID?: string;
  customer: {
    _id: string;
    name: string;
  };
  dueDate?: string;
  deliveryDate: string;
  status?: SaleOrderStatus;
  items: SaleOrderItem[];
  totalAmount: number;
  taxesAndCharges?: number;
  discount?: number;
  grandTotal: number;
  remarks?: string;
}

export type SaleOrderFormData = Omit<
  SaleOrder,
  "_id" | "createdAt" | "updatedAt"
>;

export type SaleOrderFormWithId = SaleOrderFormData & { _id: string };

// --------- Sale Invoice-----------

export interface SaleInvoiceItem {
  productName: string;
  product: string;
  quantity: number;
  rate: number;
  amount: number;
  maxQty: number;
}

export type SaleInvoiceStatus =
  | "Unpaid"
  | "Partially Paid"
  | "Paid"
  | "Cancelled";

export interface SaleInvoice {
  _id?: string;
  ID?: string;
  saleOrder: {
    _id: string;
    ID: string;
  };
  customer: {
    _id: string;
    name: string;
  };
  warehouse: {
    _id: string;
    name: string;
    location: string;
  };
  invoiceDate?: string;
  dueDate?: string;
  status: SaleInvoiceStatus;
  remarks: string;
  stockEntered: boolean;
  items: SaleInvoiceItem[];
  totalAmount: number;
}

export type SaleInvoiceFormData = Omit<
  SaleInvoice,
  "_id" | "createdAt" | "updatedAt"
>;

export type SaleInvoiceFormWithId = SaleInvoiceFormData & {
  _id: string;
};

// --------- Sale Receipt-----------

export interface SaleReturnItem {
  productName: string;
  product: string;
  quantity: number;
  rate: number;
  amount: number;
  maxQty: number;
}

export type SaleReturnStatus = "Pending" | "Accepted" | "Rejetected";

export interface SaleReturn {
  _id?: string;
  saleInvoice: {
    _id: string;
    ID: string;
  };
  customer: {
    _id: string;
    name: string;
  };
  returnDate?: string;
  status: SaleReturnStatus;
  reason: string;
  items: SaleReturnItem[];
  stockEntered: boolean;
}

export type SaleReturnFormData = Omit<
  SaleReturn,
  "_id" | "createdAt" | "updatedAt"
>;

export type SaleReturnFormWithId = SaleReturnFormData & {
  _id: string;
};

// --------- Transaction -----------

export type TransactionType = "payment" | "receipt";
export type TransactionMethod = "cash" | "bank";
export type TransactionPartyType = "customers" | "suppliers";
export type TransactionReferenceModel = "purchase-invoice" | "sales-invoice";

export interface Transaction {
  _id?: string;
  ID?: string;
  type: TransactionType;
  method: TransactionMethod;
  amount: number;
  date?: string;
  partyType: TransactionPartyType;
  party: {
    _id: string;
    name: string;
  };
  referenceInvoice?: {
    _id: string;
    ID: string;
  };
  referenceModel?: TransactionReferenceModel;
  notes?: string;
}

export type TransactionFormData = Omit<
  Transaction,
  "_id" | "createdAt" | "updatedAt" | "party" | "createdBy" | "referenceInvoice"
> & {
  party: string;
  referenceInvoice?: string;
};

export type TransactionWithId = TransactionFormData & {
  _id: string;
};

// --------- Department -----------

export interface Department {
  _id?: string;
  ID?: string;
  name: string;
  parentDepartment?: {
    _id: string;
    name: string;
  } | null;
  manager?: {
    _id: string;
    name: string;
  } | null;
  isActive: boolean;
  description?: string;
}

export type DepartmentFormData = Omit<
  Department,
  "_id" | "parentDepartment" | "manager"
> & {
  parentDepartment?: string | null;
  manager?: string | null;
};

export type DepartmentWithId = DepartmentFormData & {
  _id: string;
};

// --------- Project ----------

export type ProjectStatus = "pending" | "in-progress" | "completed";
export type ProjectPriority = "low" | "medium" | "high";

export interface ProjectInput {
  ID?: string;
  _id?: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: {
    _id: string;
    name: string;
  } | null;
  department: {
    _id: string;
    name: string;
  } | null;
  type: string;
}

export interface Project extends ProjectInput {
  _id: string;
}

// --------- Company -----------

export interface Company {
  _id?: string;
  ID?: string;
  name: string;
  parentCompany?: {
    _id: string;
    name: string;
  } | null;
  isActive: boolean;
}

export type CompanyFormData = Omit<Company, "_id" | "parentCompany"> & {
  parentCompany?: string | null;
};

export type CompanyWithId = CompanyFormData & {
  _id: string;
};

// ---- Deals --------

export interface Deal {
  _id?: number;
  name: string;
  company?: {
    _id: string;
    name: string;
  } | null;
  value: number;
  stage: "proposal" | "negotiation" | "contract" | "closed" | "lost";
  probability: number;
  expectedCloseDate: string;
  owner: string;
}

export type DealFormData = Omit<Deal, "_id" | "company"> & {
  company?: string | null;
};

export type DealWithId = DealFormData & {
  _id: string;
};

// -------------Lead------------

export interface LeadInput {
  _id?: number;
  name: string;
  email: string;
  phone: string;
  company: {
    _id: string;
    name: string;
  } | null;
  status: "new" | "contacted" | "qualified" | "lost";
  source: "website" | "referral" | "social" | "other";
  value: number;
}

export type LeadFormData = Omit<LeadInput, "_id" | "company"> & {
  company?: string | null;
};

export type LeadWithId = LeadFormData & {
  _id: string;
};

// -----------Contact---------

export type PersonType = "customers" | "employees" | "suppliers";

export interface Contact {
  _id?: string;
  ID?: string;
  personType: PersonType;
  person: {
    _id: string;
    name: string;
    ID: string;
    phone: string;
    email: string;
  };
  company: {
    _id: string;
    name: string;
  } | null;
  status: "active" | "inactive";
}

export type ContactFormData = Omit<Contact, "_id" | "person" | "company"> & {
  person: string;
  company?: string | null;
};

export type ConactWithId = ContactFormData & {
  _id: string;
};

// --------- Attendance -----------

export type AttendanceStatus =
  | "Present"
  | "Absent"
  | "Half Day"
  | "On Leave"
  | "Holiday";

export type AttendanceShift = "Day" | "Night" | "General";

export interface Attendance {
  _id?: string;
  employee?: {
    _id: string;
    name: string;
    ID: string;
  } | null;
  date: string;
  status: AttendanceStatus;
  checkInTime: string;
  checkOutTime: string;
  shift: AttendanceShift;
  remarks: string;
}

export type AttendanceFormData = Omit<Attendance, "_id" | "employee"> & {
  employee?: string | null;
};

export type AttendanceWithId = AttendanceFormData & {
  _id: string;
};

// --------- Leave -----------

export type LeaveTypes =
  | "Casual"
  | "Sick"
  | "Earned"
  | "Unpaid"
  | "Maternity"
  | "Other";

export type LeaveStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";

export interface Leave {
  _id?: string;
  employee?: {
    _id: string;
    name: string;
    ID: string;
  } | null;
  leaveType: LeaveTypes;
  fromDate: string;
  toDate: string;
  reason: string;
  status: LeaveStatus;
  applicationDate: string;
}

export type LeaveFormData = Omit<Leave, "_id" | "employee"> & {
  employee?: string | null;
};

export type LeaveWithId = LeaveFormData & {
  _id: string;
};

// --------- Salary Component -----------

export type SalaryCompTypes = "Earning" | "Deduction";

export type SalaryCompAmountTypes = "Fixed" | "Percentage";

export interface SalaryComponent {
  ID?: string;
  _id?: string; 
  name: string; 
  type: SalaryCompTypes;
  amountType: SalaryCompAmountTypes; 
  value: number;
  isActive: boolean; 
  description: string; 
}


export type SalaryComponentFormData = Omit<SalaryComponent, "_id" | "ID">;

// Form values when editing
export type SalaryComponentFormWithId = SalaryComponentFormData & { _id: string };


// -----------Salary Structure--------------

export interface SalaryStructureComp {
  component: string; 
  type: string;
  value: number;
  ID: string;
}

export interface SalaryStructure {
  _id?: string;
  name: string;
  base: number;
  employee: {
    _id: string;
    name: string;
  };
  isActive: boolean; 
  effectiveFrom: string;
  remarks?: string;
  components: SalaryStructureComp[];
}


export type SalaryStructureFormData = Omit<SalaryStructure, "_id" | "employee"> & {
  employee?: string | null;
};

export type SalaryStructureFormWithId = SalaryStructureFormData & { _id: string };


