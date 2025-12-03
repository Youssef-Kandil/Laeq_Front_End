/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React,{useEffect} from 'react'
import Styles from './settings.module.css'

// import { useRouter } from 'next/navigation';
import InputComponent from '@/app/components/global/InputsComponents/InputComponent/InputComponent';
import BottonComponent from '@/app/components/global/ButtonComponent/BottonComponent';
import { useEditAdminAccount } from '@/app/Hooks/useAdminAccount';
import { getAdminAccountInfo ,setAdminAccountInfo} from '@/app/utils/getAccountInfo';
import type { AccountInfo } from '@/app/Types/AccountsType';
// import regex from '@/app/utils/regex';
import Popup from '@/app/components/global/Popup/Popup';
import Lottie from 'lottie-react';
import ErrorIcon from '@/app/Lottie/wrong.json'
// import OTP_InputComponent from '@/app/components/global/InputsComponents/OTP_InputComponent/OTP_InputComponent';

function AccountInfo() {
  // const router = useRouter();
  const info = getAdminAccountInfo("AccountInfo") as AccountInfo | null;
  const isEmployee = info?.role === "employee";  
  const {mutate:editAccount,isPending} = useEditAdminAccount();
  


  const [showPopup,setShowPopup] = React.useState<boolean>(false);
  const [PopupMSG,setPopupMSG] = React.useState<{title:string,subTitle:string}>({title:"",subTitle:""});

  const [showErrorPopup,setShowErrorPopup] = React.useState<boolean>(false);
  const [ErrorPopupMSG,setErrorPopupMSG] = React.useState<{title:string,subTitle:string}>({title:"",subTitle:""});

  const [fullName, setFullName] = React.useState<string|null>(null);
  const [phone, setPhone] = React.useState<string|null>(null);
  const [email, setEmail] = React.useState<string|null>(null);
  useEffect(()=>{
    setFullName(info?.userDetails.full_name??"");
    setPhone(info?.userDetails?.phone??"");
    setEmail(info?.email??"");
  },[])
  if (isEmployee) {
    return <p>✨ Oops! It looks like you don’t have access to this page. If You Need Ask Your Admin To Change Your Data</p>
  }
  if (!info?.email) {
    return <p>✨ Oops! It looks like you don’t have access to this page. re-login and try again</p>
  }

  function handelValidation(){
    if (!fullName) {
      setShowErrorPopup(true);
      setErrorPopupMSG({
        title:"warn!",
        subTitle:"Must Add Full Name"
      });
      return false;
    }

    if (phone == null) {
      setShowErrorPopup(true);
      setErrorPopupMSG({
        title:"warn!",
        subTitle:"Must phone number"
      });
      return false;  
      
    }

    return true;

  }


  function handelSubmit(){

    if (handelValidation()) {      
      editAccount(
          {
            id:info?.id??-1,
            admin_id:info?.userDetails?.id??-1 ,
            email:email??"",
            phone:phone??"",
            full_name:fullName??""
          },
          {
            onSuccess:()=>{
              const updatedInfo: AccountInfo = {
                ...info!,
                userDetails: {
                  ...info?.userDetails,
                  id: info?.userDetails?.id ?? -1,
                  full_name: fullName ?? "",
                  phone: phone ?? "",
                },
              };
              const isSet  = setAdminAccountInfo("AccountInfo",updatedInfo);
              if(isSet){
                setShowPopup(true);
                setPopupMSG({
                  title:"Account Updated",
                  subTitle:"refresh to see changes"
                });
              }
            },
            onError:()=>{
              setShowErrorPopup(true);
              setErrorPopupMSG({
                title:"Wrong!",
                subTitle:"faild to Update Account"
              });
            },
          }
        )
    }
  }

  return (
    <div>
    {showPopup&&<Popup title={PopupMSG.title} subTitle={PopupMSG.subTitle} onClose={()=>setShowPopup(false)}/>}
    {showErrorPopup&&<Popup icon={<Lottie animationData={ErrorIcon}  style={{ width: 350, height: 250 }} loop={true}/>} title={ErrorPopupMSG.title} subTitle={ErrorPopupMSG.subTitle} onClose={()=>setShowErrorPopup(false)}/>}
    <div className={Styles.AccountInfo}>
      <section className={Styles.InputsContainer}>
        <div>
          <InputComponent disabled={isEmployee} label='Full name' placeholder='Please enter your full name' type='text' value={fullName??""} onTyping={(txt)=>setFullName(txt)}/>
          <InputComponent disabled={isEmployee} label='Phone Number' placeholder='Please enter your Phone Number' type='text' value={phone??""} onTyping={(txt)=>setPhone(txt)}/>
        </div>
        <div>
          <InputComponent disabled label='Email'  placeholder='Please enter your email' type='text' value={email??""} onTyping={(txt)=>setEmail(txt)}/>
        </div>
      </section>

      {/* <SignatureInputComponent label='' placeholder='' value={signature} onChange={setSignature}/> */}
      {/* <OTP_InputComponent length={4} onChange={(otp)=>{console.log("OTP: ",otp)}} email='info.youssefkandil@gmail.com'/> */}

      <div className={Styles.btnContainer}>
        <BottonComponent disabled={isPending} title='Update Profile' onClick={handelSubmit}/>
        <p>Reset</p>
      </div>
      <div>

      </div>
    </div>
       
    </div>
  )
}

export default AccountInfo
