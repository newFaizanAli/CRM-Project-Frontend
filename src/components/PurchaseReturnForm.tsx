import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import usePurchaseReturnStore from "../store/purchase-returns";
import useProductsStore from "../store/products";
import useSupplierStore from "../store/suppliers";
import usePurchaseReceiptStore from "../store/purchase-receipts";
import { PurchaseReturnFormData, PurchaseReturnItem } from "../utilities/types";
import { purchaseReturnsStatus } from "../utilities/const";

interface PurchaseReturnFormProps {
  pur_return?: any;
  onClose: () => void;
}

const PurchaseReturnForm = ({
  pur_return,
  onClose,
}: PurchaseReturnFormProps) => {
  const { addPurchaseReturn, updatePurchaseReturn } = usePurchaseReturnStore();
  const { products } = useProductsStore();
  const { suppliers } = useSupplierStore();
  const { purchaseReceipts } = usePurchaseReceiptStore();

  const initialItems =
    pur_return?.items?.map((item: any) => {
      const fullProduct = products.find((p) => p._id === item.product);
      return {
        product: item.product,
        quantity: item.quantity ?? 1,
        rate: item.rate,
        amount: item.amount || item.rate * (item.quantity ?? 1),
        productName: fullProduct?.name || "Unknown",
        maxQty: (item.receivedQty || item.quantity) ?? 1,
      };
    }) || [];

  const [items, setItems] = useState<PurchaseReturnItem[]>(initialItems);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PurchaseReturnFormData>({
    defaultValues: pur_return
      ? {
          supplier: pur_return.supplier?._id || "",
          returnDate: pur_return.returnDate?.slice(0, 10) || "",
          reason: pur_return.reason || "",
          status: pur_return.status || "Draft",
          purchaseReceipt: pur_return.purchaseReceipt?._id || "",
        }
      : {
          supplier: "",
          returnDate: "",
          reason: "",
          status: "Draft",
          purchaseReceipt: "",
        },
  });

  const purchaseReturnId = watch("purchaseReceipt") || "";

  useEffect(() => {
    if (!purchaseReturnId) {
      setItems([]);
      return;
    }

    if (typeof purchaseReturnId === "string" && purchaseReturnId) {
      const selectedReceipt = [...(purchaseReceipts as any)].find(
        (receipt: any) => receipt._id === purchaseReturnId
      );

      if (selectedReceipt) {
        // Set the supplier if available
        if (selectedReceipt.supplier?._id) {
          setValue("supplier", selectedReceipt.supplier._id);
        }

        // Process items only if we have them
        if (selectedReceipt.items?.length) {
          const newItems = selectedReceipt.items.map((item: any) => {
            // Handle both cases where product might be object or just ID
            const productId = item.product?._id || item.product;
            const product = products.find((p) => p._id === productId);

            const receivedQty = item.receivedQty || item.quantity || 1;
            const itemRate = item.rate || product?.sellingPrice || 0;

            return {
              product: productId,
              quantity: receivedQty,
              rate: itemRate,
              amount: itemRate * receivedQty,
              maxQty: receivedQty,
              productName: item.product?.name || product?.name || "Unknown",
            };
          });

          setItems(newItems);
        } else {
          setItems([]);
        }
      }
    }
  }, [purchaseReturnId, purchaseReceipts, setValue, products]);

  const handleAddItem = (productId: string) => {
    if (items.find((item) => item.product === productId)) return;
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    const newItem: PurchaseReturnItem = {
      product: product._id,
      quantity: 1,
      rate: product.sellingPrice,
      amount: product.sellingPrice * 1,
      maxQty: 0,
      productName: product.name,
    };
    setItems([...items, newItem]);
  };

  const handleItemChange = (
    index: number,
    key: "quantity" | "rate",
    value: number
  ) => {
    const updatedItems = [...items];
    const item = updatedItems[index];

    if (key === "quantity") {
      if (value < 1) return;

      const maxQty = item.maxQty || item.quantity;
      if (value > maxQty) {
        alert(
          `Quantity ${value} cannot be exceed from order received quantity (${maxQty}) se`
        );
        return;
      }
    }

    item[key] = value;
    item.amount = item.quantity * item.rate;
    setItems(updatedItems);
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const onSubmit = (data: PurchaseReturnFormData) => {
    const finalData = { ...data, items };
    if (pur_return) {
      updatePurchaseReturn(pur_return._id, finalData);
    } else {
      addPurchaseReturn(finalData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Purchase Receipt</label>
          <select
            {...register("purchaseReceipt", { required: "Recept is required" })}
            className="input w-full"
          >
            <option value="">-- Select Receipt --</option>
            {purchaseReceipts.map((order) => (
              <option key={order._id} value={order._id}>
                {order.ID}
              </option>
            ))}
          </select>
          {errors.purchaseReceipt && (
            <p className="text-red-500">{errors.purchaseReceipt.message}</p>
          )}
        </div>

        <div>
          <label>Supplier</label>
          <select
            {...register("supplier", { required: "Supplier is required" })}
            className="input w-full"
            disabled={!!watch("purchaseReceipt")}
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
          <label>Return Date</label>
          <input
            type="date"
            {...register("returnDate", {
              required: "Date is required",
            })}
            className="input w-full"
          />
          {errors.returnDate && (
            <p className="text-red-500">{errors.returnDate.message}</p>
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
              <th>QTY</th>
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
          <label>Status</label>
          <select
            {...register("status", { required: "Status is required" })}
            className="input w-full"
          >
            <option value="">-- Select Status --</option>
            {purchaseReturnsStatus.map((en_t) => (
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
          <label>Reason</label>
          <textarea {...register("reason")} className="input w-full" rows={3} />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {pur_return ? "Update" : "Create"} Purchase Return
        </button>
      </div>
    </form>
  );
};

export default PurchaseReturnForm;
