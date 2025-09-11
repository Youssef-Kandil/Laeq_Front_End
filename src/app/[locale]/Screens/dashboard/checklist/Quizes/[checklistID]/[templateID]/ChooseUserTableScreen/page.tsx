"use client";
import React from 'react'
import {ClientOnlyTable} from '@/app/components/global/Table/Table';
// import { HiOutlineDotsVertical } from "react-icons/hi";
import { useParams ,useRouter } from 'next/navigation'
import { useLocale } from 'next-intl';
import { getAdminAccountInfo } from '@/app/utils/getAccountInfo';
import SkeletonLoader from '@/app/components/global/SkeletonLoader/SkeletonLoaders';
import { useEmployees } from '@/app/Hooks/useEmployees';
import { useAssignTask } from '@/app/Hooks/useTasks';

interface Employee {
  id:number;
  full_name: string;
  user_id?:number;
  company_id?:number;
  site_id?:number;
  users: { email: string };
  sites: { site_name: string };
  companies: { company_name: string };
  roles: { role_name: string };
}

interface AssignTaskPayload {
  admin_id: number;
  user_id: number;
  template_id: number ;
  company_id: number;
  site_id: number;
  status?: string;
}


function ChooseUserTableScreen() {
      const router = useRouter();
      const current_lang = useLocale();

    // Start Sceleton Loading..
    //  Get template ID  From Params
      const params = useParams(); 
      const   { templateID ,checklistID}= params;

      let temp_id: number | undefined = undefined;

      if (templateID) {
        const raw = Array.isArray(templateID) ? templateID[0] : templateID;
        const lastDashIndex = raw.lastIndexOf("-");
        
        if (lastDashIndex !== -1) {
          const rawId = raw.slice(lastDashIndex + 1);
          const parsedId = Number(rawId);
          if (!isNaN(parsedId)) {
            temp_id = parsedId;  // دايمًا رقم
          }
        }
      }

      const info = getAdminAccountInfo("AccountInfo");
      const isEmployee = info?.role === "employee";    
      const targetId  =
              isEmployee
                ? info?.userDetails?.admin_id
                : info?.userDetails?.id;
    
      const local_var = "chooseUser.tb_headers";
      //=== Add Action To The Table Rows

      React.useEffect(()=>{
        localStorage.setItem('clickedAsideTitle',"users");
    },[])

    const [selectedUserIds ,setSelectedUserIds]  = React.useState<AssignTaskPayload[]>([]);


      const {mutate:SendTask} = useAssignTask();

      const { data, isLoading, error } = useEmployees(targetId ?? 0);
      if (isLoading) return <SkeletonLoader variant="table" tableColumns={4} tableRows={5} />;
      if (error) return <p>حصل خطأ!</p>;



    //=== Add Action To The Table Rows

      const modifiedData = data.map(({ id,full_name,companies, users, sites, roles }: Employee) => ({
          id,
          full_name,
          email: users.email,
          site: sites.site_name,
          company: companies.company_name,
          role: roles.role_name,
      }));


  return (
    <div>
        <ClientOnlyTable 
            titles={[`${local_var}.id`,`${local_var}.employee`,`${local_var}.email`,`${local_var}.site`,`${local_var}.company`,`${local_var}.role`]}
            data={modifiedData}
            rowsFlex={[0.5,1,1,1,1,1]}
            navButtonTitle='chooseUser'
            navButtonAction={()=>{
              if(selectedUserIds.length != 0){
                SendTask(selectedUserIds,{
                    onSuccess:()=>{
                      router.push(`/${current_lang}/Screens/dashboard/checklist`);
                    },
                    onError:(error)=>{
                      console.error("SEND TASK ERROR : ",error);
                    }
                })
              }else{
                console.error("Must Select One User");
              }
            }}


            
            // navButton2Title='chooseUser'
            navButton2Action={()=>router.push(`/${current_lang}/Screens/dashboard/checklist/Quizes/${templateID}/${checklistID}/ChooseUserTableScreen/AutomationForm`)}
            
            useCheckRows
            onCheckedChange={(ids) => {
              const selected = data
                .filter((emp: Employee) => ids.includes(emp.id))
                .map((emp: Employee) => ({
                  user_id: emp.user_id,                  // ده هو نفسه id الموظف
                  site_id: emp.site_id,       // من الجدول sites
                  company_id: emp.company_id, // من الجدول companies
                  admin_id: targetId, // من الانفو بتاع الادمن
                  template_id:temp_id!
                }));
            
              setSelectedUserIds(selected);
              console.log("Selected Users (compact):: ", selected);
            }}
            
        />
    </div>
  )
}

export default ChooseUserTableScreen
