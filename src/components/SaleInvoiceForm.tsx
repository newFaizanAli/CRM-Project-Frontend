import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  SaleInvoiceFormData,
  SaleInvoiceItem,
} from "../utilities/types";
import useProductsStore from "../store/products";
import {  invoicesStatus } from "../utilities/const";
import useSaleInvoiceStore from "../store/sale-invoice";
import useSaleOrderStore from "../store/sale-orders";
import useCustomerStore from "../store/customers";
import useWarehouseStore from "../store/warehouse";

interface SaleInvoiceFormProps {
  invoice?: any;
  onClose: () => void;
}

const SaleInvoiceForm = ({ invoice, onClose }: SaleInvoiceFormProps) => {
  const { addSaleInvoice, updateSaleInvoice } = useSaleInvoiceStore();
  const { products } = useProductsStore();
  const { customers } = useCustomerStore();
  const { saleOrders } = useSaleOrderStore();
   const { warehouses } = useWarehouseStore();

  const initialItems =
    invoice?.items?.map((item: any) => {
      const fullProduct = products.find((p) => p._id === item.product);
      return {
        product: item.product,
        quantity: item.quantity ?? 1,
        rate: item.rate,
        amount: item.amount || item.rate * (item.quantity ?? 1),
        productName: fullProduct?.name || "Unknown",
        maxQty: (item.quantity || item.quantity) ?? 1,
      };
    }) || [];

  const [items, setItems] = useState<SaleInvoiceItem[]>(initialItems);
  const [totalAmount, setTotalAmount] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SaleInvoiceFormData>({
    defaultValues: invoice
      ? {
          customer: invoice.customer?._id || "",
          invoiceDate: invoice.invoiceDate?.slice(0, 10) || "",
          totalAmount: invoice.totalAmount || 0,
          remarks: invoice.remarks || "",
          status: invoice.status || "Unpaid",
          saleOrder: invoice.saleOrder?._id || "",
          stockEntered: invoice.stockEntered || false,
          warehouse: invoice.warehouse?._id || "", 
        }
      : {
          customer: "",
          invoiceDate: new Date().toISOString().slice(0, 10),
          totalAmount: 0,
          remarks: "",
          status: "Unpaid",
          saleOrder: "",
          stockEntered: false,
          warehouse: "", 
        },
  });

  const saleOrderId = watch("saleOrder") || "";

  useEffect(() => {
    // Clear items when no receipt is selected
    if (!saleOrderId) {
      setItems([]);
      return;
    }

    if (typeof saleOrderId === "string" && saleOrderId) {
      const selectedOrder = [...(saleOrders as any)].find(
        (order: any) => order._id === saleOrderId
      );

      if (selectedOrder) {
        // Set the supplier if available
        if (selectedOrder.customer?._id) {
          setValue("customer", selectedOrder.customer._id);
        }

        // Process items only if we have them
        if (selectedOrder.items?.length) {
          const newItems = selectedOrder.items.map((item: any) => {
            // Handle both cases where product might be object or just ID
            const productId = item.product?._id || item.product;
            const product = products.find((p) => p._id === productId);

            const orderQty = item.quantity || item.quantity || 1;
            const itemRate = item.rate || product?.sellingPrice || 0;

            return {
              product: productId,
              quantity: orderQty,
              rate: itemRate,
              amount: itemRate * orderQty,
              maxQty: orderQty,
              productName: item.product?.name || product?.name || "Unknown",
            };
          });

          setItems(newItems);
        } else {
          setItems([]); // Clear items if receipt has no items
        }
      }
    }
  }, [saleOrderId, saleOrders, setValue, products, invoice]);

  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    setTotalAmount(total);
    setValue("totalAmount", total);
  }, [items, setValue]);

  const handleAddItem = (productId: string) => {
    if (items.find((item) => item.product === productId)) return;
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    const newItem: SaleInvoiceItem = {
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
          `Quantity ${value} cannot be exceed from order order quantity (${maxQty}) se`
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

  const onSubmit = (data: SaleInvoiceFormData) => {
    const finalData = { ...data, items };
    if (invoice) {
      updateSaleInvoice(invoice._id, finalData);
    } else {
      addSaleInvoice(finalData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Sale Order</label>
          <select
            {...register("saleOrder", { required: "Recept is required" })}
            className="input w-full"
          >
            <option value="">-- Select Order --</option>
            {saleOrders.map((order) => (
              <option key={order._id} value={order._id}>
                {order.ID}
              </option>
            ))}
          </select>
          {errors.saleOrder && (
            <p className="text-red-500">{errors.saleOrder.message}</p>
          )}
        </div>

        <div>
          <label>Customer</label>
          <select
            {...register("customer", { required: "Customer is required" })}
            className="input w-full"
            disabled={!!watch("customer")}
          >
            <option value="">-- Select Customer --</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.name}
              </option>
            ))}
          </select>
          {errors.customer && (
            <p className="text-red-500">{errors.customer.message}</p>
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
              <th>Sale QTY</th>
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
          <label>Stock Enter</label>
          <select
            {...register("stockEntered", {
              required: "Stock Entry is required",
            })}
            className="input w-full"
          >
            <option value="">-- Select stock enter --</option>
            <option value="true"> Yes </option>
            <option value="false"> No </option>
          </select>
          {errors.stockEntered && (
            <p className="text-red-500">{errors.stockEntered.message}</p>
          )}
        </div>

        <div>
          <label>Status</label>
          <select
            {...register("status", { required: "Status is required" })}
            className="input w-full"
          >
            <option value="">-- Select Status --</option>
            {invoicesStatus.map((en_t) => (
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
          {invoice ? "Update" : "Create"} Sale Invoice
        </button>
      </div>
    </form>
  );
};

export default SaleInvoiceForm;
