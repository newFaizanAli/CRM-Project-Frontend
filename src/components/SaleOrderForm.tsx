import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  SaleOrderItem,
  SaleOrderFormData,
} from "../utilities/types";
import useProductsStore from "../store/products";
import { saleOrderStatus } from "../utilities/const";
import useCustomerStore from "../store/customers";
import useSaleOrderStore from "../store/sale-orders";

interface SaleOrderFormProps {
  order?: any;
  onClose: () => void;
}

const SaleOrderForm = ({ order, onClose }: SaleOrderFormProps) => {
  const { addSaleOrder, updateSaleOrder } = useSaleOrderStore();
  const { products } = useProductsStore();
  const { customers } = useCustomerStore();

  // Transform items if order is passed
  const initialItems =
    order?.items?.map((item: any) => ({
      product: item.product._id,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.amount,
    })) || [];

  const [items, setItems] = useState<SaleOrderItem[]>(initialItems);
  const [totalAmount, setTotalAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SaleOrderFormData>({
    defaultValues: order
      ? {
          customer: order.customer?._id || "",
          deliveryDate: order.deliveryDate?.slice(0, 10) || "",
          dueDate: order.dueDate?.slice(0, 10) || "",
          taxesAndCharges: order.taxesAndCharges || 0,
          discount: order.discount || 0,
          totalAmount: order.totalAmount || 0,
          grandTotal: order.grandTotal || 0,
          remarks: order.remarks || "",
          status: order.status || "",
        }
      : {
          customer: "",
          deliveryDate: "",
          dueDate: "",
          taxesAndCharges: 0,
          discount: 0,
          totalAmount: 0,
          grandTotal: 0,
          remarks: "",
          status: "Pending",
        },
  });

  const taxes = watch("taxesAndCharges") || 0;
  const discount = watch("discount") || 0;

  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (total * taxes) / 100;
    const discountAmount = (total * discount) / 100;
    const grand = total + taxAmount - discountAmount;

    setTotalAmount(total);
    setGrandTotal(grand);

    setValue("totalAmount", total);
    setValue("grandTotal", grand);
  }, [items, taxes, discount, setValue]);

  const handleAddItem = (productId: string) => {
    if (items.find((item) => item.product === productId)) return;

    const product = products.find((p) => p._id === productId);
    if (!product) return;

    const newItem: SaleOrderItem = {
      product: product._id,
      quantity: 1,
      rate: product.sellingPrice,
      amount: product.sellingPrice,
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
    if (key === "quantity" && value < 1) return;
    item[key] = value;
    item.amount = item.quantity * item.rate;
    setItems(updatedItems);
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const onSubmit = (data: SaleOrderFormData) => {
    const finalData = { ...data, items };
    if (order) {
      updateSaleOrder(order._id, finalData);
    } else {
      addSaleOrder(finalData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Customer</label>
          <select
            {...register("customer", { required: "Customer is required" })}
            className="input w-full"
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
          <label>Delivery Date</label>
          <input
            type="date"
            {...register("deliveryDate", {
              required: "Date is required",
            })}
            className="input w-full"
          />
          {errors.deliveryDate && (
            <p className="text-red-500">{errors.deliveryDate.message}</p>
          )}
        </div>

        <div>
          <label>Due Date</label>
          <input
            type="date"
            {...register("dueDate", {
              required: "Date is required",
            })}
            className="input w-full"
          />
          {errors.dueDate && (
            <p className="text-red-500">{errors.dueDate.message}</p>
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
              <th>Quantity</th>
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
          <label>Taxes (%)</label>
          <input
            type="number"
            {...register("taxesAndCharges")}
            className="input w-full"
          />
        </div>

        <div>
          <label>Discount (%)</label>
          <input
            type="number"
            {...register("discount")}
            className="input w-full"
          />
        </div>

        <div>
          <label>Total Amount:</label>
          <p className="input bg-gray-100">{totalAmount.toFixed(2)}</p>
        </div>

        <div>
          <label>Grand Total:</label>
          <p className="input bg-gray-100">{grandTotal.toFixed(2)}</p>
        </div>

        <div>
          <label>Status</label>
          <select
            {...register("status", { required: "Status is required" })}
            className="input w-full"
          >
            <option value="">-- Select Status --</option>
            {saleOrderStatus.map((en_t) => (
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
          {order ? "Update" : "Create"} Sale Order
        </button>
      </div>
    </form>
  );
};

export default SaleOrderForm;
