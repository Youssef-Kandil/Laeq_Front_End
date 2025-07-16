"use client";
import React from 'react'
import Styles from './settings.module.css'

import InputComponent from '@/app/components/global/InputComponent/InputComponent';
import BottonComponent from '@/app/components/global/ButtonComponent/BottonComponent';
import ImagInput from '@/app/components/global/ImagInputComponent/ImagInputComponent';

// import ScoreInputComponent from '@/app/components/global/ScoreInputComponent/ScoreInputComponent';
import MultimageInputComponent from '@/app/components/global/MultimageInputComponent/MultimageInputComponent';
import FileInputComponent from '@/app/components/global/FileInputComponent/FileInputComponent';

import FormGroup from '@mui/material/FormGroup';
import CheckBoxComponent from '@/app/components/global/CheckBoxComponent/CheckBoxComponent';
import LocationInputComponent from '@/app/components/global/LocationInputComponent/LocationInputComponent';
import SignatureInputComponent from '@/app/components/global/SignatureInputComponent/SignatureInputComponent';


function AccountInfo() {

    const [location, setLocation] = React.useState("");



  const [signature, setSignature] = React.useState("");
    const handleSubmit = () => {
    if (signature) {
      console.log("✅ تم حفظ التوقيع:", signature);
      alert("تم حفظ التوقيع بنجاح ✅");
    } else {
      alert("من فضلك قم بإدخال التوقيع أولاً ✍️");
    }
  };



  return (
    <div className={Styles.AccountInfo}>
      <div className={Styles.ImageInputContainer}>
        <ImagInput lable='Upload your  picture'/>
      </div>
      <section className={Styles.InputsContainer}>
        <div>
          <InputComponent label='Full name' placeholder='Please enter your full name' type='text' value='' onTyping={()=>{}}/>
          <InputComponent label='Username' placeholder='Please enter your username' type='text' value='' onTyping={()=>{}}/>
          <InputComponent label='Confirm password' placeholder='Confirm password' type='text' value='' onTyping={()=>{}}/>
        </div>
        <div>
          <InputComponent label='Email' placeholder='Please enter your email' type='text' value='' onTyping={()=>{}}/>
          <InputComponent label='Password' placeholder='Please enter your password' type='text' value='' onTyping={()=>{}}/>
        </div>
      </section>
      {/* <ScoreInputComponent/> */}
  
      {/* <MultimageInputComponent label='hi' /> */}

      <FileInputComponent/>
      <div style={{display:"flex",width:"500px",flexWrap:"wrap"}}>
          <CheckBoxComponent label='Access all reports and data'/>
          <CheckBoxComponent label='Access all reports and data'/>
          <CheckBoxComponent label='Access all reports and data'/>

      </div>
<LocationInputComponent
  label="اختر موقعك"
  placeholder="اضغط لاختيار الموقع من الخريطة"
  value={location}
  onChange={(val) => setLocation(val)}
/>

      <SignatureInputComponent
        label="التوقيع"
        placeholder="اضغط للتوقيع"
        value={signature}
        onChange={(val) => setSignature(val)}
      />


      <div className={Styles.btnContainer}>
        <BottonComponent title='Update Profile'/>
        <p>Reset</p>
      </div>
      <div>

      </div>
    </div>
  )
}

export default AccountInfo
