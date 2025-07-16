"use client";
import React from 'react'

import {useLocale} from 'next-intl';
import {usePathname, useRouter } from "next/navigation"; 
import { SelectChangeEvent } from '@mui/material';
import BottonComponent from '@/app/components/global/ButtonComponent/BottonComponent';

import InputComponent from '@/app/components/global/InputComponent/InputComponent';
import DropListComponent from '@/app/components/global/DropListComponent/DropListComponent';

function AddUserForm() {
    const current_lang = useLocale();
    const router = useRouter();

  return (
    <div style={{margin:"30px"}}>
        <div style={{display:'flex',flexWrap:"wrap",maxWidth:900,alignItems:"center",gap:20}}>
            <InputComponent label='Fullname' placeholder='Please enter your fullname' value='' onTyping={()=>{}}/>
            <InputComponent label='Email' placeholder='Please enter your email' value='' onTyping={()=>{}}/>
            <InputComponent label='Username' placeholder='Please enter your username' value='' onTyping={()=>{}}/>
            <InputComponent label='Phone number' placeholder='Please enter your phone number' value='' onTyping={()=>{}}/>
            <InputComponent label='Job title' placeholder='Please enter your job title' value='' onTyping={()=>{}}/>
            <InputComponent label='Password' placeholder='Please enter your password' value='' onTyping={()=>{}}/>
            <DropListComponent label='Company' placeholder='Choose your Company' list={[]}  onSelect={()=>{}}/>
            <DropListComponent label='Department' placeholder='Choose your Departnment' list={[]}  onSelect={()=>{}}/>
            <DropListComponent label='Role' placeholder='Choose your Role' list={[]}  onSelect={()=>{}}/>
            <DropListComponent label='Site' placeholder='Choose your Site' list={[]}  onSelect={()=>{}}/>
        </div>

      <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            margin: '20px 10px 0px 10px' ,
        }}>
        <div style={{flex:1}}>
          <BottonComponent title='Save'/>
        </div>
        <p onClick={()=>router.back()} style={{flex:5,cursor:"pointer"}}>Cancel</p>
      </div>
    </div>
  )
}

export default AddUserForm
