import { useForm } from "react-hook-form";
import useWorkstationTypeStore from "../../../store/manufacturing/workstation-type";
import { Workstation, WorkstationFormData } from "../../../utilities/types";
import useWorkstationStore from "../../../store/manufacturing/workstations";

interface WorkstationFormProps {
  workstation?: Workstation;
  onClose: () => void;
}

const WorkstationForm = ({ workstation, onClose }: WorkstationFormProps) => {
  const { addWorkstation, updateWorkstation } = useWorkstationStore();

  const { workstationTypes } = useWorkstationTypeStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkstationFormData>({
    defaultValues: workstation
      ? {
          name: workstation.name || "",
          type: workstation.type?._id || "",
          description: workstation.description || "",
          location: workstation.location || "",
          capacityPerHour: workstation.capacityPerHour || 0,
          costPerHour: workstation.costPerHour || 0,
          isActive: workstation.isActive || true,
          remarks: workstation.remarks || "",
        }
      : {
          name: "",
          type: "",
          description: "",
          location: "",
          capacityPerHour: 0,
          costPerHour: 0,
          isActive: true,
          remarks: "",
        },
  });

  const onSubmit = (data: WorkstationFormData) => {
    const fullType = workstationTypes.find(
      (e) => String(e._id) === String(data.type)
    );

    const transformedData: Omit<Workstation, "_id"> = {
      name: data.name || "",
      remarks: data.remarks || "",
      description: data.description || "",
      location: data.location || "",
      capacityPerHour: data.capacityPerHour || 0,
      costPerHour: data.costPerHour || 0,
      isActive: data.isActive || true,
      type: fullType
        ? {
            _id: String(fullType._id),
            name: fullType.name,
          }
        : null,
    };

    if (workstation) {
      updateWorkstation(workstation._id!, transformedData);
    } else {
      addWorkstation(transformedData);
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
            type="text"
            {...register("name", { required: "Name is required" })}
            className="input w-full"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        {/* Type */}
        <div>
          <label>Workstation Type</label>
          <select
            {...register("type", { required: "Type is required" })}
            className="input w-full"
          >
            <option value="">-- Select Type --</option>
            {workstationTypes.map((type) => (
              <option key={type._id} value={type._id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Cost per Hour */}
        <div>
          <label>Cost Per Hour</label>
          <input
            type="text"
            {...register("costPerHour")}
            className="input w-full"
          />
          {errors.costPerHour && (
            <p className="text-red-500">{errors.costPerHour.message}</p>
          )}
        </div>

        {/* capacityPerHour */}
        <div>
          <label>Capacity Per Hour</label>
          <input
            type="text"
            {...register("capacityPerHour")}
            className="input w-full"
          />
          {errors.capacityPerHour && (
            <p className="text-red-500">{errors.capacityPerHour.message}</p>
          )}
        </div>

        {/* location */}
        <div>
          <label>Location</label>
          <input
            type="text"
            {...register("location")}
            className="input w-full"
          />
          {errors.location && (
            <p className="text-red-500">{errors.location.message}</p>
          )}
        </div>

        {/* status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            {...register("isActive", {
              required: "Active is required",
            })}
            className="input"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Remarks */}
        <div className="md:col-span-2">
          <label>Remarks</label>
          <textarea
            {...register("remarks")}
            className="input w-full"
            rows={3}
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label>Description</label>
          <textarea
            {...register("description")}
            className="input w-full"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {workstation ? "Update" : "Create"} Workstation
        </button>
      </div>
    </form>
  );
};

export default WorkstationForm;
