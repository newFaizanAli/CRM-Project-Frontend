import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";
import { Attendance } from "../../../utilities/types";
import useAttendanceStore from "../../../store/hr/attendances";
import AttendanceForm from "../../../components/form/hr/AttendanceForm";

const columnHelper = createColumnHelper<Attendance>();

const columns: ColumnDef<Attendance, any>[] = [
  columnHelper.accessor("date", {
    header: "Date",
    cell: (info) =>
      new Date(info.getValue()).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
  }),
  columnHelper.accessor((row) => row.employee, {
    id: "employeeInfo",
    header: "Employee",
    cell: (info) => {
      const emp = info.getValue();
      return emp ? `${emp.ID} - ${emp.name}` : "-";
    },
  }),
  columnHelper.accessor("shift", {
    header: "Shift",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => info.getValue(),
  }),
 
  columnHelper.accessor("checkInTime", {
    header: "Check In",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("checkOutTime", {
    header: "Check Out",
    cell: (info) => info.getValue(),
  }),
];

const AttendancePage = () => {
  const { attendances, fetchAttendances, deleteAttendance, isFetched } =
    useAttendanceStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<
    Attendance | undefined
  >();

  const [filterOptions, setFilterOption] = useState({
    employeeID: "",
    fromDate: "",
    toDate: "",
  });
  const [filteredData, setFilteredData] = useState<Attendance[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);


   const filterData = () => {
    const { employeeID, fromDate, toDate } = filterOptions;
    const isAnyFilterActive = employeeID || fromDate || toDate;

    if (!isAnyFilterActive) {
      setFilteredData([]);
      setIsFiltered(false);
      return;
    }

    const filtered = attendances.filter((item) => {
      const matchesID = employeeID
        ? item.employee?.ID.toLowerCase().includes(employeeID.toLowerCase())
        : true;

      const itemDate = new Date(item.date);
      const startDate = fromDate ? new Date(fromDate) : null;
      const endDate = toDate ? new Date(toDate) : null;

      // Normalize date for accurate comparison
      if (startDate) startDate.setHours(0, 0, 0, 0);
      if (endDate) endDate.setHours(23, 59, 59, 999);
      itemDate.setHours(12, 0, 0, 0); // avoid timezone issues

      const matchesFrom = startDate ? itemDate >= startDate : true;
      const matchesTo = endDate ? itemDate <= endDate : true;

      return matchesID && matchesFrom && matchesTo;
    });

    setFilteredData(filtered);
    setIsFiltered(true);
  };

  const clearFilters = () => {
    setFilterOption({
      employeeID: "",
      fromDate: "",
      toDate: "",
    });
    setFilteredData([]);
    setIsFiltered(false);
  };


  useEffect(() => {
    if (!isFetched) {
      fetchAttendances();
    }
  }, [fetchAttendances, isFetched]);

  const table = useReactTable({
     data: isFiltered ? filteredData : attendances,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleEdit = (dep: Attendance) => {
    setSelectedAttendance(dep);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this attendance?")) {
      deleteAttendance(id);
    }
  };

  const handleAdd = () => {
    setSelectedAttendance(undefined);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedAttendance(undefined);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendances</h1>
        <button onClick={handleAdd} className="btn btn-primary">
          Add Attendance
        </button>
      </div>


       <div className="flex gap-4 mb-4 flex-wrap items-center">
        <input
          type="text"
          name="employeeID"
          placeholder="Search by Employee ID"
          value={filterOptions.employeeID}
          onChange={(e) =>
            setFilterOption({ ...filterOptions, [e.target.name]: e.target.value })
          }
          className="border px-3 py-2 rounded-md w-64"
        />

        <div className="flex items-center gap-2">
          <span>From:</span>
          <input
            type="date"
            name="fromDate"
            value={filterOptions.fromDate}
            onChange={(e) =>
              setFilterOption({ ...filterOptions, [e.target.name]: e.target.value })
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
              setFilterOption({ ...filterOptions, [e.target.name]: e.target.value })
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
            Clear
          </button>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-h-screen overflow-y-auto w-full max-w-3xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedAttendance ? "Edit Attendance" : "Add Attendance"}
            </h2>
            <AttendanceForm
              attendance={selectedAttendance}
              onClose={handleClose}
            />
          </div>
        </div>
      )}

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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
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
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(row.original)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(row.original._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendancePage;
