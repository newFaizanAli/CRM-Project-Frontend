import { useForm } from "react-hook-form";
import useAssetLocationStore from "../../../store/asset/asset-locations";
import useDepartmentsStore from "../../../store/departments";
import useEmployeesStore from "../../../store/employee";
import { AssetLocation, AssetLocationFormData } from "../../../utilities/types";

interface AssetLocationFormProps {
  asset_location?: any;
  onClose: () => void;
}

const AssetLocationForm = ({
  asset_location,
  onClose,
}: AssetLocationFormProps) => {
  const { addAssetLocation, updateAssetLocation } = useAssetLocationStore();

  const { departments } = useDepartmentsStore();

  const { employees } = useEmployeesStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssetLocationFormData>({
    defaultValues: asset_location
      ? {
          inCharge: asset_location.inCharge?._id || "",
          department: asset_location.department?._id || "",
          name: asset_location.name || "",
          address: asset_location.address || "",
          isActive: asset_location.isActive || true,
        }
      : {
          inCharge: "",
          name: "",
          department: "",
          isActive: true,
          address: "",
        },
  });

  const onSubmit = (data: AssetLocationFormData) => {
    const fullInCharge = employees.find(
      (e) => String(e._id) === String(data.inCharge)
    );

    const fullDepartment = departments.find(
      (e) => String(e._id) === String(data.department)
    );

    const transformedData: Omit<AssetLocation, "_id"> = {
      ...data,
      inCharge: fullInCharge
        ? {
            _id: String(fullInCharge._id),
            name: fullInCharge.name,
            ID: fullInCharge.ID,
          }
        : null,

      department: fullDepartment
        ? {
            _id: String(fullDepartment._id),
            name: fullDepartment.name,
            ID: fullDepartment.ID,
          }
        : null,
    };

    if (asset_location) {
      updateAssetLocation(asset_location._id!, transformedData);
    } else {
      addAssetLocation(transformedData);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="input w-full"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label>In-Charge</label>
          <select
            {...register("inCharge", { required: "In-charge is required" })}
            className="input w-full"
          >
            <option value="">-- Select Employee --</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.name}
              </option>
            ))}
          </select>
          {errors.inCharge && (
            <p className="text-red-500">{errors.inCharge.message}</p>
          )}
        </div>

        <div>
          <label>Department</label>
          <select
            {...register("department", { required: "Department is required" })}
            className="input w-full"
          >
            <option value="">-- Select Department --</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {`${dept.name} (${dept.ID})`}
              </option>
            ))}
          </select>
          {errors.department && (
            <p className="text-red-500">{errors.department.message}</p>
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


         <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <textarea
            {...register("address")}
            className="input"
            rows={3}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">
              {errors.address.message}
            </p>
          )}
        </div>
        
      </div>

      

      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {asset_location ? "Update" : "Create"} Asset Location
        </button>
      </div>
    </form>
  );
};

export default AssetLocationForm;
