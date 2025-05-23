import { useForm } from "react-hook-form";
import useTransactionStore from "../store/transactions";
import useCustomerStore from "../store/customers";
import useSupplierStore from "../store/suppliers";
import useSaleInvoiceStore from "../store/sale-invoice";
import usePurchaseInvoiceStore from "../store/purchase-invoices";
import { Transaction, TransactionFormData } from "../utilities/types";
import { useState } from "react";

interface TransactionFormProps {
  transaction?: any;
  onClose: () => void;
}

const TransactionForm = ({ transaction, onClose }: TransactionFormProps) => {
  const { addTransaction, updateTransaction } = useTransactionStore();
  const { customers } = useCustomerStore();
  const { suppliers } = useSupplierStore();
  const { saleInvoices } = useSaleInvoiceStore();
  const { purchaseInvoices } = usePurchaseInvoiceStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>({
    defaultValues: transaction
      ? {
          party: transaction.party?._id || "",
          type: transaction.type || "payment",
          method: transaction.method || "cash",
          amount: transaction.amount || 0,
          date:
            transaction.date?.slice(0, 10) ||
            new Date().toISOString().slice(0, 10),
          referenceInvoice: transaction.referenceInvoice?._id || "",
          referenceModel: transaction.referenceModel || undefined,
          notes: transaction.notes || "",
          partyType: transaction.partyType || (transaction.type === "receipt" ? "customers" : "suppliers"),
        }
      : {
          party: "",
          type: "payment",
          method: "cash",
          amount: 0,
          date: new Date().toISOString().slice(0, 10),
          referenceInvoice: "",
          referenceModel: undefined,
          notes: "",
          partyType: "suppliers",
        },
  });

  // Controlled states
  const [type, setType] = useState<TransactionFormData["type"]>(
    transaction?.type || "payment"
  );
  const [partyType, setPartyType] = useState<TransactionFormData["partyType"]>(
    transaction?.partyType || (transaction?.type === "receipt" ? "customers" : "suppliers")
  );

  // Dynamic options
  const partyOptions = partyType === "customers" ? customers : suppliers;
  const invoiceOptions = partyType === "customers" ? saleInvoices : purchaseInvoices;

  const onSubmit = (data: TransactionFormData) => {
    const { party, referenceInvoice, ...rest } = data;

    const fullParty = partyOptions.find((p) => p._id === party);
    const fullInvoice = referenceInvoice
      ? invoiceOptions.find((inv) => inv._id === referenceInvoice)
      : undefined;

    if (!fullParty) {
      alert("Invalid party selected.");
      return;
    }

    const transformedData: Omit<Transaction, "_id"> = {
      ...rest,
      amount: Number(data.amount),
      party: {
        _id: fullParty._id,
        name: fullParty.name,
      },
      referenceInvoice: fullInvoice
        ? {
            _id: fullInvoice._id,
            ID: fullInvoice.ID,
          }
        : undefined,
      referenceModel: fullInvoice
        ? partyType === "customers"
          ? "sales-invoice"
          : "purchase-invoice"
        : undefined,
    };

    if (transaction) {
      updateTransaction(transaction._id, transformedData);
    } else {
      addTransaction(transformedData);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Type */}
        <div>
          <label>Transaction Type</label>
          <select
            {...register("type")}
            className="input w-full"
            value={type}
            onChange={(e) => {
              const value = e.target.value as "receipt" | "payment";
              setType(value);
              setValue("type", value);
              setValue("party", ""); // reset selected party
              setValue("referenceInvoice", ""); // reset invoice
              const newPartyType = value === "receipt" ? "customers" : "suppliers";
              setPartyType(newPartyType);
              setValue("partyType", newPartyType);
            }}
          >
            <option value="receipt">Receipt</option>
            <option value="payment">Payment</option>
          </select>
        </div>

        {/* Method */}
        <div>
          <label>Transaction Method</label>
          <select {...register("method")} className="input w-full">
            <option value="cash">Cash</option>
            <option value="bank">Bank</option>
          </select>
        </div>

        {/* Party */}
        <div>
          <label>{type === "receipt" ? "Customer" : "Supplier"}</label>
          <select
            {...register("party", { required: "Party is required" })}
            className="input w-full"
          >
            <option value="">-- Select --</option>
            {partyOptions.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
          {errors.party && (
            <p className="text-red-500">{errors.party.message}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label>Date</label>
          <input
            type="date"
            {...register("date", { required: "Date is required" })}
            className="input w-full"
          />
          {errors.date && <p className="text-red-500">{errors.date.message}</p>}
        </div>

        {/* Reference Invoice */}
        <div>
          <label>Reference Invoice (Optional)</label>
          <select {...register("referenceInvoice")} className="input w-full">
            <option value="">-- None --</option>
            {invoiceOptions.map((invoice) => (
              <option key={invoice._id} value={invoice._id}>
                {invoice.ID}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label>Amount</label>
          <input
            type="number"
            step="0.01"
            {...register("amount", {
              required: "Amount is required",
              valueAsNumber: true,
            })}
            className="input w-full"
          />
          {errors.amount && (
            <p className="text-red-500">{errors.amount.message}</p>
          )}
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label>Notes</label>
          <textarea {...register("notes")} className="input w-full" rows={3} />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {transaction ? "Update" : "Create"} Transaction
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;