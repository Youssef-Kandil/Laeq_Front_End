"use client";
import React from 'react';
import DropListComponent from '@/app/components/global/InputsComponents/DropListComponent/DropListComponent';
// import {useLocale} from 'next-intl';
import { useRouter ,useParams} from "next/navigation"; 
// import { SelectChangeEvent } from '@mui/material';
import { getAdminAccountInfo } from '@/app/utils/getAccountInfo';


import { useCheckList } from '@/app/Hooks/useCheckList';
import BottonComponent from '@/app/components/global/ButtonComponent/BottonComponent';
import { DropListType } from '@/app/Types/DropListType';
import { AccountInfo } from '@/app/Types/AccountsType';
import { useEmployees } from '@/app/Hooks/useEmployees';
import { useAssignTask  } from '@/app/Hooks/useTasks';
import { useUpdateInspectorRequestStatus } from '@/app/Hooks/useInspectorRequest';
import { AssignTaskPayload } from '@/app/Types/TaskType';
import Popup from "@/app/components/global/Popup/Popup";
import Lottie from "lottie-react";
import WorngIcon  from '@/app/Lottie/wrong.json'
import LoadingIcon  from '@/app/Lottie/Loading animation blue.json'
import { useGetMutationTemplatesByChecklistId } from '@/app/Hooks/useTemplates';

function AssignForm() {
    // const current_lang = useLocale();
    const {request_data} = useParams();
    const [request_id,client_id,companyId, siteId] = (request_data as string).split("-");
    const router = useRouter();
    const info = getAdminAccountInfo("AccountInfo") as AccountInfo | null;
    const admin_id =  info?.userDetails?.id ?? -1;
    // const limits = info?.userDetails?.admin_account_limits;
    const Inspactors = useEmployees(info?.userDetails.id ?? -1);
    const CheckLists = useCheckList(info?.userDetails.id ?? -1);
    const {mutate:newTask,isPending} = useAssignTask();
    const [isSubmitLoading,setIsSubmiLoading] = React.useState<boolean>(false);
    const [showValidationPopup,setShowValidationPopup] = React.useState<boolean>(false);
    const [ValidationPopupMSG,setValidationPopupMSG] = React.useState<string>("");
    const [TemplatesList,setTemplatesList] = React.useState<DropListType[]|null>(null)
    const  {mutate:getTemplates} = useGetMutationTemplatesByChecklistId()
    const  {mutate:updateStatus} = useUpdateInspectorRequestStatus()
    // const pathname = usePathname();
    const CheckLis_Categories_List = CheckLists.data?.map((item:{id:number,checklist_title:string}) => ({
      id: item?.id,
      value: String(item?.id),
      title: item.checklist_title,
    }))
    
    const Inspactors_List = Inspactors.data?.map((item:{users:{id:number},full_name:string}) => ({
      id: item?.users?.id,
      value: String(item?.users.id),
      title: item.full_name,
    }));

    const [selectedChecklist,setSelectedChecklist] = React.useState<DropListType|null>(null)
    const [selectedTemplate,setSelectedTemplate] = React.useState<DropListType|null>(null)
    const [selectedInspactor,setSelectedInspactor] = React.useState<DropListType|null>(null)
    const [disabled,setDisabled] = React.useState<boolean>(false)

    function getTemplatesByCategoryId(categoryId:number) {
      getTemplates({checklist_id:categoryId},{
        onSuccess:(data)=>{
          console.log("CHECKLISTSS :",data)
          const TemplatesList = data.map((item:{id:number,template_title:string}) => ({
            id: item.id,
            value: String(item.id),
            title: item.template_title,
          }));
          setTemplatesList(TemplatesList)
        }
      })
      
      // const Category = CheckLists.data.find((c :{id:number}) => c.id === companyId);

    }

    function handelSelectChecklistCategory(checklist:DropListType){
        setSelectedChecklist(checklist);    
        console.log("TEMPLATES ,",selectedInspactor);
        getTemplatesByCategoryId(checklist.id);

    }

    function handelAssignTask(){
        if (!admin_id) return;
        if (!selectedChecklist?.value) return;
        if (!selectedTemplate?.value) return;
        if (!companyId) return;
        if (!siteId) return;
        setIsSubmiLoading(true);
        setDisabled(isPending);
        const payload:AssignTaskPayload = {
              admin_id:Number(admin_id)??-1,
              user_id:Number(selectedInspactor?.id)??-1,
              template_id:Number(selectedTemplate?.value)??-1,
              company_id:Number(companyId)??-1,
              site_id:Number(siteId)??-1,
              status:"Pending",
              task_type:'request',
              inspection_to:Number(client_id)??-1,
              request_id:Number(request_id)
        }
        console.log("Request Payload ::", payload);
        newTask([payload], {
          onSuccess: () => {   
            updateStatus({request_id:Number(request_id),status:"In Progress"},{
              onSuccess:()=>{router.back();},
              onError:(e)=>{
                console.error("Requested ERROR >> ",e);
                setIsSubmiLoading(false)
                setDisabled(false);
                setShowValidationPopup(true);
                setValidationPopupMSG("try again.");
              }
            })         
          },
          onError: (e) => {
            console.error("Requested ERROR >> ",e);
            setIsSubmiLoading(false)
            setDisabled(false);
            setShowValidationPopup(true);
            setValidationPopupMSG("try again.");
          },
        })
    }

  return (
    <div>
          {isSubmitLoading&&<Popup
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
            {showValidationPopup&&<Popup icon={<Lottie animationData={WorngIcon} loop={false} style={{ width: 350, height: 250 }}/>} title="Wrong!" subTitle={ValidationPopupMSG} onClose={()=>setShowValidationPopup(false)}/>}
      <div style={{
          margin:'12px 10px'
      }}>
        <div style={{display:"flex",flexDirection:'column',gap:30}}>
          <div style={{minWidth:300,width:250}}>
            <DropListComponent label='Inspactor' placeholder='Choose  Inspactor'  list={Inspactors_List ?? []}  onSelect={(val)=>{setSelectedInspactor(val)}}/>
          </div>
          <div style={{minWidth:300,width:250}}>
              <DropListComponent label='Checklist Catecgory' placeholder='Choose Checklist Catecgory' list={CheckLis_Categories_List??[]}  onSelect={(val)=>{handelSelectChecklistCategory(val)}}/>
          </div>
          <div style={{minWidth:300,width:250}}>
            <DropListComponent label='Site' placeholder='Choose Template'  list={TemplatesList ?? []}  onSelect={(val)=>{setSelectedTemplate(val)}}/>
          </div>
          


        </div>

        <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              margin: '20px 10px' ,
          }}>
          <div style={{flex:1}}>
            <BottonComponent disabled={disabled} title='Send Request' onClick={handelAssignTask}/>
          </div>
          <p onClick={()=>router.back()} style={{flex:5,cursor:"pointer"}}>Cancel</p>
        </div>
        
      </div>
    </div>
  )
}

export default AssignForm
