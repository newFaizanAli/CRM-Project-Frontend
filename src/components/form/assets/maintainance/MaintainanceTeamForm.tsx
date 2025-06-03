import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useMaintenanceTeamStore from "../../../../store/asset/maintainance/maintainance-team";
import useEmployeesStore from "../../../../store/employee";
import {
  MaintainanceTeam,
  MaintainanceTeamFormData,
  MaintainanceTeamMember,
} from "../../../../utilities/types";

interface MaintainanceTeamFormProps {
  team?: any;
  onClose: () => void;
}

const MaintainanceTeamForm = ({ team, onClose }: MaintainanceTeamFormProps) => {
  const { addTeam, updateTeam } = useMaintenanceTeamStore();

  const { employees } = useEmployeesStore();

  const initialItems =
    team?.members?.map((member: any) => ({
      name: member.name,
      member: member._id,
      ID: member.ID,
    })) || [];

  const [members, setMembers] =
    useState<MaintainanceTeamMember[]>(initialItems);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MaintainanceTeamFormData>({
    defaultValues: team
      ? {
          manager: team.manager?._id || "",
          name: team.name || "",
        }
      : {
          manager: "",
          name: "",
        },
  });

  const handleAddMember = (empId: string) => {
    const member = employees.find((c) => String(c._id) === empId);

    if (!member) return;

    const newMember: MaintainanceTeamMember = {
      name: member.name,
      ID: member.ID,
      member: String(member._id),
    };

    setMembers([...members, newMember]);
  };

  useEffect(() => {
    if (team?.members && employees.length) {
      const initialItems = team.members.map((member: any) => {
        const matched = employees.find(
          (e) => String(e._id) === String(member.member)
        );
        return {
          name: matched?.name || "",
          ID: matched?.ID || "",
          member: String(member.member),
        };
      });

      setMembers(initialItems);
    }
  }, [team, employees]);

  const handleRemoveItem = (index: number) => {
    const updated = [...members];
    updated.splice(index, 1);
    setMembers(updated);
  };

  const onSubmit = (data: MaintainanceTeamFormData) => {
    const fullManager = employees.find(
      (e) => String(e._id) === String(data.manager)
    );

    const transformedData: Omit<MaintainanceTeam, "_id"> = {
      ...data,
      members,
      manager: fullManager
        ? {
            _id: String(fullManager._id),
            name: fullManager.name,
          }
        : null,
    };

    if (team) {
      updateTeam(team._id!, transformedData);
    } else {
      addTeam(transformedData);
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
          <label>Select Manager</label>
          <select
            {...register("manager", {
              required: "manager is required",
            })}
            className="input w-full"
          >
            <option value="">-- Select Structure --</option>
            {employees.map((structure) => (
              <option key={structure._id} value={structure._id}>
                {structure.ID}
              </option>
            ))}
          </select>
          {errors.manager && (
            <p className="text-red-500">{errors.manager.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label>Team Members</label>
          <select
            onChange={(e) => handleAddMember(e.target.value)}
            className="input w-full"
          >
            <option value="">-- Select Member --</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {`${emp.name} (${emp.ID})`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full table-auto border mt-4 text-center">
          <thead>
            <tr className="bg-gray-100">
              <th>ID</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((emp, index) => {
              return (
                <tr key={index} className="border-t">
                  <td>{emp?.ID || ""}</td>
                  <td>{emp?.name || ""}</td>
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
          {team ? "Update" : "Create"} Team
        </button>
      </div>
    </form>
  );
};

export default MaintainanceTeamForm;
