import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";
import { Project } from "../utilities/types";
import useProjectsStore from "../store/projects";
import ProjectForm from "../components/ProjectForm";

const columnHelper = createColumnHelper<Project>();

const columns: ColumnDef<Project, any>[] = [
  columnHelper.accessor("ID", {
    header: "ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("title", {
    header: "Title",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.department, {
    id: "department",
    header: " Department",
    cell: (info) => info.getValue()?.name ?? "-",
  }),
  columnHelper.accessor((row) => row.assignedTo, {
    id: "assignedTo",
    header: "Assigned To",
    cell: (info) => info.getValue()?.name ?? "-",
  }),
  columnHelper.accessor("dueDate", {
    header: "Due Date",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const status = info.getValue();
      const color = {
        pending: "bg-yellow-100 text-yellow-800",
        "in-progress": "bg-blue-100 text-blue-800",
        completed: "bg-green-100 text-green-800",
      }[status];
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
          {status}
        </span>
      );
    },
  }),
  columnHelper.accessor("priority", {
    header: "Priority",
    cell: (info) => {
      const priority = info.getValue();
      const color = {
        low: "bg-gray-100 text-gray-800",
        medium: "bg-orange-100 text-orange-800",
        high: "bg-red-100 text-red-800",
      }[priority];
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
          {priority}
        </span>
      );
    },
  }),
];

const ProjectPage = () => {
  const { projects, fetchProjects, deleteProject, isFetched } =
    useProjectsStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();

  useEffect(() => {
    if (!isFetched) {
      fetchProjects();
    }
  }, [fetchProjects, isFetched]);

  const table = useReactTable({
    data: projects,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleEdit = (proj: Project) => {
    setSelectedProject(proj);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(id);
    }
  };

  const handleAdd = () => {
    setSelectedProject(undefined);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedProject(undefined);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <button onClick={handleAdd} className="btn btn-primary">
          Add Project
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-h-screen overflow-y-auto w-full max-w-3xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedProject ? "Edit Project" : "Add Project"}
            </h2>
            <ProjectForm project={selectedProject} onClose={handleClose} />
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

export default ProjectPage;
