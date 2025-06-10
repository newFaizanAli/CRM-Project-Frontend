import { useForm } from "react-hook-form";
import {
  WorkstationType,
  WorkstationTypeFormData,
} from "../../../utilities/types";
import useWorkstationTypeStore from "../../../store/manufacturing/workstation-type";

interface WorkstationTypeFormProps {
  work_station?: WorkstationType;
  onClose: () => void;
}

const WorkstationTypeForm = ({
  work_station,
  onClose,
}: WorkstationTypeFormProps) => {
  const { addWorkstationType, updateWorkstationType } =
    useWorkstationTypeStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkstationTypeFormData>({
    defaultValues: work_station
      ? {
          name: work_station.name || "",
          description: work_station.description || "",
          defaultCostPerHour: work_station.defaultCostPerHour || 0,
          isActive: work_station.isActive || true,
        }
      : {
          name: "",
          description: "",
          defaultCostPerHour: 0,
          isActive: true,
        },
  });

  const onSubmit = (data: WorkstationTypeFormData) => {
    const transformedData: Omit<WorkstationType, "_id"> = {
      name: data.name,
      defaultCostPerHour: data.defaultCostPerHour,
      description: data.description,
      isActive: data.isActive,
    };

    if (work_station) {
      updateWorkstationType(work_station._id!, transformedData);
    } else {
      addWorkstationType(transformedData);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label>Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="input w-full"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cost Per Hour
          </label>
          <input
            type="text"
            {...register("defaultCostPerHour")}
            className="input"
          />
          {errors.defaultCostPerHour && (
            <p className="mt-1 text-sm text-red-600">
              {errors.defaultCostPerHour.message}
            </p>
          )}
        </div>

        {/* Active Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            {...register("isActive", { required: "Status is required" })}
            className="input"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

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
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {work_station ? "Update" : "Create"} Type
        </button>
      </div>
    </form>
  );
};

export default WorkstationTypeForm;
