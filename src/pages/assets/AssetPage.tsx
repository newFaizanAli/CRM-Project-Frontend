import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";
import { Asset } from "../../utilities/types";
import useAssetStore from "../../store/asset/asset";
import AssetForm from "../../components/form/assets/AssetForm";

const columnHelper = createColumnHelper<Asset>();

const columns: ColumnDef<Asset, any>[] = [
  columnHelper.accessor("ID", {
    header: "Code",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.vendor, {
    id: "Vendor",
    header: "Vendor",
    cell: (info) => info.getValue()?.name ?? "-",
  }),
  columnHelper.accessor((row) => row.category, {
    id: "Category",
    header: "Category",
    cell: (info) => info.getValue()?.name ?? "-",
  }),
  columnHelper.accessor("isActive", {
    header: "Is-Active",
    cell: (info) => (info.getValue() ? "Active" : "Inactive"),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => info.getValue() ?? "-",
  }),
];

const AssetPage = () => {
  const { assets, deleteAsset, fetchAssets, isFetched } = useAssetStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>();

  useEffect(() => {
    if (!isFetched) {
      fetchAssets();
    }
  }, [isFetched, fetchAssets]);

  const table = useReactTable({
    data: assets,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this asset?")) {
      deleteAsset(id);
    }
  };

  const handleEdit = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedAsset(undefined);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setSelectedAsset(undefined);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Assets</h1>
        <button onClick={handleAdd} className="btn btn-primary">
          Add Asset
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl">
            <h2 className="text-xl font-semibold mb-4">
              {selectedAsset ? "Edit Asset" : "Add Asset"}
            </h2>
            <AssetForm assets={selectedAsset} onClose={handleClose} />
          </div>
        </div>
      )}

      {/* Table */}
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

export default AssetPage;
