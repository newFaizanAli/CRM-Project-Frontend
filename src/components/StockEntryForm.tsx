import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import { StockEntryFormData, StockEntryFormWithId } from "../utilities/types";
import useWarehouseStore from "../store/warehouse";
import useStockEntryStore from "../store/stock_entry";
import useProductsStore from "../store/products";
import { entryTypes } from "../utilities/const";

interface StockEntryFormProps {
  stockentry?: Partial<StockEntryFormWithId>;
  onClose: () => void;
}

const StockEntryForm = ({ stockentry, onClose }: StockEntryFormProps) => {
  const { addStockEntry, updateStockEntry } = useStockEntryStore();
  const { warehouses } = useWarehouseStore();
  const { products } = useProductsStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<StockEntryFormData>({
    defaultValues: {
      product: "",
      warehouse: "",
      entryType: "Purchase",
      remarks: "",
      entryDate: "",
      quantity: 1,
      rate: 0,
      total: 0,
    },
  });

  const quantity = watch("quantity");
  const rate = watch("rate");
  const selectedProductId = watch("product");

  const isManualChange = useRef(false);

  useEffect(() => {
    setValue("total", quantity * rate);
  }, [quantity, rate, setValue]);

  useEffect(() => {
    if (selectedProductId && isManualChange.current) {
      const selectedProduct = products.find((p) => p._id === selectedProductId);
      if (selectedProduct) {
        setValue("rate", selectedProduct.sellingPrice || 0);
      }
    }
  }, [selectedProductId, products, setValue]);

  useEffect(() => {
    if (stockentry) {
      const product =
        typeof stockentry.product === "string"
          ? stockentry.product
          : stockentry.product?._id ?? "";

      const warehouse =
        typeof stockentry.warehouse === "string"
          ? stockentry.warehouse
          : stockentry.warehouse?._id ?? "";

      const formattedDate = stockentry.entryDate
        ? new Date(stockentry.entryDate).toISOString().split("T")[0]
        : "";

      reset({
        product,
        warehouse,
        entryType: stockentry.entryType,
        remarks: stockentry.remarks,
        entryDate: formattedDate,
        quantity: stockentry.quantity,
        rate: stockentry.rate,
        total: stockentry.total,
      });

      isManualChange.current = false;
      setTimeout(() => {
        isManualChange.current = true;
      }, 100);
    }
  }, [stockentry, reset, products, setValue]);

  const onSubmit = (data: StockEntryFormData) => {
    if (stockentry) {
      updateStockEntry(String(stockentry._id), data);
    } else {
      addStockEntry(data);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* Product */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product
          </label>
          <select
            {...register("product", { required: "Product is required" })}
            className="input"
            onChange={(e) => {
              isManualChange.current = true;
              setValue("product", e.target.value);
            }}
          >
            <option value="">Select product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
          {errors.product && (
            <p className="text-red-600 text-sm">{errors.product.message}</p>
          )}
        </div>

        {/* Warehouse */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Warehouse
          </label>
          <select
            {...register("warehouse", { required: "Warehouse is required" })}
            className="input"
          >
            <option value="">Select warehouse</option>
            {warehouses.map((w) => (
              <option key={w._id} value={w._id}>
                {w.name}
              </option>
            ))}
          </select>
          {errors.warehouse && (
            <p className="text-red-600 text-sm">{errors.warehouse.message}</p>
          )}
        </div>

        {/* Entry Type */}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Entry Type
          </label>
          <select
            {...register("entryType", { required: "Unit is required" })}
            className="input"
          >
            <option value="">Select entry type</option>
            {entryTypes.map((en_t) => (
              <option key={en_t.value} value={en_t.value}>
                {en_t.label}
              </option>
            ))}
          </select>
          {errors.entryType && (
            <p className="text-sm text-red-600">{errors.entryType.message}</p>
          )}
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Expire Date
          </label>
          <input type="date" {...register("entryDate")} className="input" />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            {...register("quantity", {
              required: "Quantity is required",
              min: {
                value: 1,
                message: "Quantity must be at least 1", 
              },
            })}
            className="input"
          />
        </div>

        {/* Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Rate
          </label>
          <input
            type="number"
            {...register("rate", { required: "Rate is required", min: 0 })}
            className="input"
          />
        </div>

        {/* Total (Auto-calculated) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Total
          </label>
          <input
            type="number"
            {...register("total")}
            className="input bg-gray-100"
            readOnly
          />
        </div>

        {/* Remarks */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Remarks
          </label>
          <textarea {...register("remarks")} className="input" rows={3} />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {stockentry ? "Update" : "Add"} Entry
        </button>
      </div>
    </form>
  );
};

export default StockEntryForm;
