import {
  BanknotesIcon,      
  CreditCardIcon,     
  ReceiptRefundIcon,  
} from "@heroicons/react/24/outline";
import DashboardWidgets from "../components/custom/DashboardWidgets";

const accountModules = [
  {
    name: "Transaction",
    icon: <BanknotesIcon className="h-8 w-8" />,
    path: "/account/transactions",
  },
  {
    name: "Payment",
    icon: <CreditCardIcon className="h-8 w-8" />,
    path: "/purchase/payments",
  },
  {
    name: "Receipts",
    icon: <ReceiptRefundIcon className="h-8 w-8" />,
    path: "/purchase/receipts",
  },
];

export default function AccountDashboard() {
  return (
    <DashboardWidgets data={accountModules} />
  );
}
