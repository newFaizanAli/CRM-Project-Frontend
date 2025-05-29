import { useForm } from "react-hook-form";
import { AttendanceFormData, Attendance } from "../../../utilities/types";
import useEmployeesStore from "../../../store/employee";
import useAttendanceStore from "../../../store/hr/attendances";
import { attendanceShift, attendanceStatus } from "../../../utilities/const";

interface AttendanceFormProps {
  attendance?: Attendance;
  onClose: () => void;
}

const AttendanceForm = ({ attendance, onClose }: AttendanceFormProps) => {
  const { addAttendance, updateAttendance } = useAttendanceStore();

  const { employees } = useEmployeesStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AttendanceFormData>({
    defaultValues: attendance
      ? {
          date:
            attendance.date?.slice(0, 10) ||
            new Date().toISOString().slice(0, 10),
          employee: attendance.employee?._id || "",
          status: attendance.status || "Present",
          checkInTime: attendance.checkInTime || "",
          checkOutTime: attendance.checkOutTime || "",
          shift: attendance.shift || "General",
          remarks: attendance.remarks || "",
        }
      : {
          date: new Date().toISOString().slice(0, 10),
          employee: "",
          status: "Present",
          checkInTime: "",
          checkOutTime: "",
          shift: "General",
          remarks: "",
        },
  });

  const onSubmit = (data: AttendanceFormData) => {
    const fullEmployee = employees.find(
      (e) => String(e._id) === String(data.employee)
    );

    const transformedData: Omit<Attendance, "_id"> = {
      date: data.date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      remarks: data.remarks || "",
      status: data.status || "Present",
      checkInTime: data.checkInTime || "",
      checkOutTime: data.checkOutTime || "",
      shift: data.shift || "General",
      employee: fullEmployee
        ? { _id: String(fullEmployee._id), name: fullEmployee.name, ID: fullEmployee.ID }
        : null,
    };

    if (attendance) {
      updateAttendance(attendance._id!, transformedData);
    } else {
      addAttendance(transformedData);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label>Date</label>
          <input type="date" {...register("date")} className="input w-full" />
          {errors.date && <p className="text-red-500">{errors.date.message}</p>}
        </div>

        <div>
          <label>Shift </label>
          <select {...register("shift")} className="input w-full">
            <option value="">-- None --</option>
            {attendanceShift.map((shift) => (
              <option key={shift.value} value={shift.value}>
                {shift.label}
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
          <label>Status</label>
          <select
            {...register("status", { required: "Status is required" })}
            className="input w-full"
          >
            {attendanceStatus.map((emp) => (
              <option key={emp.value} value={emp.value}>
                {emp.label}
              </option>
            ))}
          </select>
        </div>

        {/* Check-in Time */}
        <div>
          <label>Check In Time</label>
          <input
            type="time"
            {...register("checkInTime")}
            className="input w-full"
          />
        </div>

        {/* Check-out Time */}
        <div>
          <label>Check Out Time</label>
          <input
            type="time"
            {...register("checkOutTime")}
            className="input w-full"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label>Remarks</label>
          <textarea
            {...register("remarks")}
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
          {attendance ? "Update" : "Create"} Attendance
        </button>
      </div>
    </form>
  );
};

export default AttendanceForm;
