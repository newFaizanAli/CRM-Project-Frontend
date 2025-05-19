import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Supplier, SupplierFormData } from "../utilities/types";
import useSupplierStore from "../store/suppliers";

interface SupplierFormProps {
  supplier?: Supplier;
  onClose: () => void;
  
}

const SupplierForm = ({ supplier, onClose }: SupplierFormProps) => {
  const { addSupplier, updateSupplier } = useSupplierStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SupplierFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      contactPerson: "",
      status: "Active",
      remarks: "",
      supplierType: "Individual",
      gstNumber: 0,
    },
  });

  useEffect(() => {
    if (supplier) {
      reset(supplier);
    }
  }, [supplier, reset]);

  const onSubmit = (data: SupplierFormData) => {
    if (supplier) {
      updateSupplier(supplier._id, data);
    } else {
      addSupplier(data);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Supplier Name
          </label>
          <input
            type="text"
            {...register("name", { required: "Supplier name is required" })}
            className="input"
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input type="email" {...register("email")} className="input" />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="text"
            {...register("phone", { required: "Phone number is required" })}
            className="input"
          />
          {errors.phone && (
            <p className="text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input type="text" {...register("address")} className="input" />
        </div>

        {/* Contact Person */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contact Person
          </label>
          <input type="text" {...register("contactPerson")} className="input" />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select {...register("status")} className="input">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Supplier Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Supplier Type
          </label>
          <select {...register("supplierType")} className="input">
            <option value="Company">Company</option>
            <option value="Individual">Individual</option>
          </select>
        </div>

        {/* GST Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            GST Number
          </label>
          <input
            type="number"
            {...register("gstNumber", { valueAsNumber: true })}
            className="input"
          />
        </div>

        {/* Remarks */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Remarks
          </label>
          <textarea {...register("remarks")} className="input" rows={3} />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {supplier ? "Update" : "Add"} Supplier
        </button>
      </div>
    </form>
  );
};

export default SupplierForm;
