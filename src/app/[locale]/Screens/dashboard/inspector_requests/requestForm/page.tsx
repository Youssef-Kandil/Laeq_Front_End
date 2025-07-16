"use client";
import React from 'react';
import DropListComponent from '@/app/components/global/DropListComponent/DropListComponent';
import {useLocale} from 'next-intl';
import {usePathname, useRouter } from "next/navigation"; 
import { SelectChangeEvent } from '@mui/material';
import BottonComponent from '@/app/components/global/ButtonComponent/BottonComponent';
import Styles from './settings.module.css'

function page() {
    const current_lang = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const [lang,setLang] = React.useState<string>(current_lang)
  return (
    <div style={{
        margin:'12px 10px'
    }}>
      <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",width:'100%',gap:30}}>
        <div style={{minWidth:300,width:250}}>
            <DropListComponent 
                label={"Company"}
                placeholder='Choose your Company'
                list={[
                { id: 1, value: "en", title: "English" },
                { id: 2, value: "ar", title: "Arabic" }
                ]}
                defaultOption={current_lang === "ar"
                ? { id: 2, value: "ar", title: "Arabic" }
                : { id: 1, value: "en", title: "English" }}
                value={{
                id: lang === "ar" ? 2 : 1,
                value: lang,
                title: lang === "ar" ? "Arabic" : "English"
                }}
                onSelect={(val) => setLang(val.value)}
            />
        </div>
        <div style={{minWidth:300,width:250}}>
            <DropListComponent 
                label={"Site"}
                placeholder='Choose your sites'
                list={[
                { id: 1, value: "en", title: "English" },
                { id: 2, value: "ar", title: "Arabic" }
                ]}
                defaultOption={current_lang === "ar"
                ? { id: 2, value: "ar", title: "Arabic" }
                : { id: 1, value: "en", title: "English" }}
                value={{
                id: lang === "ar" ? 2 : 1,
                value: lang,
                title: lang === "ar" ? "Arabic" : "English"
                }}
                onSelect={(val) => setLang(val.value)}
            />
        </div>
         


      </div>

      <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            margin: '0px 10px' ,
        }}>
        <div style={{flex:1}}>
          <BottonComponent title='Send Request'/>
        </div>
        <p onClick={()=>router.back()} style={{flex:5,cursor:"pointer"}}>Cancel</p>
      </div>
      
    </div>
  )
}

export default page
