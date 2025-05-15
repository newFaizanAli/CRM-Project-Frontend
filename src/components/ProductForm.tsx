import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useCategoriesStore from "../store/categories";
import useProductsStore from "../store/products";
import { unitTypes } from "../utilities/const";
import { Product } from "../utilities/types";


interface ProductFormData {
  name: string;
  itemCode: string;
  description: string;
  unit: string;
  brand: string;
  costPrice: number;
  sellingPrice: number;
  isStockItem: boolean;
  hasBatch: boolean;
  hasSerial: boolean;
  isActive: boolean;
  category: string;
}

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
}

const ProductForm = ({ product, onClose }: ProductFormProps) => {
  const { addProduct, updateProduct } = useProductsStore();
  const { categories } = useCategoriesStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      itemCode: "",
      description: "",
      unit: "",
      brand: "",
      costPrice: 0,
      sellingPrice: 0,
      isStockItem: true,
      hasBatch: false,
      hasSerial: false,
      isActive: true,
      category: "",
    },
  });

  useEffect(() => {
    if (product) {
      const categoryId =
        typeof product.category === "string"
          ? product.category
          : product.category?._id ?? "";

      reset({
        name: product.name,
        itemCode: product.itemCode,
        description: product.description,
        category: categoryId,
        isActive: product.isActive,
        unit: product.unit,
        brand: product.brand,
        costPrice: product.costPrice,
        sellingPrice: product.sellingPrice,
        isStockItem: product.isStockItem,
        hasBatch: product.hasBatch,
        hasSerial: product.hasSerial,
      });
    }
  }, [product, reset]);

  const onSubmit = (data: ProductFormData) => {
    if (product) {
      updateProduct(product._id, data);
    } else {
      addProduct(data);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            {...register("name", { required: "Product name is required" })}
            className="input"
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Item Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Item Code
          </label>
          <input
            type="text"
            {...register("itemCode", { required: "Item code is required" })}
            className="input"
          />
          {errors.itemCode && (
            <p className="text-sm text-red-600">{errors.itemCode.message}</p>
          )}
        </div>

        {/* Unit */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Unit
          </label>
          <select
            {...register("unit", { required: "Unit is required" })}
            className="input"
          >
            <option value="">Select unit</option>
            {unitTypes.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
          {errors.unit && (
            <p className="text-sm text-red-600">{errors.unit.message}</p>
          )}
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Brand
          </label>
          <input type="text" {...register("brand")} className="input" />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>

          <select {...register("category")} className="input">
            <option value="">Select category</option>

            {categories.map((e) => (
              <option key={e._id} value={e._id.toString()}>
                {e.name}
              </option>
            ))}
          </select>

          {errors.category && (
            <p className="text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        {/* Cost Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cost Price
          </label>
          <input
            type="number"
            step="0.01"
            {...register("costPrice", { valueAsNumber: true })}
            className="input"
          />
        </div>

        {/* Selling Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Selling Price
          </label>
          <input
            type="number"
            step="0.01"
            {...register("sellingPrice", { valueAsNumber: true })}
            className="input"
          />
        </div>

        {/* Stock Item */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stock Item
          </label>
          <select
            {...register("isStockItem", { valueAsNumber: true })}
            className="input"
          >
            <option value={'true'}>Yes</option>
            <option value={'false'}>No</option>
          </select>
        </div>

        {/* Has Batch */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Has Batch
          </label>
          <input type="checkbox" {...register("hasBatch")} className="ml-2" />
        </div>

        {/* Has Serial */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Has Serial
          </label>
          <input type="checkbox" {...register("hasSerial")} className="ml-2" />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
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
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {product ? "Update" : "Add"} Product
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
