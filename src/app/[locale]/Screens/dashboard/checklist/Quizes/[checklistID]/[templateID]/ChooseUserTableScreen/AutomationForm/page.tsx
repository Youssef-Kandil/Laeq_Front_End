"use client";
import React from 'react'

import {useRouter ,useParams } from "next/navigation"; 
import { useLocale } from 'next-intl';

// import DateInputComponent from '@/app/components/global/InputsComponents/DateInputComponent/DateInputComponent';
// import TimeInputComponent from '@/app/components/global/InputsComponents/TimeInputComponent/TimeInputComponent';
import { DateTimeInputComponent,InputComponent } from '@/app/components/global/InputsComponents';
import DropListComponent from '@/app/components/global/InputsComponents/DropListComponent/DropListComponent';
import BottonComponent from '@/app/components/global/ButtonComponent/BottonComponent';
import { getFutureDate,getFutureTime } from '@/app/utils/date';

import { useAssignTask } from '@/app/Hooks/useTasks';
import app_identity from '@/app/config/identity';
import Popup from '@/app/components/global/Popup/Popup';
import Lottie from 'lottie-react';
import ErrorIcon from '@/app/Lottie/wrong.json'
import LoadingIcon  from '@/app/Lottie/Loading animation blue.json'



interface AssignTaskPayload {
  admin_id: number;
  inspection_to: number;
  user_id: number;
  template_id: number ;
  company_id: number;
  site_id: number;
  status?: string;
  repeate:number;
  repeate_date:string|null;
  duration_type:string|null;
  end_repeated:number;
  repete_every_custom_hour:number|null;
  
}


