"use client";
import React from 'react'
import Styles from './settings.module.css'

import InputComponent from '@/app/components/global/InputsComponents/InputComponent/InputComponent';
import BottonComponent from '@/app/components/global/ButtonComponent/BottonComponent';
// import ImagInput from '@/app/components/global/ImagInputComponent/ImagInputComponent';
import { MultimageInputComponent } from '@/app/components/global/InputsComponents';



function AccountInfo() {





  return (
    <div className={Styles.AccountInfo}>
      {/* <div className={Styles.ImageInputContainer}>
        <ImagInput lable='Upload your  picture'/>
      </div> */}
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

      <MultimageInputComponent label='Images' placeholder='Upload Your Images'  asPdf onChange={(previews, blobs) => console.log("PDF Blob:", blobs[0],"  ---  ","previews: ",previews)}/>


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
