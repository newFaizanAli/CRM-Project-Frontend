// Project Url

// export const ProjectURL = `http://localhost:3000`;

// Vecel Url

export const ProjectURL = `https://crm-project-backend-mu.vercel.app`;

export const unitTypes = [
  { label: "Pieces", value: "pcs" },
  { label: "Kilograms", value: "kg" },
  { label: "Grams", value: "g" },
  { label: "Liters", value: "l" },
  { label: "Milliliters", value: "ml" },
  { label: "Box", value: "box" },
  { label: "Packet", value: "pkt" },
  { label: "Dozen", value: "dozen" },
  { label: "Meter", value: "m" },
  { label: "Centimeter", value: "cm" }, 
  { label: "Inch", value: "inch" },
  { label: "Foot", value: "ft" },
  { label: "Roll", value: "roll" }, 
  { label: "Bag", value: "bag" },
  { label: "Carton", value: "carton" },
  { label: "Can", value: "can" }, 
  { label: "Bottle", value: "bottle" },
  { label: "Tray", value: "tray" },
];

export const entryTypes = [
  { label: "Opening Stock", value: "Opening Stock" },
  { label: "Purchase", value: "Purchase" },
  { label: "Adjustment", value: "Adjustment" },
  { label: "Return", value: "Return" },
  { label: "Transfer", value: "Transfer" },
];

export const purchaseOrderStatus = [
  { label: "Draft", value: "Draft" },
  { label: "To Receive", value: "To Receive" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
];


export const receiptStatus = [
  { label: "Draft", value: "Draft" },
  { label: "Received", value: "Received" },
  { label: "Cancelled", value: "Cancelled" },
];


export const invoicesStatus = [
  { label: "Unpaid", value: "Unpaid" }, 
  { label: "Partially Paid", value: "Partially Paid" },
    { label: "Paid", value: "Paid" },
  { label: "Cancelled", value: "Cancelled" },
];


export const saleOrderStatus = [
  { label: "Pending", value: "Pending" },
  { label: "Partially Delivered", value: "Partially Delivered" },
  { label: "Delivered", value: "Delivered" },
  { label: "Cancelled", value: "Cancelled" },
];

export const saleReturnStatus = [
  { label: "Pending", value: "Pending" },
  { label: "Accepted", value: "Accepted" },
  { label: "Rejected", value: "Rejected" },
];

export const employeeTypes = [
  { label: "Permanent", value: "Permanent" },
  { label: "Contract", value: "Contract" },
  { label: "Intern", value: "Intern" },
  { label: "Consultant", value: "Consultant" },
  { label: "Part-Time", value: "Part-Time" },
  { label: "Temporary", value: "Temporary" },
  { label: "Freelancer", value: "Freelancer" },
  { label: "Probation", value: "Probation" },
  { label: "Casual", value: "Casual" },
  { label: "Remote", value: "Remote" },
];
