import { useForm } from "react-hook-form";
import useOperationStore from "../../../store/manufacturing/operations";
import useWorkstationStore from "../../../store/manufacturing/workstations";
import { Operation, OperationFormData } from "../../../utilities/types";

interface OperationFormProps {
  operation?: Operation;
  onClose: () => void;
}

const OperationForm = ({ operation, onClose }: OperationFormProps) => {
  const { addOperation, updateOperation } = useOperationStore();

  const { workstations } = useWorkstationStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OperationFormData>({
    defaultValues: operation
      ? {
          name: operation.name || "",
          workstation: operation.workstation?._id || "",
          defaultTimeInMinutes: operation.defaultTimeInMinutes || 0,
          costPerHour: operation.costPerHour || 0,
          description: operation.description || "",
          isActive: operation.isActive || true,
        }
      : {
          name: "",
          workstation: "",
          description: "",
          defaultTimeInMinutes: 0,
          costPerHour: 0,
          isActive: true,
        },
  });

  const onSubmit = (data: OperationFormData) => {
    const fullWorkstation = workstations.find(
      (e) => String(e._id) === String(data.workstation)
    );

    const transformedData: Omit<Operation, "_id"> = {
      name: data.name || "",
      description: data.description || "",
      costPerHour: data.costPerHour || 0,
      isActive: data.isActive || true,
      defaultTimeInMinutes: data.defaultTimeInMinutes || 0,
      workstation: fullWorkstation
        ? {
            _id: String(fullWorkstation._id),
            name: fullWorkstation.name,
            ID: fullWorkstation.ID,
          }
        : null,
    };

    if (operation) {
      updateOperation(operation._id!, transformedData);
    } else {
      addOperation(transformedData);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label>Name</label>
          <input type="text" {...register("name")} className="input w-full" />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        {/* Type */}
        <div>
          <label>Workstation</label>
          <select
            {...register("workstation", { required: "Workstation is required" })}
            className="input w-full"
          >
            <option value="">-- Select Workstation --</option>
            {workstations.map((type) => (
              <option key={type._id} value={type._id}>
                {type.name}
              </option>
            ))}
          </select>
             {errors.workstation && (
            <p className="text-red-500">{errors.workstation.message}</p>
          )}
        </div>

        {/* capacityPerHour */}
        <div>
          <label>Cost Per Hour</label>
          <input
            type="number"
            {...register("costPerHour")}
            className="input w-full"
          />
          {errors.costPerHour && (
            <p className="text-red-500">{errors.costPerHour.message}</p>
          )}
        </div>

        {/* defaultTimeInMinutes */}
        <div>
          <label>Default Time in Minutes</label>
          <input
            type="number"
            {...register("defaultTimeInMinutes" , { required: "defualt minutes is required" })}
            className="input w-full"
          />
          {errors.defaultTimeInMinutes && (
            <p className="text-red-500">
              {errors.defaultTimeInMinutes.message}
            </p>
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
          {operation ? "Update" : "Create"} Operation
        </button>
      </div>
    </form>
  );
};

export default OperationForm;
