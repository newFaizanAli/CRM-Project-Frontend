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

export const dealStages = [
  { label: "Proposal", value: "proposal" },
  { label: "Negotiation", value: "negotiation" },
  { label: "Contract", value: "contract" },
  { label: "Closed", value: "closed" },
  { label: "Lost", value: "lost" },
];

export const leadSource = [
  { label: "website", value: "website" },
  { label: "referral", value: "negotiation" },
  { label: "social", value: "contract" },
  { label: "other", value: "closed" },
];

export const leadStatus = [
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Qualified", value: "qualified" },
  { label: "Lost", value: "lost" },
];

export const attendanceStatus = [
  { label: "Present", value: "Present" },
  { label: "Absent", value: "Absent" },
  { label: "Half Day", value: "Half Day" },
  { label: "On Leave", value: "On Leave" },
  { label: "Holiday", value: "Holiday" },
];

export const attendanceShift = [
  { label: "Day", value: "Day" },
  { label: "Night", value: "Night" },
  { label: "General", value: "General" },
];

export const leavesTypes = [
  { label: "Casual", value: "Casual" },
  { label: "Sick", value: "Sick" },
  { label: "Earned", value: "Earned" },
  { label: "Unpaid", value: "Unpaid" },
  { label: "Maternity", value: "Maternity" },
  { label: "Other", value: "Other" },
];

export const leavesStatus = [
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
  { label: "Cancelled", value: "Cancelled" },
];

export const salaryCompTypes = [
  { label: "Earning", value: "Earning" },
  { label: "Deduction", value: "Deduction" },
];

export const salaryCompAmountTypes = [
  { label: "Fixed", value: "Fixed" },
  { label: "Percentage", value: "Percentage" },
];

export const salaryCompEarningType = [
  { label: "HRA (House Rent)", value: "HRA" },
  { label: "Conveyance", value: "Conveyance" },
  { label: "Medical Allowance", value: "Medical Allowance" },
  { label: "Special Allowance", value: "Special Allowance" },
  { label: "Bonus", value: "Bonus" },
  { label: "Overtime", value: "Overtime" },
  { label: "Commission", value: "Commission" },
  { label: "Arrear", value: "Arrear" },
];

export const salaryCompDeductionType = [
  { label: "Provident Fund (PF)", value: "Provident Fund" },
  { label: "Professional Tax", value: "Professional Tax" },
  { label: "Income Tax", value: "Income Tax" },
  { label: "Loan Deduction", value: "Loan Deduction" },
  { label: "Absent Deduction", value: "Absent Deduction" },
  { label: "Advance Salary", value: "Advance Salary" },
];

export const salarySlipStatus = [
  { label: "Draft", value: "Draft" },
  { label: "Final", value: "Final" },
];

export const asstesDepreciationMethods = [
  { label: "Straight Line", value: "Straight Line" },
  { label: "Declining Balance", value: "Declining Balance" },
  { label: "None", value: "None" },
];

export const asstesStatus = [
  { label: "In Use", value: "In Use" },
  { label: "Idle", value: "Idle" },
  { label: "Scrapped", value: "Scrapped" },
  { label: "Under Maintenance", value: "Under Maintenance" },
  { label: "Other", value: "Other" },
];

export const MaintainanceRequestPriority = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

export const MaintainanceRequestStatus = [
  { label: "Open", value: "Open" },
  { label: "In Progress", value: "In Progress" },
  { label: "Resolved", value: "Resolved" },
  { label: "Closed", value: "Closed" },
];


export const MaintainanceLogTypes = [ 
  { label: "Corrective", value: "Corrective" },
  { label: "Preventive", value: "Preventive" },
];



