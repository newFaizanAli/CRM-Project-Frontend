import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useCategoriesStore from "../store/categories";



interface Category {
  _id: number;
  name: string;
  description: string;
  parentCategory: string | { _id: string; name: string } | null;
  isActive: boolean;
}

interface CategoryFormData {
  name: string;
  description: string;
  parentCategory: string; // will always be a string from the form
  isActive: string; // form receives it as a string ("true"/"false")
}

interface CategoryFormProps {
  category?: Category;
  onClose: () => void;
}


const CategoryForm = ({ category, onClose }: CategoryFormProps) => {
  const { addCategory, updateCategory, categories } = useCategoriesStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    defaultValues: {
      name: "",
      description: "",
      parentCategory: "",
      isActive: "true",
    },
  });

  useEffect(() => {
    if (category) {
      const parentId =
        typeof category.parentCategory === "string"
          ? category.parentCategory
          : category.parentCategory?._id ?? "";

      reset({
        name: category.name,
        description: category.description,
        parentCategory: parentId,
        isActive: category.isActive ? "true" : "false",
      });
    }
  }, [category, reset]);

  const onSubmit = (data: CategoryFormData) => {
    const updatedData = {
      ...data,
      isActive: data.isActive === "true",
    };

    if (category) {
      updateCategory(category._id, updatedData); 
    } else {
      addCategory(updatedData);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="input"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Parent Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Parent Category
          </label>
          <select {...register("parentCategory")} className="input">
            <option value="">Select category</option>
            {categories
              .filter((e) => !category || e._id !== category._id)
              .map((e) => (
                <option key={e._id} value={e._id.toString()}>
                  {e.name}
                </option>
              ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select {...register("isActive")} className="input">
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
            {...register("description", {
              required: "Description is required",
            })}
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

export default CategoryForm;
