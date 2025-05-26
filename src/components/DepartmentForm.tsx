import { useForm } from "react-hook-form";
import { DepartmentFormData, Department } from "../utilities/types";
import useDepartmentsStore from "../store/departments";
import useEmployeesStore from "../store/employee";

interface DepartmentFormProps {
  department?: Department;
  onClose: () => void;
}

const DepartmentForm = ({ department, onClose }: DepartmentFormProps) => {
  const { addDepartment, updateDepartment, departments } =
    useDepartmentsStore();
  const { employees } = useEmployeesStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DepartmentFormData>({
    defaultValues: department
      ? {
          name: department.name || "",
          parentDepartment: department.parentDepartment?._id || "",
          manager: department.manager?._id || "",
          isActive: String(department.isActive) === "true",
          description: department.description || "",
        }
      : {
          name: "",
          parentDepartment: "",
          manager: "",
          isActive: true,
          description: "",
        },
  });

  const onSubmit = (data: DepartmentFormData) => {
    const fullParent = departments.find(
      (d) => d._id === String(data.parentDepartment)
    );
    const fullManager = employees.find(
      (e) => String(e._id) === String(data.manager)
    );

    const transformedData: Omit<Department, "_id"> = {
      name: data.name,
      isActive: String(data.isActive) === "true",
      description: data.description || "",
      parentDepartment: fullParent
        ? { _id: fullParent._id, name: fullParent.name }
        : null,
      manager: fullManager
        ? { _id: String(fullManager._id), name: fullManager.name }
        : null,
    };

    if (department) {
      updateDepartment(department._id!, transformedData);
    } else {
      addDepartment(transformedData);
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

        {/* Parent Department */}
        <div>
          <label>Parent Department (Optional)</label>
          <select {...register("parentDepartment")} className="input w-full">
            <option value="">-- None --</option>
            {departments.map((dep) => (
              <option key={dep._id} value={dep._id}>
                {dep.name}
              </option>
            ))}
          </select>
        </div>

        {/* Manager */}
        <div>
          <label>Manager (Optional)</label>
          <select {...register("manager")} className="input w-full">
            <option value="">-- Select Manager --</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        {/* Active Status */}
        <div>
          <label>Status</label>
          <select {...register("isActive")} className="input w-full">
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
          {department ? "Update" : "Create"} Department
        </button>
      </div>
    </form>
  );
};

export default DepartmentForm;
