import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useBOMStore from "../../../store/manufacturing/bom";
import useProductsStore from "../../../store/products";
import {
  BOM_Materials,
  BOMFormData,
  BOMOperations,
} from "../../../utilities/types";
import useOperationStore from "../../../store/manufacturing/operations";

interface BOMFormProps {
  bom?: any;
  onClose: () => void;
}

const BOMForm = ({ bom, onClose }: BOMFormProps) => {
  const { addBOM, updateBOM } = useBOMStore();

  const { products } = useProductsStore();
  const { operations } = useOperationStore();

  const initialItems =
    bom?.rawMaterials?.map((item: any) => ({
      product: item.product._id,
      quantity: item.quantity,
      rate: item.rate,
    })) || [];

  const initialOperations =
    bom?.operations?.map((op: any) => ({
      operation: op.operation._id,
      timeInMinutes: op.timeInMinutes,
      costPerHour: op.costPerHour,
    })) || [];

  const [rawMaterials, setRawMaterials] =
    useState<BOM_Materials[]>(initialItems);

  const [operationsState, setOperations] =
    useState<BOMOperations[]>(initialOperations);

  const [totalCost, setTotalCost] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BOMFormData>({
    defaultValues: bom
      ? {
          product: bom.product?._id || "",
          totalCost: bom.totalCost || 0,
          isActive: bom.isActive || true,
          remarks: bom.remarks || "",
        }
      : {
          product: "",
          totalCost: 0,
          isActive: true,
          remarks: "",
        },
  });

  useEffect(() => {
    const total = rawMaterials.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );

    const operationTotal = operationsState.reduce(
      (sum, item) => sum + item.costPerHour,
      0
    );

    const grandTotal = total + operationTotal;

    setTotalCost(grandTotal);

    setValue("totalCost", total);
  }, [rawMaterials, setValue, operationsState, bom]);

  const handleAddItem = (productId: string) => {
    if (rawMaterials.find((item) => item.product === productId)) return;

    const product = products.find((p) => p._id === productId);
    if (!product) return;

    const newItem: BOM_Materials = {
      product: product._id,
      quantity: 1,
      rate: product.sellingPrice,
    };

    setRawMaterials([...rawMaterials, newItem]);
  };

  const handleAddOperation = (opId: string) => {
    if (operationsState.find((op) => op.operation === opId)) return;

    const operation = operations.find((o) => o._id === opId);
    if (!operation) return;

    const newOperation: BOMOperations = {
      operation: operation._id,
      timeInMinutes: 0,
      costPerHour: 0,
    };

    setOperations([...operationsState, newOperation]);
  };

  const handleItemChange = (
    index: number,
    key: "quantity" | "rate",
    value: number
  ) => {
    const updatedItems = [...rawMaterials];

    const item = updatedItems[index];

    if (key === "quantity" && value < 1) return;

    item[key] = value;

    setRawMaterials(updatedItems);
  };

  const handleOperationChange = (
    index: number,
    key: "timeInMinutes" | "costPerHour",
    value: number
  ) => {
    const updatedOperations = [...operationsState];

    const operation = updatedOperations[index];

    operation[key] = value;

    setOperations(updatedOperations);
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...rawMaterials];
    updated.splice(index, 1);
    setRawMaterials(updated);
  };

  const handleRemoveOperation = (index: number) => {
    const updated = [...operationsState];
    updated.splice(index, 1);
    setOperations(updated);
  };

  const onSubmit = (data: BOMFormData) => {
    const finalData = { ...data, rawMaterials, operations: operationsState };

    if (bom) {
      updateBOM(bom._id, finalData);
    } else {
      addBOM(finalData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Product</label>
          <select
            {...register("product", { required: "Product is required" })}
            className="input w-full"
            defaultValue={bom?.product?._id || ""}
          >
            <option value="">-- Select Product --</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
          {errors.product && (
            <p className="text-red-500">{errors.product.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label>Select Material Product</label>
          <select
            onChange={(e) => handleAddItem(e.target.value)}
            className="input w-full"
          >
            <option value="">-- Select Product --</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* items  */}
      <div className="overflow-auto">
        <table className="w-full table-auto border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th>Product</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rawMaterials.map((item, index) => {
              const product = products.find((p) => p._id === item.product);
              return (
                <tr key={index} className="border-t">
                  <td>{product?.name || ""}</td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "quantity",
                          parseInt(e.target.value)
                        )
                      }
                      className="input w-20"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "rate",
                          parseFloat(e.target.value)
                        )
                      }
                      className="input w-24"
                    />
                  </td>
                  <td>{(item.quantity * item.rate).toFixed(2)}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* operations */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label>Select Operation</label>
          <select
            onChange={(e) => handleAddOperation(e.target.value)}
            className="input w-full"
          >
            <option value="">-- Select Operation --</option>
            {operations.map((operation) => (
              <option key={operation._id} value={operation._id}>
                {operation.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full table-auto border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th>Operation</th>
              <th>Time In Minutes</th>
              <th>Cost Per Hour</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {operationsState.map((op, index) => {
              const operation = operations.find((o) => o._id === op.operation);

              return (
                <tr key={index} className="border-t">
                  <td>{operation?.ID || ""}</td>
                  <td>
                    <input
                      type="number"
                      value={op.timeInMinutes}
                      onChange={(e) =>
                        handleOperationChange(
                          index,
                          "timeInMinutes",
                          parseInt(e.target.value)
                        )
                      }
                      className="input w-20"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={op.costPerHour}
                      onChange={(e) =>
                        handleOperationChange(
                          index,
                          "costPerHour",
                          parseFloat(e.target.value)
                        )
                      }
                      className="input w-24"
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleRemoveOperation(index)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Total Cost:</label>
          <p className="input bg-gray-100">{totalCost.toFixed(2)}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            {...register("isActive", {
              required: "Active is required",
            })}
            className="input"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div>
          <label>Remarks</label>
          <textarea
            {...register("remarks")}
            className="input w-full"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {bom ? "Update" : "Create"} BOM
        </button>
      </div>
    </form>
  );
};

export default BOMForm;
