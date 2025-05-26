import { useForm } from "react-hook-form";
import { Project, ProjectInput } from "../utilities/types";
import useProjectsStore from "../store/projects"; 
import useEmployeesStore from "../store/employee";
import useDepartmentsStore from "../store/departments";

interface ProjectFormProps {
  project?: Project;
  onClose: () => void;
}

const ProjectForm = ({ project, onClose }: ProjectFormProps) => {
  const { addProject, updateProject } = useProjectsStore();
  const { employees } = useEmployeesStore();
  const { departments } = useDepartmentsStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectInput>({
    defaultValues: project
      ? {
          title: project.title,
          description: project.description,
          dueDate: project.dueDate,
          status: project.status,
          priority: project.priority,
          assignedTo: project.assignedTo?._id || "",
          department: project.department?._id || "",
          type: project.type,
        }
      : {
          title: "",
          description: "",
          dueDate: "",
          status: "pending",
          priority: "medium",
          assignedTo: "",
          department: "",
          type: "other",
        } as any,
  });

  const onSubmit = (data: any) => {
    const fullAssignee = employees.find((e) => e._id === data.assignedTo);
    const fullDepartment = departments.find((d) => d._id === data.department);

    const transformed: Omit<Project, "_id"> = {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      status: data.status,
      priority: data.priority,
      type: data.type,
      assignedTo: fullAssignee
        ? { _id: String(fullAssignee._id), name: fullAssignee.name }
        : null,
      department: fullDepartment
        ? { _id: String(fullDepartment._id), name: fullDepartment.name }
        : null,
    };

    if (project) {
      updateProject(project._id, transformed);
    } else {
      addProject(transformed);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div>
          <label>Title</label>
          <input
            {...register("title", { required: "Title is required" })}
            className="input w-full"
          />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        </div>

        {/* Due Date */}
        <div>
          <label>Due Date</label>
          <input
            type="date"
            {...register("dueDate", { required: "Due date is required" })}
            className="input w-full"
          />
          {errors.dueDate && <p className="text-red-500">{errors.dueDate.message}</p>}
        </div>

        {/* Status */}
        <div>
          <label>Status</label>
          <select {...register("status")} className="input w-full">
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label>Priority</label>
          <select {...register("priority")} className="input w-full">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>


         {/* Type */}
        <div>
          <label>Project Type</label>
          <select {...register("type")} className="input w-full">
            <option value="external">External</option>
            <option value="internal">Internal</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Assigned To */}
        <div>
          <label>Assigned To</label>
          <select {...register("assignedTo")} className="input w-full">
            <option value="">-- Select Employee --</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        {/* Department */}
        <div>
          <label>Department</label>
          <select {...register("department")} className="input w-full">
            <option value="">-- Select Department --</option>
            {departments.map((dep) => (
              <option key={dep._id} value={dep._id}>
                {dep.name}
              </option>
            ))}
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
          {project ? "Update" : "Create"} Project
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
