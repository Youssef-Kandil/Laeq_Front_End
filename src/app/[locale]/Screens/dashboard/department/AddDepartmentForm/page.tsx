"use client";
import React from 'react'

// import {useLocale} from 'next-intl';
// import {usePathname, useRouter } from "next/navigation"; 
// import { SelectChangeEvent } from '@mui/material';
import { useRouter } from "next/navigation"; 
import BottonComponent from '@/app/components/global/ButtonComponent/BottonComponent';

import InputComponent from '@/app/components/global/InputsComponents/InputComponent/InputComponent';
import DropListComponent from '@/app/components/global/InputsComponents/DropListComponent/DropListComponent';

function AddDepartmentForm() {
    // const current_lang = useLocale();
    const router = useRouter();

  return (
    <div style={{margin:"30px"}}>
        <div style={{display:'flex',flexWrap:"wrap",maxWidth:900,alignItems:"center",gap:20}}>
            <InputComponent label='Department name' placeholder='Please enter your Department name' value='' onTyping={()=>{}}/>
            <DropListComponent label='Company' placeholder='Choose your Company' list={[]}  onSelect={()=>{}}/>
            <DropListComponent label='Site' placeholder='Choose your Site' list={[]}  onSelect={()=>{}}/>
        </div>
      <InputComponent label='Description' placeholder='Please enter your description' isTextArea={true}  value='' onTyping={()=>{}}/>

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

export default AddDepartmentForm