function AutomationForm() {
    const router = useRouter();
    const params = useParams();
    const current_lang = useLocale();
    const { templateID } = params;
    // const [selectedUserIds ,]  = React.useState<AssignTaskPayload[]>([]);
    const {mutate:SendTask} = useAssignTask();
      // 🟢 State للتحكم في التكرار
      const [SubmitLoading,setSubmitLoading] = React.useState<boolean>(false);
      const [showErrorPopup,setShowErrorPopup] = React.useState<boolean>(false);
      const [ErrorPopupMSG,setErrorPopupMSG] = React.useState<{title:string,subTitle:string}>({title:"",subTitle:""});
      const [isRepeated, setIsRepeated] =  React.useState<"0" | "1">("0");
      const [frequency, setFrequency] =  React.useState<string | null>(null);
      const [customDate, setCustomDate] =  React.useState<string | null>(null);
      const [customHour, setCustomHour] =  React.useState<number>(0);

  
    // ✅ templateID جاي في شكل "456-ENCRYPTED_STRING"
    // let extractedtemplateID: number | null = null;
    let taskObject: AssignTaskPayload ;
  
    if (templateID) {
      const raw = Array.isArray(templateID) ? templateID[0] : templateID;
      console.log("raw:", raw);
      
      // فك الترميز أولاً
      const decodedRaw = decodeURIComponent(raw);
      console.log("decodedRaw:", decodedRaw);
      
      // بعد فك الترميز ابحث عن بداية الـ JSON
      const startIndex = decodedRaw.indexOf("[");
      if (startIndex === -1) {
        console.error("❌ لا يوجد JSON في الرابط");
      } else {
        const jsonPart = decodedRaw.substring(startIndex);
        console.log("jsonPart:", jsonPart);
      
        try {
          const parsed = JSON.parse(jsonPart);
          taskObject = parsed[0];
          console.log("✅ taskObject:", taskObject);
        } catch (err) {
          console.error("❌ خطأ أثناء تحليل JSON:", err, jsonPart);
        }
      }
      
      
    }
    

    function handleSave() {
      setSubmitLoading(true);
      if (!taskObject) {
        setSubmitLoading(false);
        setShowErrorPopup(true);
        setErrorPopupMSG({title:"Wrong 001!",subTitle:"Must Complete All Data"});
        return;
      }
      // 🟢 نحدد القيمة حسب frequency
        let repeatValue = 0;
        switch (frequency) {
          case "custom hour":
            repeatValue = customHour;
            break;
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

        let finalDate ;
        if(frequency === "custom"  && customDate != null) {
           finalDate = (new Date(customDate??"").toISOString() ?? null); 
        }else if(frequency === "custom hour" && customHour != 0){
             finalDate = (repeatValue > 0 ? getFutureTime(repeatValue).toISOString() : null)
        }else{
          finalDate = (repeatValue > 0 ? getFutureDate(repeatValue).toISOString() : null)
        }
        console.error("finalDate:", finalDate);
  //  ==== PAYLOAD
        const payload: AssignTaskPayload = {
          ...taskObject,
          repeate: isRepeated === "0" ? 0 : repeatValue,
          repeate_date:finalDate, // لو مش كاستم وحاطط قيمة، استخدمها، غير كده null
          duration_type: frequency ??null,
          end_repeated:0,
          repete_every_custom_hour:customHour??null,
        };

        console.error("Final Payload:", payload);
  //  === Validation
        if (!payload.repeate_date) {
          setSubmitLoading(false);
          setShowErrorPopup(true);
          setErrorPopupMSG({title:"Wrong 002!",subTitle:"Must Complete All Data"});
          return;
        }
        if (!payload.duration_type) {
          setSubmitLoading(false);
          setShowErrorPopup(true);
          setErrorPopupMSG({title:"Wrong 003!",subTitle:"Must Complete All Data"});
          return;
        };

        if (!payload.admin_id || payload.admin_id === -1) {
          setSubmitLoading(false);
          setShowErrorPopup(true);
          setErrorPopupMSG({title:"Wrong 004!",subTitle:"Must Complete All Data"});
          return;
        };
        if (!payload.user_id || payload.user_id === -1) {
          setSubmitLoading(false);
          setShowErrorPopup(true);
          setErrorPopupMSG({title:"Wrong 005!",subTitle:"Must Complete All Data"});
          return;
        };
        if (!payload.template_id || payload.template_id === -1) {
          setSubmitLoading(false);
          setShowErrorPopup(true);
          setErrorPopupMSG({title:"Wrong 006!",subTitle:"Must Complete All Data"});
          return;
        };
        if (!payload.company_id || payload.company_id === -1) {
          setSubmitLoading(false);
          setShowErrorPopup(true);
          setErrorPopupMSG({title:"Wrong 007!",subTitle:"Must Complete All Data"});
          return;
        };
        if (!payload.site_id || payload.site_id === -1) {
          setSubmitLoading(false);
          setShowErrorPopup(true);
          setErrorPopupMSG({title:"Wrong 008!",subTitle:"Must Complete All Data"});
          return;
        };

        if(frequency == "custom hour") {
            if (customHour == null || customHour == 0) {
              setSubmitLoading(false);
              setShowErrorPopup(true);
              setErrorPopupMSG({title:"Wrong 009!",subTitle:"Must Add Custom Hour"});
              return;       
            }
        };

        if(frequency == "custom") {
            if (customDate == null || customDate.trim().length == 0) {
              setSubmitLoading(false);
              setShowErrorPopup(true);
              setErrorPopupMSG({title:"Wrong 010!",subTitle:"Must Add Custom Date"});
              return;       
            }
        };
  
  
      SendTask([payload], {
        onSuccess: () => {
          router.push(`/${current_lang}/Screens/dashboard/tasks`);
        },
        onError: (error) => {
          setSubmitLoading(false);
          setShowErrorPopup(true);
          setErrorPopupMSG({title:"Wrong 401!",subTitle:"SEND TASK ERROR "})
          console.error("SEND TASK ERROR : ", error);
        },
      });
    }
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
                  {id:1,title:"custom hour",value:"custom hour"},
                  {id:2,title:"daily",value:"daily"},
                  {id:3,title:"weekly",value:"weekly"},
                  {id:4,title:"monthly",value:"monthly"},
                  {id:5,title:"yearly",value:"yearly"},
                  {id:6,title:"custom date",value:"custom"},
                ]} 
                onSelect={(val)=>{
                  setFrequency(val.value);
              }}/>
          )}
          {isRepeated === "1" && frequency === "custom hour" && (
            <div style={{display:"flex",flexWrap:"wrap",gap:20}}>
              <InputComponent label='Repeat This Task Every' placeholder='' type='number' value={String(Math.round(customHour))} onTyping={(txt)=>setCustomHour(Number(txt))}/>
              <h6 style={{color:app_identity.secondary_color}}>*Hours</h6>
            </div>
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
                }}
                />
          </div>
          <p onClick={()=>router.back()} style={{flex:5,cursor:"pointer"}}>Cancel</p>
        </div>
      </div>
    </div>
  )
}

export default AutomationForm
