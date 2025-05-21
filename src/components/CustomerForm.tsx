import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CustomerFormData, CustomerFormWithId } from "../utilities/types";
import useCustomerStore from "../store/customers";

interface CustomerFormProps {
  customer?: CustomerFormWithId;
  onClose: () => void;
}

const CustomerForm = ({ customer, onClose }: CustomerFormProps) => {
  const { addCustomer, updateCustomer } = useCustomerStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CustomerFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      status: "lead",
      type: "Regular",
      address: "",
      contactPerson: "",
      company: "",
      remarks: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (customer) {
      Object.entries(customer).forEach(([key, value]) => {
        setValue(key as keyof CustomerFormData, value);
      });
    }
  }, [customer, setValue]);

  const onSubmit = (data: CustomerFormData) => {
    if (customer) {
      updateCustomer(customer._id, data);
    } else {
      addCustomer(data);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="input"
          />
          {errors.name && (
            <p className="text-red-600 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="label">Email</label>
          <input type="email" {...register("email")} className="input" />
        </div>

        <div>
          <label className="label">Phone</label>
          <input {...register("phone")} className="input" />
        </div>

        <div>
          <label className="label">Status</label>
          <select
            {...register("status", { required: "Status is required" })}
            className="input"
          >
            <option value="lead">Lead</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="label">Type</label>
          <select
            {...register("type", { required: "Type is required" })}
            className="input"
          >
            <option value="Regular">Regular</option>
            <option value="Walk-in">Walk-in</option>
            <option value="Wholesale">Wholesale</option>
            <option value="Retail">Retail</option>
          </select>
        </div>

        <div>
          <label className="label">Company</label>
          <input {...register("company")} className="input" />
        </div>

        <div>
          <label className="label">Contact Person</label>
          <input {...register("contactPerson")} className="input" />
        </div>

        <div>
          <label className="label">Address</label>
          <input {...register("address")} className="input" />
        </div>

        <div>
          <label className="label">Remarks</label>
          <textarea {...register("remarks")} className="input" rows={2} />
        </div>

        <div>
          <label className="label">Notes</label>
          <textarea {...register("notes")} className="input" rows={2} />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {customer ? "Update" : "Add"} Customer
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;
