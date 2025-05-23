import { useEffect, useState } from "react";
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

const AccountLedger = () => {
  const { transactions, fetchTransactions, isFetched } = useTransactionStore();
  const [filterOptions, setFilterOption] = useState({
    partyFilter: "",
    typeFilter: "",
    fromDate: "",
    toDate: "",
  });
  const [filteredData, setFilteredData] = useState<Transaction[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    if (!isFetched) {
      fetchTransactions();
    }
  }, [fetchTransactions, isFetched]);

  const filterData = () => {
    // Check if any filter is active
    const isAnyFilterActive =
      filterOptions.partyFilter.trim() ||
      filterOptions.typeFilter ||
      filterOptions.fromDate ||
      filterOptions.toDate;

    if (!isAnyFilterActive) {
      setFilteredData([]);
      setIsFiltered(false);
      return;
    }

    const filtered = transactions.filter((txn) => {
      // Party filter
      const partyName = txn.party?.name || "";
      const matchesParty = filterOptions.partyFilter
        ? partyName.toLowerCase().includes(filterOptions.partyFilter.toLowerCase())
        : true;

      // Type filter
      const matchesType = filterOptions.typeFilter
        ? txn.type === filterOptions.typeFilter
        : true;

      // Date filter - improved comparison
      const transactionDate = new Date(txn.date);
      const fromDate = filterOptions.fromDate ? new Date(filterOptions.fromDate) : null;
      const toDate = filterOptions.toDate ? new Date(filterOptions.toDate) : null;

      // Set time to midnight for proper date comparison
      if (fromDate) fromDate.setHours(0, 0, 0, 0);
      if (toDate) toDate.setHours(23, 59, 59, 999);
      transactionDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues

      const matchesFromDate = fromDate ? transactionDate >= fromDate : true;
      const matchesToDate = toDate ? transactionDate <= toDate : true;

      return matchesParty && matchesType && matchesFromDate && matchesToDate;
    });

    setFilteredData(filtered);
    setIsFiltered(true);
  };

  const clearFilters = () => {
    setFilterOption({
      partyFilter: "",
      typeFilter: "",
      fromDate: "",
      toDate: "",
    });
    setFilteredData([]);
    setIsFiltered(false);
  };

  const table = useReactTable({
    data: isFiltered ? filteredData : transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Ledger</h1>
      </div>

      <div className="flex gap-4 mb-4 flex-wrap items-center">
        <input
          type="text"
          name="partyFilter"
          placeholder="Search Party"
          value={filterOptions.partyFilter}
          onChange={(e) =>
            setFilterOption({
              ...filterOptions,
              [e.target.name]: e.target.value,
            })
          }
          className="border px-3 py-2 rounded-md w-64"
        />
        <select
          name="typeFilter"
          value={filterOptions.typeFilter}
          onChange={(e) =>
            setFilterOption({
              ...filterOptions,
              [e.target.name]: e.target.value,
            })
          }
          className="border px-3 py-2 rounded-md"
        >
          <option value="">All Types</option>
          <option value="payment">Payment</option>
          <option value="receipt">Receipt</option>
        </select>
        <div className="flex items-center gap-2">
          <span>From:</span>
          <input
            type="date"
            name="fromDate"
            value={filterOptions.fromDate}
            onChange={(e) =>
              setFilterOption({
                ...filterOptions,
                [e.target.name]: e.target.value,
              })
            }
            className="border px-3 py-2 rounded-md"
          />
        </div>
        <div className="flex items-center gap-2">
          <span>To:</span>
          <input
            type="date"
            name="toDate"
            value={filterOptions.toDate}
            onChange={(e) =>
              setFilterOption({
                ...filterOptions,
                [e.target.name]: e.target.value,
              })
            }
            className="border px-3 py-2 rounded-md"
          />
        </div>
        <button
          onClick={filterData}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Search
        </button>
        {isFiltered && (
          <button
            onClick={clearFilters}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Clear Filters
          </button>
        )}
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
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center">
                  {isFiltered
                    ? "No matching transactions found"
                    : "No transactions available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountLedger;