"use client";
import React from "react";
import { ClientOnlyTable } from "@/app/components/global/Table/Table";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useTasks, useUpdateTaskStatus ,useDeleteTask } from "@/app/Hooks/useTasks";
import { getAdminAccountInfo } from "@/app/utils/getAccountInfo";
import SkeletonLoader from "@/app/components/global/SkeletonLoader/SkeletonLoaders";
import BottonComponent from "@/app/components/global/ButtonComponent/BottonComponent";
import Link from "next/link";
import { generateMapLinks } from "@/app/utils/mapLinks";
// Icons

import { LuTrash2 } from "react-icons/lu";
// import { FiEdit2 } from "react-icons/fi";

// ===== Types =====
interface TaskType {
  id: number;
  users?: { email?: string };
  templates?: { id: number; template_title?: string; is_repeated?: boolean };
  sites?: { site_name?: string,full_address:string ,lat:string,long:string};
  companies?: { company_name?: string };
  status?: string;
  repeate_date:string;
  date?: string;
}

function Tasks() {
  // Set default clicked title in aside
  React.useEffect(() => {
    localStorage.setItem("clickedAsideTitle", "tasks");
  }, []);

  const router = useRouter();
  const current_lang = useLocale();

    // Delete hook
    const { mutate: deleteTask } = useDeleteTask();

  // Mutation hook for updating task status
  const { mutate: updateTaskStatus } = useUpdateTaskStatus();

  /**
   * Handle start task → update status to "In Progress"
   * then navigate to task details page
   */
  function handelStartTask(
    task_id: number,
    template_title: string,
    template_id: number
  ) {
    if (task_id && template_title && template_id) {
      updateTaskStatus(
        { task_id, status: "In Progress" },
        {
          onSuccess: () => {
            router.replace(
              `/${current_lang}/Screens/dashboard/tasks/${task_id}-${template_title}-${template_id}`
            );
          },
        }
      );
    }
  }

  // Get logged in user info
  const info = getAdminAccountInfo("AccountInfo");
  const isEmployee = info?.role === "employee";
  const targetId = isEmployee ? info?.id : info?.userDetails?.id;

  // Fetch tasks
  const {
    data: tasksData,
    isLoading,
    isError,
  } = useTasks({
    id: targetId ?? -1,
    role: info?.role === "admin" ? "admin" : "user",
  });
  console.log("tasksData >> ",tasksData)

  // ===== Table Headers =====
  const local_var = "tasks.tb_headers";
  const baseHeaders = [
    `${local_var}.employee`,
    `${local_var}.checklist`,
    `${local_var}.site`,
    `${local_var}.company`,
    `${local_var}.status`,
    `${local_var}.repeate`,
    `${local_var}.location`,
    `${local_var}.date`,
  ];

  const headers = isEmployee
    ? [...baseHeaders, ""]
    : [...baseHeaders, "", ""];

  // ===== Loading / Error States =====
  if (isLoading) return <SkeletonLoader />;
  if (isError) return <p className="text-red-500">❌ Error loading tasks</p>;

  // ===== Modify tasks data for table =====
  const modifiedData =
    tasksData?.map((task: TaskType) => {
      const baseData = {
        employee: task?.users?.email || "—",
        checklist: task?.templates?.template_title || "—",
        site: task?.sites?.site_name || "—",
        company: task?.companies?.company_name || "—",
        status: task.status,
        repeate_date: task?.repeate_date? new Date(task?.repeate_date).toLocaleString("en-US", {
          month: "short", // Month letters
          day: "numeric", // Day number
          hour: "numeric", // Hour
          minute: "2-digit", // Minutes
          hour12: true, // AM/PM
        }) : "NO",
        location:task?.sites?.lat? <Link href={generateMapLinks(task?.sites?.lat??"",task?.sites?.long??"").google_search} style={{ color: "#68A6A6", textDecoration: "underline" }} target="_blank">Site Location</Link>:task?.sites?.full_address??"No Location",
        date: task?.date
          ? new Date(task.date).toLocaleString("en-US", {
              month: "short", // Month letters
              day: "numeric", // Day number
              hour: "numeric", // Hour
              minute: "2-digit", // Minutes
              hour12: true, // AM/PM
            })
          : "—",
      };

      if (isEmployee) {
        return {
          ...baseData,
          action:
            task.status === "Pending" ? (
              <BottonComponent
                title="Start"
                onClick={() =>
                  handelStartTask(
                    task.id,
                    task?.templates?.template_title || "—",
                    task?.templates?.id || -10
                  )
                }
              />
            ) : task.status === "In Progress" ? (
              <BottonComponent title="Loading..."  />
            ) : (
              <p style={{ color: "#68A6A6" }}>Finished</p>
            ),
        };
      } else {
        return {
          ...baseData,
          // edit: (
          //   <button className="p-2 hover:text-blue-600">
          //     <FiEdit2 style={{ fontSize: 20 }} />
          //   </button>
          // ),
          delete: (
            <button onClick={()=>deleteTask({id:task.id})} className="p-2 hover:text-red-600">
              <LuTrash2 style={{ fontSize: 20 }} />
            </button>
          ),
          task:
            task.status === "Pending" ? (
              <BottonComponent
                title="Start"
                onClick={() =>
                  handelStartTask(
                    task.id,
                    task?.templates?.template_title || "—",
                    task?.templates?.id || -10
                  )
                }
              />
            ) : task.status === "In Progress" ? (
              <BottonComponent title="Loading..."  />
            ) : (
              <p style={{ color: "#68A6A6" }}>Finished</p>
            ),
        };
      }
    }) || [];

  // ===== Render =====
  return (
    <div>
      <ClientOnlyTable
        titles={headers}
        data={modifiedData}
        filter
        rowsFlex={
          isEmployee
            ? [1, 1, 1, 1, 1, 1,1, 1]
            : [1.5, 1, 1, 1, 1, 1, 1,1.5, 0.5, 1]
        }
      />
    </div>
  );
}

export default Tasks;
