"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { LuTrash2 } from "react-icons/lu";
// import { FiEdit2 } from "react-icons/fi";
import { FaArrowTrendUp } from "react-icons/fa6";
import { useActions ,useUpdateActionStatus , useDeleteAction} from "@/app/Hooks/useActions";
import { getAdminAccountInfo } from "@/app/utils/getAccountInfo";
import SkeletonLoader from "@/app/components/global/SkeletonLoader/SkeletonLoaders";
import BottonComponent from "@/app/components/global/ButtonComponent/BottonComponent";
import Popup from '@/app/components/global/Popup/Popup';
import { ClientOnlyTable } from "@/app/components/global/Table/Table";
import encryption from "@/app/utils/encryption";

// ===== Types =====
interface ActionType {
  id: number;
  action_title?: string;
  companies?: { company_name?: string };
  sites?: { site_name?: string };
  users_actions_created_byTousers?: { email?: string ,employees:{full_name:string}}; // لو عندك relation للي عمل الأكشن
  users_actions_assigned_toTousers?: { email?: string,employees:{full_name:string} }; // لو عندك relation للي عمل الأكشن
  created_at?: string;
  status?: string;
}

function Actions() {
  const router = useRouter();
  const current_lang = useLocale();
  const [showPopup, setShowPopup] = React.useState(false);

  // Set default clicked title in aside
  React.useEffect(() => {
    localStorage.setItem("clickedAsideTitle", "actions");
  }, []);

  // Get logged in user info
  const info = getAdminAccountInfo("AccountInfo");
  const isEmployee = info?.role === "employee";
  // const limits =  
  //         isEmployee
  //           ?info.userDetails.admin_users?.admin_account_limits  as { max_Corrective_action?: number } ?? {} 
  //           : info?.userDetails?.admin_account_limits as { max_Corrective_action?: number } ?? {};

  // const [maxActions] = React.useState(limits.max_Corrective_action ?? 0);
  const targetId = isEmployee ? info?.id : info?.userDetails?.id;

  // Fetch actions
  const {
    data: actionsData,
    isLoading,
    isError,
  } = useActions({
    id: targetId ?? -1,
    user_id: info?.id??-1,
    role: info?.role === "admin" ? "admin" : "user",
  });

  const {mutate:updateStatus} = useUpdateActionStatus();

    // Delete hook
    const { mutate: deleteAction } = useDeleteAction();

  // ===== Table Headers =====
  const local_var = "actions.tb_headers";
  const baseHeaders = [
    // `${local_var}.id`,
    `${local_var}.name`,
    `${local_var}.company`,
    `${local_var}.site`,
    `${local_var}.submitted_by`,
    `${local_var}.date`,
    `${local_var}.status`,
  ];

  const headers = isEmployee
    ? [...baseHeaders, ""] // زرار start/finish بس
    : [...baseHeaders, `${local_var}.assign`, "",""]; // assign + edit + delete

  // ===== Loading / Error States =====
  if (isLoading) return <SkeletonLoader />;
  if (isError) return <p className="text-red-500">❌ Error loading actions</p>;

/*
    +  Check max Limit To Add Or Assign Action of Current Plan
    +  Check Roll of EMP
*/ 
  // function handelValidation() {
  //     // 1- check limit
  //     if (maxActions <= actionsData.length) {
  //       console.log("❌ Max actions limit reached!");
  //       return false;
  //     }

  //     // 2- check employee role
  //     if (isEmployee) {
  //       const hasPermission = info.userDetails.permissions?.includes("manage actions");

  //       if (!hasPermission) {
  //         console.log("❌ You don't have permission to manage actions");
  //         return false;
  //       }
  //     }
  //      // لو عدى كل الشروط
  //     console.log("✅ Validation passed, you can proceed");
  //     return true;
  //   }

    // const hasPermission = handelValidation();

  // ===== Modify actions data for table =====
  const modifiedData =
    actionsData?.map((action: ActionType) => {
      const baseData = {
        // id: action?.id,
        name: action?.action_title || "—",
        company: action?.companies?.company_name || "—",
        site: action?.sites?.site_name || "—",
        submitted_by: action?.users_actions_created_byTousers?.email || "—",
        date: action?.created_at
          ? new Date(action.created_at).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })
          : "—",
        status: action?.status || "Pending",
      };
// ====== TABLE ACTIONS BUTTONS
      if (isEmployee) {
        return {
          ...baseData,
          action:
            action.status === "Pending" ? (
              <BottonComponent
                title="Start"
                onClick={() =>{
                  console.log("Start action", action.id, action.action_title);
                  updateStatus({action_id:action.id,status:"In Progress"});
                }
                }
              />
            ) : action.status === "In Progress" ? (
              <BottonComponent title="Done" 
                    onClick={()=>{
                      console.log("Done action", action.action_title);
                      updateStatus({action_id:action.id,status:"Completed"});
                    }} />
            ) : (
              <p style={{ color: "#68A6A6" }}>Finished</p>
            ),
        };
      } else {
        return {
          ...baseData,
          assign_action: 
             !action?.users_actions_assigned_toTousers?.email?
            (<BottonComponent
              title="Assign"
              onClick={() =>{ 
                // if (hasPermission == false) {
                //   if (!isEmployee) {
                //     setShowPopup(true)
                //   }
                // }else{
                // }
                router.push(`/${current_lang}/Screens/dashboard/actions/${encryption.encryption(JSON.stringify(action.id),"encryptionKey")}/AssignActionToUser`);
              }}
              />):(
                <p style={{ color: "#68A6A6" }}>Assigned to {action.users_actions_assigned_toTousers.email}</p>
              )
          ,
          delete_action: action?.users_actions_assigned_toTousers?.email !== info?.email ? (
            <button
              className="p-2 hover:text-red-600"
              onClick={() => deleteAction({ id: action.id })}
            >
              <LuTrash2 style={{ fontSize: 20 }} />
            </button>
          ):"-",
          action: ( action.status === "Pending" && action?.users_actions_assigned_toTousers?.email == info?.email) ? (
            <BottonComponent
              title="Start"
              onClick={() =>{
                console.log("Start action", action.id, action.action_title);
                action.status = "Pending" 
                updateStatus({action_id:action.id,status:"In Progress"});
              }
              }
            />
          ) :( action.status === "In Progress"&& action?.users_actions_assigned_toTousers?.email == info?.email) ? (
            <BottonComponent title="Done" 
                  onClick={()=>{
                    console.log("Done action", action.action_title);
                    action.status = "Completed" 
                    updateStatus({action_id:action.id,status:"Completed"});
                  }} />
          ) : (
            <p style={{ color: "#68A6A6" }}>Finished</p>
          ),
        };
      }
    }) || [];

  // ===== Render =====
  return (
    <div>
      {showPopup&&<Popup 
        icon={<FaArrowTrendUp/>} 
        title="You’ve reached " 
        subTitle="the limit allowed in your plan." 
        btnTitle="Upgrade to unlock higher limits"
        btnFunc={isEmployee?()=>{}:()=>router.push(`/${current_lang}/Screens/dashboard/payments_plans`)}
        onClose={()=>setShowPopup(false)}/>}
      <ClientOnlyTable
        titles={headers}
        data={modifiedData}
        filter
        rowsFlex={
          isEmployee
            ? [ 1, 1, 1, 1, 1, 1, 1]
            : [ 1, 1, 1, 1, 1, 1, 1, 0.2,1]
        }
        navButtonTitle="actions"
        navButtonAction={() =>{
          router.push(`/${current_lang}/Screens/dashboard/actions/createActionForm`)
            // if (hasPermission) {
            // }else{
            //   if (!isEmployee) {
            //     setShowPopup(true)
            //   }
            // }
        }}
      />
    </div>
  );
}

export default Actions;
