export interface Category {
  _id: number;
  name: string;
  description: string;
  parentCategory: string | { _id: string; name: string } | null;
  isActive: boolean;
}

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
}

// Form data without _id and ID
export type StockEntryFormData = Omit<StockEntry, "_id" | "ID">;

// Form values when editing
export type StockEntryFormWithId = StockEntryFormData & { _id: number };


