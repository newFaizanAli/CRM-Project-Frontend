import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useAssetCategoryStore from "../../../store/asset/asset-category";
import { AssetCategory, AssetCategoryFormData } from "../../../utilities/types";
import { asstesDepreciationMethods } from "../../../utilities/const";

interface AssetCategyFormProps {
  category?: AssetCategory;
  onClose: () => void;
}

const AssetCategoryForm = ({ category, onClose }: AssetCategyFormProps) => {
  const { addAssetCategory, updateAssetCategory } = useAssetCategoryStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AssetCategoryFormData>({
    defaultValues: {
      name: "",
      description: "",
      depreciationMethod: "None",
      usefulLifeInYears: 0,
      salvageValue: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description,
        depreciationMethod: category.depreciationMethod,
        usefulLifeInYears: category.usefulLifeInYears,
        salvageValue: category.salvageValue,
        isActive: category.isActive ? true : false,
      });
    }
  }, [category, reset]);

  const onSubmit = (data: AssetCategoryFormData) => {
    const updatedData = {
      ...data,
      isActive: data.isActive === true,
    };

    if (category) {
      updateAssetCategory(category._id, updatedData);
    } else {
      addAssetCategory(updatedData);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="input"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="">
          <label>Depreciation Method</label>
          <select
            {...register("depreciationMethod", {
              required: "Status is required",
            })}
            className="input w-full"
          >
            <option value="">-- Select Depreciation Methods --</option>
            {asstesDepreciationMethods.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Life Year
          </label>
          <input
            type="number"
            {...register("usefulLifeInYears", {
              required: "Useful Life In Years is required",
            })}
            className="input"
          />
          {errors.usefulLifeInYears && (
            <p className="mt-1 text-sm text-red-600">
              {errors.usefulLifeInYears.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Salvage Value
          </label>
          <input
            type="number"
            {...register("salvageValue", {
              required: "Salvage Value is required",
            })}
            className="input"
          />
          {errors.salvageValue && (
            <p className="mt-1 text-sm text-red-600">
              {errors.salvageValue.message}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select {...register("isActive", {
              required: "Description is required",
            })} className="input">
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register("description")}
            className="input"
            rows={3}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {category ? "Update" : "Add"} Category
        </button>
      </div>
    </form>
  );
};

export default AssetCategoryForm;
