import { useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";
import { Transaction } from "../../utilities/types";
import useTransactionStore from "../../store/transactions";

const columnHelper = createColumnHelper<Transaction>();

const columns: ColumnDef<Transaction, any>[] = [
  columnHelper.accessor("ID", {
    header: "Transaction ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.type, {
    id: "type",
    header: "Type",
    cell: (info) => info.getValue().toUpperCase(),
  }),
  columnHelper.accessor((row) => row.party?.name || "-", {
    id: "party",
    header: "Party",
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor("amount", {
    header: "Amount",
    cell: (info) => `Rs. ${info.getValue()}`,
  }),
  columnHelper.accessor("date", {
    header: "Date",
    cell: (info) =>
      new Date(info.getValue()).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }), 
  }),
];

const ReceiptVoucher = () => {
  const { transactions, fetchTransactions, isFetched } =
    useTransactionStore();


  useEffect(() => {
    if (!isFetched) {
      fetchTransactions();
    }
  }, [fetchTransactions, isFetched]);

  const table = useReactTable({
    data: transactions.filter((e) => e.type === "receipt"),
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

 

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Receipt Vouchers</h1>
      </div>

      

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
               
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReceiptVoucher;
