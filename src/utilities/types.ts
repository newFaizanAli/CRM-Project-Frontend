// -------------Categoyr------------

export interface Category {
  _id: number;
  name: string;
  description: string;
  parentCategory: string | { _id: string; name: string } | null;
  isActive: boolean;
}

// -------------Employees------------

export interface Employee {
  _id?: number;
  name: string;
  department: string;
  position: string;
  hireDate: string;
  email: string;
  ID?: string;
}

// Form data without _id and ID
export type EmployeeFormData = Omit<Employee, "_id" | "ID">;

// Form values when editing
export type EmployeeFormWithId = EmployeeFormData & { _id: number };

// -------------Lead------------

export interface LeadInput {
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "new" | "contacted" | "qualified" | "lost";
  source: "website" | "referral" | "social" | "other";
  value: number;
}

export interface Lead extends LeadInput {
  _id: number;
}

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
  assignedTo: string;
}

export interface Task extends TaskInput {
  _id: number;
}

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
