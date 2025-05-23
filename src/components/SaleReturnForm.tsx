import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useProductsStore from "../store/products";
import { SaleReturnFormData, SaleReturnItem } from "../utilities/types";
import { saleReturnStatus } from "../utilities/const";
import useCustomerStore from "../store/customers";
import useSaleInvoiceStore from "../store/sale-invoice";
import useSalesReturnStore from "../store/sale-return";

interface SaleReturnFormProps {
  sale_return?: any;
  onClose: () => void;
}

const SaleReturnForm = ({ sale_return, onClose }: SaleReturnFormProps) => {
  const { addSalesReturn, updateSalesReturn } = useSalesReturnStore();
  const { products } = useProductsStore();
  const { customers } = useCustomerStore();
  const { saleInvoices } = useSaleInvoiceStore();

  const initialItems =
    sale_return?.items?.map((item: any) => {
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

  const [items, setItems] = useState<SaleReturnItem[]>(initialItems);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SaleReturnFormData>({
    defaultValues: sale_return
      ? {
          customer: sale_return.customer?._id || "",
          returnDate: sale_return.returnDate?.slice(0, 10) || "",
          reason: sale_return.reason || "",
          status: sale_return.status || "Pending",
          saleInvoice: sale_return.saleInvoice?._id || "",
          stockEntered: sale_return.stockEntered || false,
        }
      : {
          customer: "",
          returnDate: new Date().toISOString().slice(0, 10),
          reason: "",
          status: "Pending",
          saleInvoice: "",
          stockEntered: false,
        },
  });

  const saleInvoiceId = watch("saleInvoice") || "";

  useEffect(() => {
    if (!saleInvoiceId) {
      setItems([]);
      return;
    }

    if (typeof saleInvoiceId === "string" && saleInvoiceId) {
      const selectedInvoice = [...(saleInvoices as any)].find(
        (receipt: any) => receipt._id === saleInvoiceId
      );

      if (selectedInvoice) {
        // Set the customer if available
        if (selectedInvoice.customer?._id) {
          setValue("customer", selectedInvoice.customer._id);
        }

        // Process items only if we have them
        if (selectedInvoice.items?.length) {
          const newItems = selectedInvoice.items.map((item: any) => {
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
  }, [saleInvoiceId, saleInvoices, setValue, products]);

  const handleAddItem = (saleId: string) => {
    if (items.find((item) => item.product === saleId)) return;
    const product = products.find((p) => p._id === saleId);
    if (!product) return;

    const newItem: SaleReturnItem = {
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
          `Quantity ${value} cannot be exceed from order invoice quantity (${maxQty}) se`
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

  const onSubmit = (data: SaleReturnFormData) => {
    const finalData = { ...data, items };
    if (sale_return) {
      updateSalesReturn(sale_return._id, finalData);
    } else {
      addSalesReturn(finalData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Sale Invoice</label>
          <select
            {...register("saleInvoice", { required: "Invoice is required" })}
            className="input w-full"
          >
            <option value="">-- Select Invoice --</option>
            {saleInvoices.map((invoice) => (
              <option key={invoice._id} value={invoice._id}>
                {invoice.ID}
              </option>
            ))}
          </select>
          {errors.saleInvoice && (
            <p className="text-red-500">{errors.saleInvoice.message}</p>
          )}
        </div>

        <div>
          <label>Customer</label>
          <select
            {...register("customer", { required: "Customer is required" })}
            className="input w-full"
            disabled={!!watch("saleInvoice")}
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
            {saleReturnStatus.map((en_t) => (
              <option key={en_t.value} value={en_t.value}>
                {en_t.label}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="text-red-500">{errors.status.message}</p>
          )}
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
          {sale_return ? "Update" : "Create"} Sale Return
        </button>
      </div>
    </form>
  );
};

export default SaleReturnForm;
