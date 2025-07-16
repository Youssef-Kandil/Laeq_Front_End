"use client";
import React from 'react';

import InputComponent from '@/app/components/global/InputComponent/InputComponent';
import CheckBoxComponent from '@/app/components/global/CheckBoxComponent/CheckBoxComponent';
import {useLocale} from 'next-intl';
import {usePathname, useRouter } from "next/navigation"; 
import BottonComponent from '@/app/components/global/ButtonComponent/BottonComponent';
import app_identity from '@/app/config/identity';


function AddRoleForm() {
    const current_lang = useLocale();
    const router = useRouter();
    const pathname = usePathname();

  return (
    <div style={{
        margin:'12px 10px',
        padding:'0 22px'
    }}>

        <InputComponent label='Role Name*' placeholder='Please enter your role name' onTyping={()=>{}} value=''/>

        <InputComponent 
            label='Description' 
            placeholder='Please enter your description' 
            onTyping={()=>{}}
             value=''
             isTextArea
            />

        <div style={{margin:'20px 0'}}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <p style={{fontSize:16,fontWeight:500}}>Role Permissions</p>
                <p style={{color:app_identity.secondary_color,textDecorationLine:'underline',cursor:'pointer'}}>more</p>
            </div>
          <CheckBoxComponent label='Access all reports and data' />
          <CheckBoxComponent label='Access all reports and data'/>
          <CheckBoxComponent label='Access all reports and data'/>
          <CheckBoxComponent label='Access all reports and data'/>
          <CheckBoxComponent label='Access all reports and data'/>
          <CheckBoxComponent label='Access all reports and data'/>
          <CheckBoxComponent label='Access all reports and data'/>
          <CheckBoxComponent label='Access all reports and data'/>
          <CheckBoxComponent label='Access all reports and data'/>
          <CheckBoxComponent label='Access all reports and data'/>
          <CheckBoxComponent label='Access all reports and data'/>
          <CheckBoxComponent label='Access all reports and data'/>
          <CheckBoxComponent label='Access all reports and data'/>
          <CheckBoxComponent label='Access all reports and data'/>
          <CheckBoxComponent label='Access all reports and data'/>
       </div>

      <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            margin: '0px 10px' ,
        }}>
        <div style={{flex:1}}>
          <BottonComponent title='Save'/>
        </div>
        <p onClick={()=>router.back()} style={{flex:5,cursor:"pointer"}}>Cancel</p>
      </div>
      
    </div>
  )
}

export default AddRoleForm

