import { useForm } from "react-hook-form";
import { Leave, LeaveFormData } from "../../../utilities/types";
import useEmployeesStore from "../../../store/employee";
import { leavesStatus, leavesTypes } from "../../../utilities/const";
import useLeaveStore from "../../../store/hr/leaves";

interface LeaveFormProps {
  leave?: Leave;
  onClose: () => void;
}

const LeaveForm = ({ leave, onClose }: LeaveFormProps) => {
  const { addLeave, updateLeave } = useLeaveStore();

  const { employees } = useEmployeesStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeaveFormData>({
    defaultValues: leave
      ? {
          applicationDate:
            leave.applicationDate?.slice(0, 10) ||
            new Date().toISOString().slice(0, 10),
          fromDate:
            leave.fromDate?.slice(0, 10) ||
            new Date().toISOString().slice(0, 10),
          toDate: leave.toDate?.slice(0, 10) || "",
          employee: leave.employee?._id || "",
          status: leave.status || "Pending",
          leaveType: leave.leaveType || "Casual",
          reason: leave.reason || "",
        }
      : {
          employee: "",
          status: "Pending",
          leaveType: "Casual",
          reason: "",

          applicationDate: new Date().toISOString().slice(0, 10),
          fromDate: new Date().toISOString().slice(0, 10),
          toDate: "",
        },
  });

  const onSubmit = (data: LeaveFormData) => {
    const fullEmployee = employees.find(
      (e) => String(e._id) === String(data.employee)
    );

    const transformedData: Omit<Leave, "_id"> = {
      status: leave ? leave.status : data.status,
      leaveType: leave ? leave.leaveType : data.leaveType,
      reason: leave ? leave.reason : data.reason,
      applicationDate: data.applicationDate?.slice(0, 10),
      fromDate: data.fromDate?.slice(0, 10),
      toDate: data.toDate?.slice(0, 10),
      employee: fullEmployee
        ? {
            _id: String(fullEmployee._id),
            name: fullEmployee.name,
            ID: fullEmployee.ID,
          }
        : null,
    };

    if (leave) {
      updateLeave(leave._id!, transformedData);
    } else {
      addLeave(transformedData);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date */}
        <div>
          <label>Appication Date</label>
          <input
            type="date"
            {...register("applicationDate")}
            className="input w-full"
          />
          {errors.applicationDate && (
            <p className="text-red-500">{errors.applicationDate.message}</p>
          )}
        </div>

        <div>
          <label>From date</label>
          <input
            type="date"
            {...register("fromDate")}
            className="input w-full"
          />
          {errors.fromDate && (
            <p className="text-red-500">{errors.fromDate.message}</p>
          )}
        </div>

        <div>
          <label>To date</label>
          <input type="date" {...register("toDate")} className="input w-full" />
          {errors.toDate && (
            <p className="text-red-500">{errors.toDate.message}</p>
          )}
        </div>

        <div>
          <label>Status </label>
          <select {...register("status")} className="input w-full">
            <option value="">-- None --</option>
            {leavesStatus.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Employee */}
        <div>
          <label>Employee</label>
          <select
            {...register("employee", { required: "Employee is required" })}
            className="input w-full"
          >
            <option value="">-- Select Employee --</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Type</label>
          <select
            {...register("leaveType", { required: "Type is required" })}
            className="input w-full"
          >
            {leavesTypes.map((tp) => (
              <option key={tp.value} value={tp.value}>
                {tp.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label>Reason</label>
          <textarea {...register("reason")} className="input w-full" rows={3} />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {leave ? "Update" : "Create"} Leave
        </button>
      </div>
    </form>
  );
};

export default LeaveForm;
