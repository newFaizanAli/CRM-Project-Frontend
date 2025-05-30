import { useForm } from "react-hook-form";
import { Task, TaskInput } from "../utilities/types";
import useProjectsStore from "../store/projects";
import useEmployeesStore from "../store/employee";
import useTasksStore from "../store/tasks";

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
}

const TaskForm = ({ task, onClose }: TaskFormProps) => {
  const { addTask, updateTask } = useTasksStore();
  const { employees } = useEmployeesStore();
  const { projects } = useProjectsStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskInput>({
    defaultValues: task
      ? {
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          status: task.status,
          priority: task.priority,
          assignedTo: task.assignedTo?._id || "",
          project: task.project?._id || "",
        }
      : ({
          title: "",
          description: "",
          dueDate: "",
          status: "pending",
          priority: "medium",
          assignedTo: "",
          project: "",
        } as any),
  });

  const onSubmit = (data: any) => {
    const fullAssignee = employees.find((e) => e._id === data.assignedTo);
    const fullProject = projects.find((d) => d._id === data.project);

    const transformed: TaskInput = {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      status: data.status,
      priority: data.priority,

      assignedTo: fullAssignee
        ? { _id: String(fullAssignee._id), name: fullAssignee.name }
        : null,
      project: fullProject
        ? {
            _id: String(fullProject._id),
            title: fullProject.title,
            ID: fullProject.ID,
          }
        : null,
    };

    if (task) {
      updateTask(task._id, transformed);
    } else {
      addTask(transformed);
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
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Due Date */}
        <div>
          <label>Due Date</label>
          <input
            type="date"
            {...register("dueDate", { required: "Due date is required" })}
            className="input w-full"
          />
          {errors.dueDate && (
            <p className="text-red-500">{errors.dueDate.message}</p>
          )}
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

        {/* projects */}

        <div>
          <label>Project</label>
          <select {...register("project")} className="input w-full">
            <option value="">-- Select Project --</option>
            {projects.map((proj) => (
              <option key={proj._id} value={proj._id}>
                {proj.title}
              </option>
            ))}
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
          {task ? "Update" : "Create"} Task
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
