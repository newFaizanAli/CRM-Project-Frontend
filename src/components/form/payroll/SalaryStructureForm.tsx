import { useForm } from "react-hook-form";
import { useState } from "react";
import useSalaryStructureStore from "../../../store/payroll/salary-structure";
import useSalaryComponentStore from "../../../store/payroll/salary-compoents";
import useEmployeesStore from "../../../store/employee";
import {
  SalaryStructure,
  SalaryStructureComp,
  SalaryStructureFormData,
} from "../../../utilities/types";

interface SalaryStructureFormProps {
  salary_structure?: any;
  onClose: () => void;
}

const SalaryStructureForm = ({
  salary_structure,
  onClose,
}: SalaryStructureFormProps) => {
  const { addSalaryStructure, updateSalaryStructure } =
    useSalaryStructureStore();
  const { salaryComponents } = useSalaryComponentStore();
  const { employees } = useEmployeesStore();

  const initialItems =
    salary_structure?.components?.map((comp: any) => ({
      component: comp.component._id,
      type: comp.type,
      value: comp.value,
    })) || [];

  const [components, setComponents] =
    useState<SalaryStructureComp[]>(initialItems);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SalaryStructureFormData>({
    defaultValues: salary_structure
      ? {
          employee: salary_structure.employee?._id || "",
          name: salary_structure.name || "",
          base: salary_structure.base || 0,
          isActive: salary_structure.isActive || true,
          effectiveFrom:
            salary_structure.fromDate?.slice(0, 10) ||
            new Date().toISOString().slice(0, 10),
          remarks: salary_structure.remarks || "",
        }
      : {
          employee: "",
          name: "",
          base: 0,
          isActive: true,
          effectiveFrom: new Date().toISOString().slice(0, 10),
          remarks: "",
        },
  });

  const handleAddSalaryComp = (compId: string) => {
    if (components.find((comp) => comp.component === compId)) return;

    const component = salaryComponents.find((c) => c._id === compId);
    if (!component) return;

    const newComp: SalaryStructureComp = {
      component: component._id,
      value: component.value,
      type: component.type,
      ID: component.ID,
    };
    setComponents([...components, newComp]);
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...components];
    updated.splice(index, 1);
    setComponents(updated);
  };

  const onSubmit = (data: SalaryStructureFormData) => {
    const fullEmployee = employees.find(
      (e) => String(e._id) === String(data.employee)
    );

    const transformedData: Omit<SalaryStructure, "_id"> = {
      ...data,
      components,
      effectiveFrom: data.effectiveFrom?.slice(0, 10),
      employee: fullEmployee
        ? {
            _id: String(fullEmployee._id),
            name: fullEmployee.name,
          }
        : null,
    };

    if (salary_structure) {
      updateSalaryStructure(salary_structure._id!, transformedData);
    } else {
      addSalaryStructure(transformedData);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="input w-full"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label>Employee</label>
          <select
            {...register("employee", { required: "Employee is required" })}
            className="input w-full"
          >
            <option value="">-- Select Employee --</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.name}
              </option>
            ))}
          </select>
          {errors.employee && (
            <p className="text-red-500">{errors.employee.message}</p>
          )}
        </div>

        <div>
          <label>Effective From</label>
          <input
            type="date"
            {...register("effectiveFrom", {
              required: "effective from is required",
            })}
            className="input w-full"
          />
          {errors.effectiveFrom && (
            <p className="text-red-500">{errors.effectiveFrom.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label>Select Salary Component</label>
          <select
            onChange={(e) => handleAddSalaryComp(e.target.value)}
            className="input w-full"
          >
            <option value="">-- Select Component --</option>
            {salaryComponents.map((compoent) => (
              <option key={compoent._id} value={compoent._id}>
                {compoent.ID}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full table-auto border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th>Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {components.map((comp, index) => {
              const component = salaryComponents.find(
                (p) => p._id === comp.component
              );
              return (
                <tr key={index} className="border-t">
                  <td>{component?.ID || ""}</td>
                  <td>{component?.type || ""}</td>
                  <td>{component?.value || ""}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Base</label>
          <input type="number" {...register("base")} className="input w-full" />
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
          <label>Remarks</label>
          <textarea
            {...register("remarks")}
            className="input w-full"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {salary_structure ? "Update" : "Create"} Salary Strcutre
        </button>
      </div>
    </form>
  );
};

export default SalaryStructureForm;
