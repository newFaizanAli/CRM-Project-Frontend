import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";
import useEmployeesStore from "../store/employee";
import EmployeeForm from "../components/EmployeeForm";
import { Employee, EmployeeFormWithId } from "../utilities/types";

const columnHelper = createColumnHelper<Employee>();

const columns: ColumnDef<Employee, any>[] = [
  columnHelper.accessor("ID", {
    header: "Employee ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.department, {
    id: "department",
    header: "Department",
    cell: (info) => info.getValue()?.name ?? "-",
  }),
  columnHelper.accessor("position", {
    header: "Position",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("types", {
    header: "Type",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("hireDate", {
    header: "Hire Date",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
];

const Employees = () => {
  const { employees, deleteEmployee, fetchEmployees, isFetched } =
    useEmployeesStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setEmployeeTask] = useState<
    EmployeeFormWithId | undefined
  >();

  useEffect(() => {
    if (!isFetched) {
      fetchEmployees();
    }
  }, [fetchEmployees, isFetched]);

  const table = useReactTable({
    data: employees,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteEmployee(id);
    }
  };

  const handleEdit = (employee: Employee) => {
    const formData: EmployeeFormWithId = {
      _id: employee._id,
      name: employee.name,
      department: employee.department,
      position: employee.position,
      hireDate: employee.hireDate,
      email: employee.email,
      types: employee.types,
      phone: employee.phone,
    };
    setEmployeeTask(formData);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEmployeeTask(undefined);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEmployeeTask(undefined);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
        <button onClick={handleAdd} className="btn btn-primary">
          Add Employee
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-h-screen overflow-y-auto w-full max-w-3xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedEmployee ? "Edit Employee" : "Add Employee"}
            </h2>
            <EmployeeForm employee={selectedEmployee} onClose={handleClose} />
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

export default Employees;
