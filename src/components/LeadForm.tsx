import { useForm } from "react-hook-form";
import { LeadInput, LeadFormData } from "../utilities/types";
import useCompaniesStore from "../store/companies";
import { leadSource, leadStatus } from "../utilities/const";
import useLeadsStore from "../store/leads";

interface LeadFormProps {
  lead?: LeadInput;
  onClose: () => void;
}

const LeadForm = ({ lead, onClose }: LeadFormProps) => {
  const { addLead, updateLead } = useLeadsStore();
  const { companies } = useCompaniesStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    defaultValues: {
      name: lead?.name || "",
      email: lead?.email || "",
      phone: lead?.phone || "",
      company: lead?.company?._id ?? null,
      status: lead?.status || "new",
      source: lead?.source || "website",
      value: lead?.value || 0,
    },
  });

  const onSubmit = (data: LeadFormData) => {
    const fullParent = companies.find((d) => d._id === String(data.company));

    const transformedData: Omit<LeadInput, "_id"> = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: data.status,
      source: data.source,
      value: data.value,
      company: fullParent
        ? { _id: fullParent._id, name: fullParent.name }
        : null,
    };

    if (lead) {
      updateLead(lead._id!, transformedData);
    } else {
      addLead(transformedData);
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

        {/* Company */}
        <div>
          <label>Company (Optional)</label>
          <select {...register("company")} className="input w-full">
            <option value="">-- None --</option>
            {companies.map((dep) => (
              <option key={dep._id} value={dep._id}>
                {dep.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="input"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            {...register("phone", { required: "Phone # is required" })}
            className="input"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            className="input"
            {...register("status", { required: "Status is required" })}
          >
         
              {leadStatus.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Source
          </label>
          <select
            className="input"
            {...register("source", { required: "Status is required" })}
          >
            {leadSource.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.source && (
            <p className="mt-1 text-sm text-red-600">{errors.source.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Value
          </label>
          <input
            className="input"
            {...register("value", { required: "Value is required" })}
          />
          {errors.value && (
            <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {lead ? "Update" : "Create"} Lead
        </button>
      </div>
    </form>
  );
};

export default LeadForm;
