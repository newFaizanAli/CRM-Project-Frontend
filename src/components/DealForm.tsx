import { useForm } from "react-hook-form";
import { Deal, DealFormData } from "../utilities/types";
import useDealsStore from "../store/deal";
import useCompaniesStore from "../store/companies";
import { dealStages } from "../utilities/const";

interface DealFormProps {
  deal?: Deal;
  onClose: () => void;
}

const DealForm = ({ deal, onClose }: DealFormProps) => {
  const { addDeal, updateDeal } = useDealsStore();
  const { companies } = useCompaniesStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DealFormData>({
    defaultValues: deal
      ? {
          name: deal.name || "",
          company: deal.company?._id || "",
          value: deal.value || 0,
          stage: deal.stage || "proposal",
          probability: deal.probability || 0,
          expectedCloseDate: deal.expectedCloseDate || "",
          owner: deal.owner || "",
        }
      : {
          name: "",
          company: "",
          value: 0,
          stage: "proposal",
          probability: 0,
          expectedCloseDate: "",
          owner: "",
        },
  });

  const onSubmit = (data: DealFormData) => {
    const fullParent = companies.find((d) => d._id === String(data.company));

    const transformedData: Omit<Deal, "_id"> = {
      name: data.name,
      value: data.value,
      stage: data.stage,
      probability: data.probability,
      expectedCloseDate: data.expectedCloseDate,
      owner: data.owner,
      company: fullParent
        ? { _id: fullParent._id, name: fullParent.name }
        : null,
    };

    if (deal) {
      updateDeal(deal._id!, transformedData);
    } else {
      addDeal(transformedData);
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
            Value
          </label>
          <input
            type="text"
            {...register("value", { required: "Value is required" })}
            className="input"
          />
          {errors.value && (
            <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stage
          </label>
          <select
            className="input"
            {...register("stage", { required: "Stage is required" })}
          >
            {dealStages.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.stage && (
            <p className="mt-1 text-sm text-red-600">{errors.stage.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Probability
          </label>
          <input
            type="number"
            min="0"
            max="100"
            className="input"
            {...register("probability", {
              required: "Probability is required",
            })}
          />
          {errors.probability && (
            <p className="mt-1 text-sm text-red-600">
              {errors.probability.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Expected Close Date
          </label>
          <input
            type="date"
            className="input"
            {...register("expectedCloseDate", {
              required: " Close Date is required",
            })}
          />
          {errors.expectedCloseDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.expectedCloseDate.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Owner
          </label>
          <input
            type="text"
            {...register("owner", { required: "Owner is required" })}
            className="input"
          />
          {errors.owner && (
            <p className="mt-1 text-sm text-red-600">{errors.owner.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {deal ? "Update" : "Create"} Deal
        </button>
      </div>
    </form>
  );
};

export default DealForm;
