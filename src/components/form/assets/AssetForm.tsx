import { useForm } from "react-hook-form";
import useAssetLocationStore from "../../../store/asset/asset-locations";
import { Asset, AssetFormData } from "../../../utilities/types";
import useAssetStore from "../../../store/asset/asset";
import useAssetCategoryStore from "../../../store/asset/asset-category";
import useSupplierStore from "../../../store/suppliers";
import { asstesStatus } from "../../../utilities/const";

interface AssetFormProps {
  assets?: any;
  onClose: () => void;
}

const AssetForm = ({ assets, onClose }: AssetFormProps) => {
  const { addAsset, updateAsset } = useAssetStore();

  const { assetCategories } = useAssetCategoryStore();
  const { assetLocations } = useAssetLocationStore();
  const { suppliers } = useSupplierStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssetFormData>({
    defaultValues: assets
      ? {
          category: assets.category?._id || "",
          vendor: assets.vendor?._id || "",
          name: assets.name || "",
          location: assets.location?._id || "",
          purchaseDate:
            assets.purchaseDate?.slice(0, 10) ||
            new Date().toISOString().split("T")[0],
          purchaseCost: assets.purchaseCost || 0,
          currentValue: assets.currentValue || 0,
          status: assets.status || "In Use",
          warrantyExpiry:  assets.warrantyExpiry?.slice(0, 10) || "",
          notes: assets.notes || "",
          isActive: assets.isActive || true,
        }
      : {
          vendor: "",
          name: "",
          category: "",
          location: "",
          purchaseDate: new Date().toISOString().split("T")[0],
          purchaseCost: 0,
          currentValue: 0,
          status: "In Use",
          warrantyExpiry: "",
          isActive: true,
          notes: "",
        },
  });

  const onSubmit = (data: AssetFormData) => {
    const fullVendor = suppliers.find(
      (e) => String(e._id) === String(data.vendor)
    );

    const fullCategory = assetCategories.find(
      (e) => String(e._id) === String(data.category)
    );

    const fullLocation = assetLocations.find(
      (e) => String(e._id) === String(data.location)
    );

    const transformedData: Omit<Asset, "_id"> = {
      ...data,
      vendor: fullVendor
        ? {
            _id: String(fullVendor._id),
            name: fullVendor.name,
            ID: fullVendor.ID,
          }
        : null,

      category: fullCategory
        ? {
            _id: String(fullCategory._id),
            name: fullCategory.name,
            ID: fullCategory.ID,
          }
        : null,

      location: fullLocation
        ? {
            _id: String(fullLocation._id),
            name: fullLocation.name,
            ID: fullLocation.ID,
          }
        : null,
    };

    if (assets) {
      updateAsset(assets._id!, transformedData);
    } else {
      addAsset(transformedData);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 h-full">
      <div className="max-h-[70vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="input w-full"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label>Purchase Date</label>
            <input
              type="date"
              {...register("purchaseDate", {
                required: "Purchase Date is required",
              })}
              className="input w-full"
            />
            {errors.purchaseDate && (
              <p className="text-red-500">{errors.purchaseDate.message}</p>
            )}
          </div>

          <div>
            <label>Purchase Cost</label>
            <input
              type="number"
              {...register("purchaseCost", {
                required: "Purchase Cost is required",
              })}
              className="input w-full"
            />
            {errors.purchaseCost && (
              <p className="text-red-500">{errors.purchaseCost.message}</p>
            )}
          </div>

          <div>
            <label>Current Value</label>
            <input
              type="number"
              {...register("currentValue")}
              className="input w-full"
            />
            {errors.currentValue && (
              <p className="text-red-500">{errors.currentValue.message}</p>
            )}
          </div>

          <div>
            <label>Warranty Expiry</label>
            <input
              type="date"
              {...register("warrantyExpiry")}
              className="input w-full"
            />
            {errors.warrantyExpiry && (
              <p className="text-red-500">{errors.warrantyExpiry.message}</p>
            )}
          </div>

          <div>
            <label>Vendor</label>
            <select {...register("vendor")} className="input w-full">
              <option value="">-- Select Vendor --</option>
              {suppliers.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.name}
                </option>
              ))}
            </select>
            {errors.vendor && (
              <p className="text-red-500">{errors.vendor.message}</p>
            )}
          </div>

          <div>
            <label>Location</label>
            <select
              {...register("location", { required: "Location is required" })}
              className="input w-full"
            >
              <option value="">-- Select Location --</option>
              {assetLocations.map((loc) => (
                <option key={loc._id} value={loc._id}>
                  {`${loc.name} (${loc.ID})`}
                </option>
              ))}
            </select>
            {errors.location && (
              <p className="text-red-500">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label>Category</label>
            <select
              {...register("category", { required: "Category is required" })}
              className="input w-full"
            >
              <option value="">-- Select Category --</option>
              {assetCategories.map((categ) => (
                <option key={categ._id} value={categ._id}>
                  {`${categ.name} (${categ.ID})`}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500">{errors.category.message}</p>
            )}
          </div>

          <div className="">
            <label>Status</label>
            <select {...register("status")} className="input w-full">
              <option value="">-- Select Status --</option>
              {asstesStatus.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Is Active
            </label>
            <select {...register("isActive")} className="input">
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea {...register("notes")} className="input" rows={3} />
            {errors.notes && (
              <p className="mt-1 text-sm text-red-600">
                {errors.notes.message}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {assets ? "Update" : "Create"} Asset
        </button>
      </div>
    </form>
  );
};

export default AssetForm;
