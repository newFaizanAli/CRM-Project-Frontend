import { useForm } from "react-hook-form";
import useContactsStore from "../store/contacts";
import useCustomerStore from "../store/customers";
import useEmployeesStore from "../store/employee";
import useSupplierStore from "../store/suppliers";
import useCompaniesStore from "../store/companies";
import { Contact, ContactFormData } from "../utilities/types";
import { useEffect } from "react";

interface ContactFormProps {
  contact?: ContactFormData & { _id?: string };
  onClose: () => void;
}

const ContactForm = ({ contact, onClose }: ContactFormProps) => {
  const { addContact, updateContact } = useContactsStore();
  const { customers } = useCustomerStore();
  const { suppliers } = useSupplierStore();
  const { employees } = useEmployeesStore();
  const { companies } = useCompaniesStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    defaultValues: contact || {
      person: "",
      personType: "customers",
      company: null,
      status: "active",
    },
  });

  const selectedPersonType = watch("personType");
  const personOptions =
    selectedPersonType === "customers"
      ? customers
      : selectedPersonType === "suppliers"
      ? suppliers
      : employees;

  useEffect(() => {
    if (contact?.personType && contact?.person) {
      setValue("personType", contact.personType);
      setValue("person", contact.person);
    }
  }, [contact, setValue]);

  const onSubmit = (data: ContactFormData) => {
    const selectedPerson = personOptions.find((p) => p._id === data.person);
    if (!selectedPerson) {
      alert("Please select a valid person.");
      return;
    }

    // const company = companies.find(
    //   (c) => c._id === data.company?._id || data.company
    // );

    const company = companies.find((d) => d._id === String(data.company));

    const finalData: Omit<Contact, "_id"> = {
      personType: data.personType,
      person: {
        _id: String(selectedPerson._id),
        name: selectedPerson.name,
        ID: selectedPerson.ID,
        phone: selectedPerson.phone,
        email: selectedPerson.email,
      },
      company: company
        ? { _id: company._id, name: company.name }
        : null,
     
      status: data.status,
    };

    if (contact?._id) {
      updateContact(contact._id, finalData);
    } else {
      addContact(finalData);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Person Type */}
        <div>
          <label>Person Type</label>
          <select
            {...register("personType")}
            className="input w-full"
            onChange={(e) => {
              setValue("personType", e.target.value as any);
              setValue("person", "");
            }}
          >
            <option value="customers">Customer</option>
            <option value="suppliers">Supplier</option>
            <option value="employees">Employee</option>
          </select>
        </div>

        {/* Person */}
        <div>
          <label>Person</label>
          <select
            {...register("person", { required: "Person is required" })}
            className="input w-full"
          >
            <option value="">-- Select --</option>
            {personOptions.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
          {errors.person && (
            <p className="text-red-500">{errors.person.message}</p>
          )}
        </div>

        {/* Company */}
        <div>
          <label>Company (Optional)</label>
          <select {...register("company")} className="input w-full">
            <option value="">-- None --</option>
            {companies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label>Status</label>
          <select {...register("status")} className="input w-full">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {contact?._id ? "Update" : "Create"} Contact
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
