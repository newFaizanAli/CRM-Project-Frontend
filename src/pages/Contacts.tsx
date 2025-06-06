import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";
import { Contact } from "../utilities/types";
import useContactsStore from "../store/contacts";
import ContactForm from "../components/ContactForm";

const columnHelper = createColumnHelper<Contact>();

const columns: ColumnDef<Contact, any>[] = [
  columnHelper.accessor((row) => row.personType, {
    id: "personType",
    header: "Type",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.person?.name || "-", {
    id: "name",
    header: "Name",
    cell: (info) => info.getValue().toLowerCase(),
  }),
  columnHelper.accessor((row) => row.person?.email || "-", {
    id: "email",
    header: "Email",
    cell: (info) => info.getValue().toLowerCase(),
  }),
   columnHelper.accessor((row) => row.person?.phone || "-", {
    id: "phone",
    header: "Phone",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.company, {
    header: "Company",
    cell: (info) => info.getValue()?.name?.toLowerCase() ?? "-",
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const status = info.getValue();
      const color = {
        active: "bg-green-100 text-green-800",
        inactive: "bg-gray-100 text-gray-800",
      }[status];
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
          {status}
        </span>
      );
    },
  }),
];

const Contacts = () => {
  const { contacts, fetchContacts, deleteContact, isFetched } =
    useContactsStore();



  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>();

  useEffect(() => {
    if (!isFetched) {
      fetchContacts();
    }
  }, [fetchContacts, isFetched]);

  const table = useReactTable({
    data: contacts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleEdit = (txn: Contact) => {
    setSelectedContact(txn);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      deleteContact(id);
    }
  };

  const handleAdd = () => {
    setSelectedContact(undefined);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedContact(undefined);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
        <button onClick={handleAdd} className="btn btn-primary">
          Add Contact
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-h-screen overflow-y-auto w-full max-w-3xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedContact ? "Edit Contact" : "Add Contact"}
            </h2>
            <ContactForm
              contact={
                selectedContact
                  ? {
                      _id: selectedContact._id,
                      ID: selectedContact.ID,
                      personType: selectedContact.personType,
                      person: selectedContact.person._id,
                      company: selectedContact.company?._id ?? null,
                      status: selectedContact.status,
                    }
                  : undefined
              }
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

export default Contacts;
