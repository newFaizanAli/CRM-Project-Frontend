import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useSalaryStructureStore from "../../../store/payroll/salary-structure";
import useSalaryComponentStore from "../../../store/payroll/salary-compoents";
import {
  SalarySlip,
  SalarySlipFormData,
  SalaryStructureComp,
} from "../../../utilities/types";
import useSalarySlipStore from "../../../store/payroll/salary-slip";
import { salarySlipStatus } from "../../../utilities/const";

interface SalarySlipFormProps {
  salary_slip?: any;
  onClose: () => void;
}

const SalarySlipForm = ({ salary_slip, onClose }: SalarySlipFormProps) => {
  const { addSalarySlip, updateSalarySlip } = useSalarySlipStore();
  const { salaryComponents } = useSalaryComponentStore();
  const { salaryStructures } = useSalaryStructureStore();

  const [salaryStrucData, setSalaryStrucData] = useState<any>(null);

  const [monthDate, setMonthDate] = useState<Date | null>(
    salary_slip?.month ? new Date(`01 ${salary_slip.month} 2000`) : null
  );
  const [yearDate, setYearDate] = useState<Date | null>(
    salary_slip?.year ? new Date(`${salary_slip.year}`) : null
  );

  const initialItems =
    salary_slip?.components?.map((comp: any) => ({
      component: comp.component._id,
      type: comp.type,
      value: comp.value,
      name: comp.name,
      amountType: comp.amountType,
    })) || [];

  const [components, setComponents] =
    useState<SalaryStructureComp[]>(initialItems);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SalarySlipFormData>({
    defaultValues: salary_slip
      ? {
          employee: salary_slip.employee || "",
          baseSallary: salary_slip.baseSallary || 0,
          month: salary_slip.month || "",
          year: salary_slip.year || 0,
          salaryStructure: salary_slip.salaryStructure?._id || "",
          status: salary_slip.status || "Draft",
        }
      : {
          employee: "",
          month: "",
          year: 0,
          baseSallary: 0,
          salaryStructure: "",
          status: "Draft",
        },
  });

  const handleSalaryStructure = () => {
    const selectedStructureId = watch("salaryStructure") as unknown as string;

    if (selectedStructureId) {
      const matched = salaryStructures.find(
        (struc) => struc._id === selectedStructureId
      );

      if (matched) {
        setSalaryStrucData({
          employee: matched.employee?.name || "",
          baseSalary: matched.base || 0,
        });
        setValue("baseSallary", matched.base || 0);
      }
    } else {
      setSalaryStrucData({
        employee: "",
        baseSalary: "",
      });
    }
  };

  const handleAddSalaryComp = (compId: string) => {
    if (!compId) return;
    if (components.find((comp) => comp.component === compId)) return;

    const component = salaryComponents.find((c) => c._id === compId);
    if (!component) return;

    const newComp: SalaryStructureComp = {
      name: component.name,
      amountType: component.amountType,
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

  useEffect(() => {
    if (salary_slip?.salaryStructure) {
      handleSalaryStructure();
    }
  }, []);

  const onSubmit = (data: SalarySlipFormData) => {
    const fullSalaryStructure = salaryStructures.find(
      (e) => String(e._id) === String(data.salaryStructure)
    );

    const transformedData: Omit<SalarySlip, "_id"> = {
      ...data,
      components,
      salaryStructure: fullSalaryStructure
        ? {
            _id: String(fullSalaryStructure._id),
            ID: fullSalaryStructure.ID,
          }
        : null,
    };

    if (salary_slip) {
      updateSalarySlip(salary_slip._id!, transformedData);
    } else {
      addSalarySlip(transformedData);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Salary Structure</label>
          <select
            {...register("salaryStructure", {
              required: "Structure is required",
            })}
            onClick={() => handleSalaryStructure()}
            className="input w-full"
          >
            <option value="">-- Select Structure --</option>
            {salaryStructures.map((structure) => (
              <option key={structure._id} value={structure._id}>
                {structure.ID}
              </option>
            ))}
          </select>
          {errors.salaryStructure && (
            <p className="text-red-500">{errors.salaryStructure.message}</p>
          )}
        </div>

        <div>
          <label>Employee</label>
          <input
            type="text"
            className="input w-full"
            value={salaryStrucData?.employee}
          />
        </div>

        <div>
          <label>Base Salary</label>
          <input
            type="number"
            className="input w-full"
            value={salaryStrucData?.baseSalary}
          />
        </div>

        <div>
          <label>Status</label>
          <select
            {...register("status", {
              required: "Status is required",
            })}
            className="input w-full"
          >
            <option value="">-- Select Status --</option>
            {salarySlipStatus.map((structure) => (
              <option key={structure.value} value={structure.value}>
                {structure.label}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="text-red-500">{errors.status.message}</p>
          )}
        </div>

        <div>
          <label>Salary Month</label>
          <div>
            <DatePicker
              selected={monthDate}
              onChange={(date: Date) => {
                const monthStr = date.toLocaleString("default", {
                  month: "long",
                });
                setMonthDate(date);
                setValue("month", monthStr);
              }}
              showMonthYearPicker
              dateFormat="MMMM"
              placeholderText="Select Month"
              className="input w-full"
            />
          </div>
          <input
            type="hidden"
            {...register("month", { required: "Month is required" })}
          />
          {errors.month && (
            <p className="text-red-500">{errors.month.message}</p>
          )}
        </div>

        <div>
          <label>Salary Year</label>
          <div>
            <DatePicker
              selected={yearDate}
              onChange={(date: Date) => {
                const yearNum = date.getFullYear();
                setYearDate(date);
                setValue("year", yearNum);
              }}
              showYearPicker
              dateFormat="yyyy"
              placeholderText="Select Year"
              className="input w-full"
            />
          </div>
          <input
            type="hidden"
            {...register("year", {
              required: "Year is required",
              min: { value: 2000, message: "Min year is 2000" },
              max: { value: 2100, message: "Max year is 2100" },
            })}
          />
          {errors.year && <p className="text-red-500">{errors.year.message}</p>}
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
        <table className="w-full table-auto border mt-4 text-center">
          <thead>
            <tr className="bg-gray-100">
              <th>Code</th>
              <th>Name</th>
              <th>Type</th>
              <th>Amount-Type</th>
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
                  <td>{component?.name || ""}</td>
                  <td>{component?.type || ""}</td>
                  <td>{component?.amountType || ""}</td>
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

      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {salary_slip ? "Update" : "Create"} Salary Slip
        </button>
      </div>
    </form>
  );
};

export default SalarySlipForm;
