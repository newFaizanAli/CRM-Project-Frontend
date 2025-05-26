import DashboardWidgets from "../components/custom/DashboardWidgets";


import { ClipboardDocumentListIcon, CheckCircleIcon } from "@heroicons/react/24/outline";


const projectModules = [
  {
    name: "Projects",
    icon: <ClipboardDocumentListIcon className="h-8 w-8" />,
    path: "/project/projects",
  },
 {
    name: "Tasks",
    icon: <CheckCircleIcon className="h-8 w-8" />,
    path: "/project/tasks",
  },
];
export default function ProjectDashboard() {
  return (
    <DashboardWidgets data={projectModules} title={'Projects'} />
  );
}
