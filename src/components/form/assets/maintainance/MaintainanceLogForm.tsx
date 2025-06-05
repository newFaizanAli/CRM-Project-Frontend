import { useForm } from "react-hook-form";
import {
  MaintenanceLog,
  MaintenanceLogFormData,
} from "../../../../utilities/types";
import useMaintenanceTeamStore from "../../../../store/asset/maintainance/maintainance-team";
import useAssetStore from "../../../../store/asset/asset";
import { MaintainanceLogTypes } from "../../../../utilities/const";
import useMaintenanceLogStore from "../../../../store/asset/maintainance/maintainance-log";

interface LogFormProps {
  main_log?: any;
  onClose: () => void;
}

const MaintenanceLogForm = ({ main_log, onClose }: LogFormProps) => {
  const { addLog, updateLog } = useMaintenanceLogStore();

  const { teams } = useMaintenanceTeamStore();
  const { assets } = useAssetStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MaintenanceLogFormData>({
    defaultValues: main_log
      ? {
          asset: main_log.asset?._id || "",
          performedBy: main_log.performedBy?._id || "",
          description: main_log.description || "",
          notes: main_log.notes || "",
          type: main_log.type || "Corrective",
          maintenanceDate:
            main_log.maintenanceDate?.slice(0, 10) ||
            new Date().toISOString().split("T")[0],
          cost: main_log.cost || 0,
        }
      : {
          asset: "",
          performedBy: "",
          description: "",
          notes: "",
          type: "Corrective",
          maintenanceDate: new Date().toISOString().split("T")[0],
          cost: 0,
        },
  });

  const onSubmit = (data: MaintenanceLogFormData) => {
    const fullAsset = assets.find((e) => String(e._id) === String(data.asset));

    const fullPerformedBy = teams.find(
      (e) => String(e._id) === String(data.performedBy)
    );

    const transformedData: Omit<MaintenanceLog, "_id"> = {
      ...data,
      asset: fullAsset
        ? {
            _id: String(fullAsset._id),
            ID: fullAsset.ID,
          }
        : null,

      performedBy: fullPerformedBy
        ? {
            _id: String(fullPerformedBy._id),
            name: fullPerformedBy.name,
            ID: fullPerformedBy.ID,
          }
        : null,
    };

    if (main_log) {
      updateLog(main_log._id!, transformedData);
    } else {
      addLog(transformedData);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 h-full">
      <div className="max-h-[70vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Maintenance Date</label>
            <input
              type="date"
              {...register("maintenanceDate", {
                required: "Mintenance date is required",
              })}
              className="input w-full"
            />
            {errors.maintenanceDate && (
              <p className="text-red-500">{errors.maintenanceDate.message}</p>
            )}
          </div>

          <div>
            <label>Asset</label>
            <select
              {...register("asset", {
                required: "Asset is required",
              })}
              className="input w-full"
            >
              <option value="">-- Select Asset --</option>
              {assets.map((asset) => (
                <option key={asset._id} value={asset._id}>
                  {asset.ID}
                </option>
              ))}
            </select>
            {errors.asset && (
              <p className="text-red-500">{errors.asset.message}</p>
            )}
          </div>

          <div>
            <label>Perform By By</label>
            <select
              {...register("performedBy", {
                required: "Perform by is required",
              })}
              className="input w-full"
            >
              <option value="">-- Select Performed Team --</option>
              {teams.map((tm) => (
                <option key={tm._id} value={tm._id}>
                  {tm.name}
                </option>
              ))}
            </select>
            {errors.performedBy && (
              <p className="text-red-500">{errors.performedBy.message}</p>
            )}
          </div>

          <div>
            <label>Cost</label>
            <input
              type="number"
              {...register("cost", { required: "Cost is required" })}
              className="input w-full"
            />
            {errors.cost && (
              <p className="text-red-500">{errors.cost.message}</p>
            )}
          </div>

          <div className="">
            <label>Type</label>
            <select {...register("type")} className="input w-full">
              <option value="">-- Select Type --</option>
              {MaintainanceLogTypes.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              description
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
          {main_log ? "Update" : "Create"} Log
        </button>
      </div>
    </form>
  );
};

export default MaintenanceLogForm;
