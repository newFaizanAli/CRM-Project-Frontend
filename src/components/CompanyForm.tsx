import { useForm } from "react-hook-form";
import { CompanyFormData, Company } from "../utilities/types";
import useCompaniesStore from "../store/companies";

interface CompanyFormProps {
  company?: Company;
  onClose: () => void;
}

const CompanyForm = ({ company, onClose }: CompanyFormProps) => {
  const { addCompany, updateCompany, companies } = useCompaniesStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>({
    defaultValues: company
      ? {
          name: company.name || "",
          parentCompany: company.parentCompany?._id || "",
          isActive: String(company.isActive) === "true",
        }
      : {
          name: "",
          parentCompany: "",
          isActive: true,
        },
  });

  const onSubmit = (data: CompanyFormData) => {
    const fullParent = companies.find(
      (d) => d._id === String(data.parentCompany)
    );

    const transformedData: Omit<Company, "_id"> = {
      name: data.name,
      isActive: String(data.isActive) === "true",

      parentCompany: fullParent
        ? { _id: fullParent._id, name: fullParent.name }
        : null,
    };

    if (company) {
      updateCompany(company._id!, transformedData);
    } else {
      addCompany(transformedData);
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

        {/* Parent Company */}
        <div>
          <label>Parent Company (Optional)</label>
          <select {...register("parentCompany")} className="input w-full">
            <option value="">-- None --</option>
            {companies.map((dep) => (
              <option key={dep._id} value={dep._id}>
                {dep.name}
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
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {company ? "Update" : "Create"} Company
        </button>
      </div>
    </form>
  );
};

export default CompanyForm;
