import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  PurchaseReceiptFormData,
  PurchaseReceiptItem,
} from "../utilities/types";
import useProductsStore from "../store/products";
import useSupplierStore from "../store/suppliers";
import { purchaseReceiptStatus } from "../utilities/const";
import usePurchaseReceiptStore from "../store/purchase-receipts";
import useWarehouseStore from "../store/warehouse";
import usePurchaseOrderStore from "../store/purchase-orders";

interface PurchaseReceiptFormProps {
  receipt?: any;
  onClose: () => void;
}

const PurchaseReceiptForm = ({
  receipt,
  onClose,
}: PurchaseReceiptFormProps) => {
  const { addPurchaseReceipt, updatePurchaseReceipt } =
    usePurchaseReceiptStore();
  const { products } = useProductsStore();
  const { suppliers } = useSupplierStore();
  const { warehouses } = useWarehouseStore();
  const { purchaseOrders } = usePurchaseOrderStore();

  const initialItems =
    receipt?.items?.map((item: any) => {
      const fullProduct = products.find((p) => p._id === item.product);
      return {
        product: item.product,
        receivedQty: item.receivedQty ?? 1,
        rate: item.rate,
        amount: item.amount || item.rate * (item.receivedQty ?? 1),
        productName: fullProduct?.name || "Unknown",
        maxQty: (item.quantity || item.receivedQty) ?? 1, // Fixed with parentheses
      };
    }) || [];

  const [items, setItems] = useState<PurchaseReceiptItem[]>(initialItems);
  const [totalAmount, setTotalAmount] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PurchaseReceiptFormData>({
    defaultValues: receipt
      ? {
          supplier: receipt.supplier?._id || "",
          receiptDate: receipt.receiptDate?.slice(0, 10) || "",
          totalAmount: receipt.totalAmount || 0,
          remarks: receipt.remarks || "",
          status: receipt.status || "Draft",
          warehouse: receipt.warehouse?._id || "", // fix yeh hai
          purchaseOrder: receipt.purchaseOrder?._id || "", // fix yeh hai
        }
      : {
          supplier: "",
          receiptDate: "",
          totalAmount: 0,
          remarks: "",
          status: "Draft",
          warehouse: "",
          purchaseOrder: "",
        },
  });

  const purchaseOrderId = watch("purchaseOrder") || "";

  useEffect(() => {
    if (typeof purchaseOrderId === "string" && purchaseOrderId.trim()) {
      const selectedPO = (purchaseOrders as any).find(
        (po: any) => po._id === purchaseOrderId
      );

      if (selectedPO?.supplier?._id) {
        setValue("supplier", selectedPO.supplier._id);
      }

      // Only set items if we're not in edit mode (no receipt)
      if (!receipt && selectedPO?.items?.length) {
        const newItems = selectedPO.items.map((item: any) => ({
          product: item.product._id,
          receivedQty: item.quantity,
          rate: item.rate,
          amount: item.rate * item.quantity,
          maxQty: item.quantity,
          productName: item.product.name || "Unknown", // Add product name
        }));

        setItems(newItems);
      }
    }
  }, [purchaseOrderId, purchaseOrders, setValue, receipt]);

  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    setTotalAmount(total);
    setValue("totalAmount", total);
  }, [items, setValue]);

  const handleAddItem = (productId: string) => {
    if (items.find((item) => item.product === productId)) return;
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    const newItem: PurchaseReceiptItem = {
      product: product._id,
      receivedQty: 1,
      rate: product.sellingPrice,
      amount: product.sellingPrice * 1,
      maxQty: 0,
      productName: product.name,
    };
    setItems([...items, newItem]);
  };

  const handleItemChange = (
    index: number,
    key: "receivedQty" | "rate",
    value: number
  ) => {
    const updatedItems = [...items];
    const item = updatedItems[index];

    if (key === "receivedQty") {
      if (value < 1) return;

      const maxQty = item.maxQty || item.receivedQty;
      if (value > maxQty) {
        alert(
          `Received quantity ${value} ziada hai order quantity (${maxQty}) se`
        );
        return;
      }
    }

    item[key] = value;
    item.amount = item.receivedQty * item.rate;
    setItems(updatedItems);
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const onSubmit = (data: PurchaseReceiptFormData) => {
    const finalData = { ...data, items };
    if (receipt) {
      updatePurchaseReceipt(receipt._id, finalData);
    } else {
      addPurchaseReceipt(finalData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Purchase Order</label>
          <select
            {...register("purchaseOrder", { required: "Order is required" })}
            className="input w-full"
          >
            <option value="">-- Select Order --</option>
            {purchaseOrders.map((order) => (
              <option key={order._id} value={order._id}>
                {order.ID}
              </option>
            ))}
          </select>
          {errors.purchaseOrder && (
            <p className="text-red-500">{errors.purchaseOrder.message}</p>
          )}
        </div>

        <div>
          <label>Supplier</label>
          <select
            {...register("supplier", { required: "Supplier is required" })}
            className="input w-full"
            disabled={!!watch("purchaseOrder")}
          >
            <option value="">-- Select Supplier --</option>
            {suppliers.map((supplier) => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.name}
              </option>
            ))}
          </select>
          {errors.supplier && (
            <p className="text-red-500">{errors.supplier.message}</p>
          )}
        </div>

        <div>
          <label>Warehouse</label>
          <select
            {...register("warehouse", { required: "Warehouse is required" })}
            className="input w-full"
          >
            <option value="">-- Select Warehouse --</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse._id} value={warehouse._id}>
                {`${warehouse.name} (${warehouse.location})`}
              </option>
            ))}
          </select>
          {errors.warehouse && (
            <p className="text-red-500">{errors.warehouse.message}</p>
          )}
        </div>

        <div>
          <label>Receipt Date</label>
          <input
            type="date"
            {...register("receiptDate", {
              required: "Date is required",
            })}
            className="input w-full"
          />
          {errors.receiptDate && (
            <p className="text-red-500">{errors.receiptDate.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label>Select Product</label>
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

      <div className="overflow-auto">
        <table className="w-full table-auto border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th>Product</th>
              <th>Received QTY</th>
              <th>Rate</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const product = products.find((p) => p._id === item.product);
              return (
                <tr key={index} className="border-t">
                  <td>{product?.name || ""}</td>
                  <td>
                    <input
                      type="number"
                      value={item.receivedQty}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "receivedQty",
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
                  <td>{item.amount.toFixed(2)}</td>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Total Amount:</label>
          <p className="input bg-gray-100">{totalAmount.toFixed(2)}</p>
        </div>

        <div>
          <label>Status</label>
          <select
            {...register("status", { required: "Status is required" })}
            className="input w-full"
          >
            <option value="">-- Select Status --</option>
            {purchaseReceiptStatus.map((en_t) => (
              <option key={en_t.value} value={en_t.value}>
                {en_t.label}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="text-red-500">{errors.status.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
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
          {receipt ? "Update" : "Create"} Purchase Receipt
        </button>
      </div>
    </form>
  );
};

export default PurchaseReceiptForm;
