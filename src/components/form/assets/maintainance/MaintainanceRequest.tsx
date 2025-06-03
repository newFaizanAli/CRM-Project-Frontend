import { useForm } from "react-hook-form";
import useMaintenanceTeamStore from "../../../../store/asset/maintainance/maintainance-team";
import useEmployeesStore from "../../../../store/employee";
import useAssetStore from "../../../../store/asset/asset";
import {
  MaintenanceRequest,
  MaintenanceRequestFormData,
} from "../../../../utilities/types";
import useMaintenanceRequestStore from "../../../../store/asset/maintainance/maintainance-request";
import {
  MaintainanceRequestPriority,
  MaintainanceRequestStatus,
} from "../../../../utilities/const";

interface RequestFormProps {
  request?: any;
  onClose: () => void;
}

const MaintenanceRequestForm = ({ request, onClose }: RequestFormProps) => {
  const { addRequest, updateRequest } = useMaintenanceRequestStore();

  const { teams } = useMaintenanceTeamStore();
  const { assets } = useAssetStore();
  const { employees } = useEmployeesStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MaintenanceRequestFormData>({
    defaultValues: request
      ? {
          asset: request.asset?._id || "",
          reportedBy: request.reportedBy?._id || "",
          assignedTo: request.assignedTo?._id || "",
          problemDescription: request.problemDescription || "",
          resolutionNote: request.resolutionNote || "",
          priority: request.priority || "Low",
          status: request.status || "Open",
          requestDate:
            request.requestDate?.slice(0, 10) ||
            new Date().toISOString().split("T")[0],
          closedDate: request.closedDate?.slice(0, 10) || "",
          isActive: request.isActive || true,
        }
      : {
          asset: "",
          reportedBy: "",
          assignedTo: "",
          resolutionNote: "",
          problemDescription: "",
          priority: "Low",
          requestDate: new Date().toISOString().split("T")[0],
          closedDate: "",
          status: "Open",
          isActive: true,
        },
  });

  const onSubmit = (data: MaintenanceRequestFormData) => {
    const fullReportBy = employees.find(
      (e) => String(e._id) === String(data.reportedBy)
    );

    const fullAsset = assets.find((e) => String(e._id) === String(data.asset));

    const fullAssignedTo = teams.find(
      (e) => String(e._id) === String(data.assignedTo)
    );

    const transformedData: Omit<MaintenanceRequest, "_id"> = {
      ...data,
      asset: fullAsset
        ? {
            _id: String(fullAsset._id),
            ID: fullAsset.ID,
          }
        : null,

      reportedBy: fullReportBy
        ? {
            _id: String(fullReportBy._id),
            name: fullReportBy.name,
            ID: fullReportBy.ID,
          }
        : null,

      assignedTo: fullAssignedTo
        ? {
            _id: String(fullAssignedTo._id),
            name: fullAssignedTo.name,
            ID: fullAssignedTo.ID,
          }
        : null,
    };

    if (request) {
      updateRequest(request._id!, transformedData);
    } else {
      addRequest(transformedData);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 h-full">
      <div className="max-h-[70vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Request Date</label>
            <input
              type="date"
              {...register("requestDate", {
                required: "Request date is required",
              })}
              className="input w-full"
            />
            {errors.requestDate && (
              <p className="text-red-500">{errors.requestDate.message}</p>
            )}
          </div>

          <div>
            <label>Closed Date</label>
            <input
              type="date"
              {...register("closedDate", {
                required: "Closed date is required",
              })}
              className="input w-full"
            />
            {errors.closedDate && (
              <p className="text-red-500">{errors.closedDate.message}</p>
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
            <label>Report By</label>
            <select
              {...register("reportedBy", {
                required: "Reported by is required",
              })}
              className="input w-full"
            >
              <option value="">-- Select Report Person --</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.name}
                </option>
              ))}
            </select>
            {errors.reportedBy && (
              <p className="text-red-500">{errors.reportedBy.message}</p>
            )}
          </div>

          <div>
            <label>Assigned To</label>
            <select {...register("assignedTo")} className="input w-full">
              <option value="">-- Select Assigned Person --</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.ID}
                </option>
              ))}
            </select>
            {errors.asset && (
              <p className="text-red-500">{errors.asset.message}</p>
            )}
          </div>

          <div className="">
            <label>Status</label>
            <select {...register("status")} className="input w-full">
              <option value="">-- Select Status --</option>
              {MaintainanceRequestStatus.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          <div className="">
            <label>Priority</label>
            <select
              {...register("priority", {
                required: "Priority is required",
              })}
              className="input w-full"
            >
              <option value="">-- Select Priority --</option>
              {MaintainanceRequestPriority.map((pr) => (
                <option key={pr.value} value={pr.value}>
                  {pr.label}
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
              Problem description
            </label>
            <textarea
              {...register("problemDescription", {
                required: "Probled is required",
              })}
              className="input"
              rows={3}
            />
            {errors.problemDescription && (
              <p className="mt-1 text-sm text-red-600">
                {errors.problemDescription.message}
              </p>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Resolution Note
            </label>
            <textarea
              {...register("resolutionNote")}
              className="input"
              rows={3}
            />
            {errors.resolutionNote && (
              <p className="mt-1 text-sm text-red-600">
                {errors.resolutionNote.message}
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

export default MaintenanceRequestForm;
