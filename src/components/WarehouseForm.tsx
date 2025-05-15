import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { WarehouseFormData, WahouseFormWithId } from "../utilities/types";
import useWarehouseStore from "../store/warehouse";

interface WarehouseFormProps {
  warehouse?: WahouseFormWithId;
  onClose: () => void;
}

const WarehouseForm = ({ warehouse, onClose }: WarehouseFormProps) => {
  const { addWarehouse, updateWarehouse } = useWarehouseStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<WarehouseFormData>({
    defaultValues: {
      name: "",
      location: "",
      description: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (warehouse) {
      setValue("name", warehouse.name);
      setValue("location", warehouse.location);
      setValue("description", warehouse.description);
      setValue("isActive", warehouse.isActive);
    }
  }, [warehouse, setValue]);

  const onSubmit = (data: WarehouseFormData) => {
    if (warehouse) {
      updateWarehouse(warehouse._id, data);
    } else {
      addWarehouse(data);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="input"
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            {...register("location", { required: "Location is required" })}
            className="input"
          />
          {errors.location && (
            <p className="text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Description <span className="text-gray-500">(Optional)</span>
          </label>
          <textarea {...register("description")} className="input" rows={3} />
        </div>

        <div className="col-span-2 flex items-center space-x-2">
          <input
            type="checkbox"
            {...register("isActive")}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
          <label className="text-sm text-gray-700">Is Active</label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {warehouse ? "Update" : "Add"} Warehouse
        </button>
      </div>
    </form>
  );
};

export default WarehouseForm;
