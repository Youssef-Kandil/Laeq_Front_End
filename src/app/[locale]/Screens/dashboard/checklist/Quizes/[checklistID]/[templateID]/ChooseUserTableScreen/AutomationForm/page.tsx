"use client";
import React from 'react'

import {useRouter ,useParams } from "next/navigation"; 
import { useLocale } from 'next-intl';

// import DateInputComponent from '@/app/components/global/InputsComponents/DateInputComponent/DateInputComponent';
// import TimeInputComponent from '@/app/components/global/InputsComponents/TimeInputComponent/TimeInputComponent';
import { DateTimeInputComponent } from '@/app/components/global/InputsComponents';
import DropListComponent from '@/app/components/global/InputsComponents/DropListComponent/DropListComponent';
import BottonComponent from '@/app/components/global/ButtonComponent/BottonComponent';
import { getFutureDate } from '@/app/utils/date';

import { useAssignTask } from '@/app/Hooks/useTasks';



interface AssignTaskPayload {
  admin_id: number;
  user_id: number;
  template_id: number ;
  company_id: number;
  site_id: number;
  status?: string;
  repeate:number;
  repeate_date:string|null;
  duration_type:string|null;
}


function AutomationForm() {
    const router = useRouter();
    const params = useParams();
    const current_lang = useLocale();
    const { templateID } = params;
    // const [selectedUserIds ,]  = React.useState<AssignTaskPayload[]>([]);
    const {mutate:SendTask} = useAssignTask();
      // 🟢 State للتحكم في التكرار
      const [isRepeated, setIsRepeated] =  React.useState<"0" | "1">("0");
      const [frequency, setFrequency] =  React.useState<string | null>(null);
      const [customDate, setCustomDate] =  React.useState<string | null>(null);
  
    // ✅ templateID جاي في شكل "456-ENCRYPTED_STRING"
    // let extractedtemplateID: number | null = null;
    let taskObject: AssignTaskPayload ;
  
    if (templateID) {
      const raw = Array.isArray(templateID) ? templateID[0] : templateID;
      const decoded = decodeURIComponent(raw.split("-")[2]);
      taskObject = JSON.parse(decoded)[0]
      console.log("RAWWWC : ",taskObject)
      
    }
    

    function handleSave() {
      if (!taskObject) return;
      console.log("RUNNING  :",taskObject)
      // 🟢 نحدد القيمة حسب frequency
        let repeatValue = 0;
        switch (frequency) {
          case "daily":
            repeatValue = 1;
            break;
          case "weekly":
            repeatValue = 7;
            break;
          case "monthly":
            repeatValue = 30;
            break;
          case "yearly":
            repeatValue = 365;
            break;
          case "custom":
            repeatValue = 0; // في الكاستم بنعتمد على التاريخ اللي المستخدم هيختاره
            break;
          default:
            repeatValue = 0;
        }
  //  ==== PAYLOAD
        const payload: AssignTaskPayload = {
          ...taskObject,
          repeate: isRepeated === "0" ? 0 : repeatValue,
          repeate_date: frequency === "custom" 
          ? (new Date(customDate??"").toISOString() ?? null) // لو كاستم، استخدم اللي اختاره أو null لو فاضي
          : (repeatValue > 0 ? getFutureDate(repeatValue).toISOString() : null), // لو مش كاستم وحاطط قيمة، استخدمها، غير كده null
          duration_type: frequency ??null,
        };

        console.log("Final Payload:", payload);
  //  === Validation
        if (!payload.repeate_date) return;
        if (!payload.duration_type) return;

        if (!payload.admin_id || payload.admin_id === -1) return;
        if (!payload.user_id || payload.user_id === -1) return;
        if (!payload.template_id || payload.template_id === -1) return;
        if (!payload.company_id || payload.company_id === -1) return;
        if (!payload.site_id || payload.site_id === -1) return;
  
  
      SendTask([payload], {
        onSuccess: () => {
          router.push(`/${current_lang}/Screens/dashboard/checklist`);
        },
        onError: (error) => {
          console.error("SEND TASK ERROR : ", error);
        },
      });
    }
  return (
    <div style={{margin:"0px 30px",}}>
        <p style={{fontWeight:500,fontSize:20,margin:'20px 0 30px 0'}}>Select a single date & time or repeated date & time</p>

      <DropListComponent 
        label='Repeated' 
        placeholder='Select if this task Repeated or not' 
        list={[
          {id:1,title:"Repeated",value:"1"},
          {id:2,title:"not Repeated",value:"0"},
        ]} 
        onSelect={(val)=>{
          setIsRepeated(val.value as "0" | "1"); 
        }}/>

        {isRepeated === "1"&& (
            <DropListComponent 
              label='Duration' 
              placeholder='Select Repeate Duration' 
              list={[
                {id:2,title:"daily",value:"daily"},
                {id:1,title:"weekly",value:"weekly"},
                {id:2,title:"monthly",value:"monthly"},
                {id:2,title:"yearly",value:"yearly"},
                {id:2,title:"custom date",value:"custom"},
              ]} 
              onSelect={(val)=>{
                setFrequency(val.value);
            }}/>
        )}
        {isRepeated === "1" && frequency === "custom" && (
          <div style={{display:"flex",flexWrap:"wrap",gap:20}}>
            <DateTimeInputComponent  onChange={(val)=>setCustomDate(val)} />
          </div>
        )}
      <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            margin: '0px 10px' ,
        }}>
        <div style={{flex:1}}>
          <BottonComponent 
              title='Save'
              onClick={()=>{
                handleSave()
                //   SendTask(selectedUserIds,{
                //     onSuccess:()=>{
                //       // router.push(`/${current_lang}/Screens/dashboard/checklist`);
                //     },
                //     onError:(error)=>{
                //       console.error("SEND TASK ERROR : ",error);
                //     }
                // })
              }}
              />
        </div>
        <p onClick={()=>router.back()} style={{flex:5,cursor:"pointer"}}>Cancel</p>
      </div>
    </div>
  )
}

export default AutomationForm
