import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  PurchaseInvoiceFormData,
  PurchaseInvoiceItem,
} from "../utilities/types";
import useProductsStore from "../store/products";
import useSupplierStore from "../store/suppliers";
import { purchaseInvoicesStatus } from "../utilities/const";
import usePurchaseReceiptStore from "../store/purchase-receipts";
import usePurchaseInvoiceStore from "../store/purchase-invoices";

interface PurchaseInvoiceFormProps {
  invoice?: any;
  onClose: () => void;
}

const PurchaseInvoiceForm = ({
  invoice,
  onClose,
}: PurchaseInvoiceFormProps) => {
  const { addPurchaseInvoice, updatePurchaseInvoice } =
    usePurchaseInvoiceStore();
  const { products } = useProductsStore();
  const { suppliers } = useSupplierStore();
  const { purchaseReceipts } = usePurchaseReceiptStore();

  const initialItems =
    invoice?.items?.map((item: any) => {
      const fullProduct = products.find((p) => p._id === item.product);
      return {
        product: item.product,
        quantity: item.quantity ?? 1,
        rate: item.rate,
        amount: item.amount || item.rate * (item.quantity ?? 1),
        productName: fullProduct?.name || "Unknown",
        maxQty: (item.receivedQtn || item.quantity) ?? 1,
      };
    }) || [];

  const [items, setItems] = useState<PurchaseInvoiceItem[]>(initialItems);
  const [totalAmount, setTotalAmount] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PurchaseInvoiceFormData>({
    defaultValues: invoice
      ? {
          supplier: invoice.supplier?._id || "",
          invoiceDate: invoice.invoiceDate?.slice(0, 10) || "",
          totalAmount: invoice.totalAmount || 0,
          remarks: invoice.remarks || "",
          status: invoice.status || "Draft",
          purchaseReceipt: invoice.purchaseReceipt?._id || "",
        }
      : {
          supplier: "",
          invoiceDate: "",
          totalAmount: 0,
          remarks: "",
          status: "Unpaid",
          purchaseReceipt: "",
        },
  });

  const purchaseReceiptId = watch("purchaseReceipt") || "";

useEffect(() => {
  // Clear items when no receipt is selected
  if (!purchaseReceiptId) {
    setItems([]);
    return;
  }

  if (typeof purchaseReceiptId === "string" && purchaseReceiptId) {
    const selectedReceipt = [...purchaseReceipts as any].find(
      (receipt: any) => receipt._id === purchaseReceiptId
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
          
          const receivedQty = item.receivedQtn || item.quantity || 1;
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
        setItems([]); // Clear items if receipt has no items
      }
    }
  }
}, [purchaseReceiptId, purchaseReceipts, setValue, products, invoice]);

  // useEffect(() => {
  //   if (typeof purchaseReceiptId === "string" && purchaseReceiptId.trim()) {
  //     const selectedPO = (purchaseReceipts as any).find(
  //       (po: any) => po._id === purchaseReceiptId
  //     );

  //     if (selectedPO?.supplier?._id) {
  //       setValue("supplier", selectedPO.supplier._id);
  //     }

  //     // Only set items if we're not in edit mode (no receipt)
  //     if (!invoice && selectedPO?.items?.length) {
  //       const newItems = selectedPO.items.map((item: any) => ({
  //         product: item.product._id,
  //         quantity: item.receivedQtn,
  //         rate: item.rate,
  //         amount: item.rate * item.receivedQtn,
  //         maxQty: item.receivedQtn,
  //         productName: item.product.name || "Unknown",
  //       }));

  //       setItems(newItems);
  //     }
  //   }
  // }, [purchaseReceiptId, purchaseReceipts, setValue, invoice]);

  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    setTotalAmount(total);
    setValue("totalAmount", total);
  }, [items, setValue]);

  const handleAddItem = (productId: string) => {
    if (items.find((item) => item.product === productId)) return;
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    const newItem: PurchaseInvoiceItem = {
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
          `Quantity ${value} ziada hai order received quantity (${maxQty}) se`
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

  const onSubmit = (data: PurchaseInvoiceFormData) => {
    const finalData = { ...data, items };
    if (invoice) {
      updatePurchaseInvoice(invoice._id, finalData);
    } else {
      addPurchaseInvoice(finalData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Purchase Order</label>
          <select
            {...register("purchaseReceipt", { required: "Recept is required" })}
            className="input w-full"
          >
            <option value="">-- Select Order --</option>
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
          <label>Invoice Date</label>
          <input
            type="date"
            {...register("invoiceDate", {
              required: "Date is required",
            })}
            className="input w-full"
          />
          {errors.invoiceDate && (
            <p className="text-red-500">{errors.invoiceDate.message}</p>
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
            {purchaseInvoicesStatus.map((en_t) => (
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
          {invoice ? "Update" : "Create"} Purchase Invoice
        </button>
      </div>
    </form>
  );
};

export default PurchaseInvoiceForm;
