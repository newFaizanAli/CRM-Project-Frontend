import {
  BanknotesIcon,      
  CreditCardIcon,     
  ReceiptRefundIcon,  
  BookOpenIcon 
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
    path: "/account/payments",
  },
  {
    name: "Receipts",
    icon: <ReceiptRefundIcon className="h-8 w-8" />,
    path: "/account/receipts",
  },
  {
    name: "Ledgers",
    icon: <BookOpenIcon  className="h-8 w-8" />,
    path: "/account/ledgers",
  },
];

export default function AccountDashboard() {
  return (
    <DashboardWidgets data={accountModules} title={'Accounts'} />
  );
}
