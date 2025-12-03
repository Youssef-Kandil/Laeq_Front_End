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
import Popup from '@/app/components/global/Popup/Popup';
import Lottie from 'lottie-react';
import ErrorIcon from '@/app/Lottie/wrong.json'
import LoadingIcon  from '@/app/Lottie/Loading animation blue.json'
// import encryption from '@/app/utils/encryption';

interface Employee {
  id:number;
  full_name: string;
  phone: string;
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
  inspection_to: number;
  user_id: number;
  template_id: number ;
  company_id: number;
  site_id: number;
  status?: string;

}


function ChooseUserTableScreen() {
      const router = useRouter();
      const current_lang = useLocale();
      const [SubmitLoading,setSubmitLoading] = React.useState<boolean>(false);
      const [showErrorPopup,setShowErrorPopup] = React.useState<boolean>(false);
      const [ErrorPopupMSG,setErrorPopupMSG] = React.useState<{title:string,subTitle:string}>({title:"",subTitle:""});

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


    const [selectedUserIds ,setSelectedUserIds]  = React.useState<AssignTaskPayload[]>([]);



      const {mutate:SendTask,isPending} = useAssignTask();

      const { data, isLoading,isError, error } = useEmployees(targetId ?? 0);
      if (isLoading) return <SkeletonLoader variant="table" tableColumns={4} tableRows={5} />;
      if (isError) return <p>حصل خطأ! : {error.message}</p>;
      if (data == null) return <p>حصل خطأ!</p>;
      if (data?.length == 0) return <p>Wrong! Must Add Users First</p>;

      // ==== CHECK USER TABLE ====
      if (data.length == 0) {
        setShowErrorPopup(true);
        setErrorPopupMSG({
          title:"Can't Send Task",
          subTitle:"must have at least one user."
        })
      }





    //=== Add Action To The Table Rows

      const modifiedData = data.map(({ id,full_name,phone,companies, users, sites, roles }: Employee) => ({
          id,
          full_name,
          phone,
          email: users.email,
          site: sites.site_name,
          company: companies.company_name,
          role: roles.role_name,
      }));


  return (
    <div>
      {SubmitLoading&&<Popup
          icon={
            <Lottie
            animationData={LoadingIcon}
            loop={true}
            style={{ width: 350, height: 250 }}
          />
          } 
          title={"loading..."} 
          subTitle=" " 
          onClose={()=>{}}/>}
        {showErrorPopup&&<Popup 
              icon={<Lottie animationData={ErrorIcon}  style={{ width: 350, height: 250 }} loop={false}/>} 
              title={ErrorPopupMSG.title} 
              subTitle={ErrorPopupMSG.subTitle} 
              onClose={()=>setShowErrorPopup(false)}/>}
        <ClientOnlyTable 
            titles={[`${local_var}.id`,`${local_var}.employee`,`${local_var}.phone`,`${local_var}.email`,`${local_var}.site`,`${local_var}.company`,`${local_var}.role`]}
            data={modifiedData}
            rowsFlex={[0.5,1,1,1,1,1,1]}
            navButtonTitle='chooseUser'
            navButtonAction={()=>{
              if(selectedUserIds.length != 0 && !isPending){
                setSubmitLoading(true);
                SendTask(selectedUserIds,{
                    onSuccess:()=>{
                      router.push(`/${current_lang}/laeq-admin/dashboard/tasks`);
                    },
                    onError:()=>{
                      setSubmitLoading(false);
                      setShowErrorPopup(true);
                      setErrorPopupMSG({title:"Wrong!",subTitle:"Task Not Send To User"});
                    }
                })
              }else{
                setSubmitLoading(false);
                setShowErrorPopup(true);
                setErrorPopupMSG({title:"Wrong!",subTitle:"Must Select One User"});
                console.error("Must Select One User");
              }
            }}


            
            navButton2Title='chooseUser'
            navButton2Action={()=>{
              if(selectedUserIds.length != 0 && !isPending){
                router.push(`/${current_lang}/laeq-admin/dashboard/checklist/Quizes/${checklistID}/${templateID}-${JSON.stringify(selectedUserIds)}/ChooseUserTableScreen/AutomationForm`)
              }else{
                setShowErrorPopup(true);
                setErrorPopupMSG({title:"Wrong!",subTitle:"Must Select One User"});
              }
            }}
            
            useRadioRow
            onRadioChange={(ids) => {
              if(ids){
                const selected = data.find((emp:Employee)=> emp.id === ids);
                console.log("Selected Users (compact):: ", selected);
                if(selected){
                 const modifiing  =  [selected]
                                  .map((emp: Employee) => ({
                                      user_id: emp.user_id??-1,                  // ده هو نفسه id الموظف
                                      site_id: emp?.site_id??1-1,       // من الجدول sites
                                      company_id: emp.company_id??-1, // من الجدول companies
                                      admin_id: targetId??-1, // من الانفو بتاع الادمن
                                      inspection_to: targetId??-1, // من الانفو بتاع الادمن
                                      template_id:temp_id!
                                    })); 
                  console.log("Selected Users (modifiing):: ", modifiing);
                  setSelectedUserIds(modifiing);
                  console.log("Selected Users (selectedUserIds):: ", selectedUserIds);
                }
              }else{

              }
            }}
            
        />
    </div>
  )
}

export default ChooseUserTableScreen
