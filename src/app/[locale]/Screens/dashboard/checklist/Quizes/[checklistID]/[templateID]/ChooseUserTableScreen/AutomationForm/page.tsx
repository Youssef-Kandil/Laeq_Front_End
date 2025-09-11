"use client";
import React from 'react'

import {useRouter } from "next/navigation"; 

import DateInputComponent from '@/app/components/global/InputsComponents/DateInputComponent/DateInputComponent';
import TimeInputComponent from '@/app/components/global/InputsComponents/TimeInputComponent/TimeInputComponent';
import DropListComponent from '@/app/components/global/InputsComponents/DropListComponent/DropListComponent';
import BottonComponent from '@/app/components/global/ButtonComponent/BottonComponent';


function AutomationForm() {
    const router = useRouter();
  return (
    <div style={{margin:"0px 30px",}}>
        <p style={{fontWeight:500,fontSize:20,margin:'20px 0 30px 0'}}>Select a single date & time or repeated date & time</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:20}}>
        <DateInputComponent onChange={()=>{}}/>
        <TimeInputComponent onChange={()=>{}}/>
      </div>
      <DropListComponent label='Repeated' placeholder='Select if this task Repeated or not' list={[]} onSelect={()=>{}}/>
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

export default AutomationForm
