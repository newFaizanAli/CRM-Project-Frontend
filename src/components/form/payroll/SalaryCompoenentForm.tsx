import { useForm } from "react-hook-form";
import {
  SalaryComponent,
  SalaryComponentFormData,
} from "../../../utilities/types";
import useSalaryComponentStore from "../../../store/payroll/salary-compoents";
import {
  salaryCompAmountTypes,
  salaryCompTypes,
  salaryCompEarningType,
  salaryCompDeductionType,
} from "../../../utilities/const";

interface SalaryComponentFormProps {
  salary_component?: SalaryComponent;
  onClose: () => void;
}

const SalaryComponentForm = ({
  salary_component,
  onClose,
}: SalaryComponentFormProps) => {
  const { addSalaryComponent, updateSalaryComponent } =
    useSalaryComponentStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SalaryComponentFormData>({
    defaultValues: salary_component
      ? {
          name: salary_component.name || "",
          type: salary_component.type || "Earning",
          amountType: salary_component.amountType || "Percentage",
          value: salary_component.value || 0,
          isActive: salary_component.isActive || true,
          description: salary_component.description || "",
        }
      : {
          name: "",
          type: "Earning",
          amountType: "Percentage",
          value: 0,
          isActive: true,
          description: "",
        },
  });

  const selectedType = watch("type");

  const onSubmit = (data: SalaryComponentFormData) => {
    const transformedData: Omit<SalaryComponent, "_id"> = {
      name: data.name,
      type: data.type,
      isActive: data.isActive === true,
      amountType: data.amountType,
      value: Number(data.value),
      description: data.description,
    };

    if (salary_component) {
      updateSalaryComponent(salary_component._id!, transformedData);
    } else {
      addSalaryComponent(transformedData);
    }

    onClose();
  };

  const nameOptions =
    selectedType === "Earning"
      ? salaryCompEarningType
      : selectedType === "Deduction"
      ? salaryCompDeductionType
      : [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Type */}
        <div>
          <label>Type</label>
          <select {...register("type")} className="input w-full">
            <option value="">-- None --</option>
            {salaryCompTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div>
          <label>Name</label>
          <select {...register("name", { required: "Name is required" })} className="input w-full">
            <option value="">-- Select Component Name --</option>
            {nameOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        {/* Amount Type */}
        <div>
          <label>Amount Type</label>
          <select {...register("amountType")} className="input w-full">
            <option value="">-- Select Amount Type --</option>
            {salaryCompAmountTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Value */}
        <div>
          <label>Value</label>
          <input
            type="number"
            {...register("value", { required: "Value is required" })}
            className="input w-full"
          />
          {errors.value && <p className="text-red-500">{errors.value.message}</p>}
        </div>

        {/* Status */}
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

      {/* Buttons */}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {salary_component ? "Update" : "Create"} Salary Component
        </button>
      </div>
    </form>
  );
};

export default SalaryComponentForm;
