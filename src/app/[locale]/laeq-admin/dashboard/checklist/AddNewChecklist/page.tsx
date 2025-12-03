"use client";
import React from 'react';

import InputComponent from '@/app/components/global/InputsComponents/InputComponent/InputComponent';
import { useRouter } from "next/navigation"; 
import BottonComponent from '@/app/components/global/ButtonComponent/BottonComponent';


import { getAdminAccountInfo } from '../../../../../utils/getAccountInfo';
import { AccountInfo } from '@/app/Types/AccountsType';
import Popup from "@/app/components/global/Popup/Popup";
import Lottie from "lottie-react";
import WorngIcon  from '@/app/Lottie/wrong.json'
import LoadingIcon  from '@/app/Lottie/Loading animation blue.json'
import { ChecklistPayload } from '../../../../../Types/checklistTypes';
import { useCreateCheckList } from '@/app/Hooks/useCheckList';
import CustomSwitch from '@/app/components/global/CustomSwitch/CustomSwitch';




function AddChecklstForm() {
    const router = useRouter();
    const AdminInfo = getAdminAccountInfo("AccountInfo") as AccountInfo | null;
    const {mutate:creatNewChecklistCategory,isPending} =  useCreateCheckList();
    const [isSubmitLoading,setIsSubmiLoading] = React.useState<boolean>(false);
    const [showErrorPopup, setShowErrorPopup] =  React.useState<boolean>(false);
    const [isPublic, setIsPublic] =  React.useState<boolean>(false);
    const [ErrorPopupMSG, setErrorPopupMSG] =  React.useState<{title:string,subTitle:string}>({title:"",subTitle:""});

    const [ChecklistTitle,setChecklistTitle] = React.useState<string>("");



      const handleAddChecklistCategory = () => {
        setIsSubmiLoading(true);
        if (!AdminInfo) {
            // Handle the case where AdminInfo is null, e.g., show an error or return early
            setIsSubmiLoading(false);
            setShowErrorPopup(true);
            setErrorPopupMSG({
              title:"Failed",
              subTitle:"Something went wrong"
            })
            return;
        }
        if (ChecklistTitle.trim().length == 0) {
          setIsSubmiLoading(false);
            setShowErrorPopup(true);
            setErrorPopupMSG({
              title:"Failed",
              subTitle:"Complete all fields"
            })
            return;           
        }
        const payload:ChecklistPayload = {
           checklist_id:NaN,
          admin_id: AdminInfo.userDetails.id,
          checklist_title:ChecklistTitle,
          owner:isPublic?"laeq":AdminInfo.email
        };

        creatNewChecklistCategory(payload,{
            onSuccess:()=>{
                router.back();
            },
            onError:()=>{
                setIsSubmiLoading(false);
                setShowErrorPopup(true);
                setErrorPopupMSG({
                  title:"Failed",
                  subTitle:"Something went wrong"
                })
            },
        })



  };

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

      {showErrorPopup&&<Popup 
        icon={<Lottie animationData={WorngIcon}  loop={false} style={{ width: 350, height: 250 }}/>} 
        title={ErrorPopupMSG.title}
        subTitle={ErrorPopupMSG.subTitle}
        onClose={()=>{
          setShowErrorPopup(false);
        }} />}
      <div style={{
          margin:'12px 10px',
          padding:'0 22px'
      }}>

        <InputComponent label='Category name*' placeholder='Please enter your checklist category name' onTyping={(txt)=>{setChecklistTitle(txt)}} value={ChecklistTitle}/>


        <div style={{margin:'20px 10px'}}>
            <p>Privacy Setting</p>
            <label htmlFor="">private</label>
                <CustomSwitch checked={isPublic} onCheckedChange={(val:boolean)=>setIsPublic(val)}/>
            <label htmlFor="">public</label>
        </div>

        <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              margin: '0px 10px' ,
          }}>
          <div style={{flex:1}}>
            <BottonComponent disabled={isPending} onClick={handleAddChecklistCategory} title='Save'/>
          </div>
          <p onClick={()=>router.back()} style={{flex:5,cursor:"pointer"}}>Cancel</p>
        </div>
        
      </div>
    </div>
  )
}

export default AddChecklstForm


