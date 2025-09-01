"use client";
import React from 'react';
import DropListComponent from '@/app/components/global/DropListComponent/DropListComponent';
import {useLocale} from 'next-intl';
import {usePathname, useRouter } from "next/navigation"; 
import BottonComponent from '@/app/components/global/ButtonComponent/BottonComponent';
import Styles from './settings.module.css'

function LanguageInfo() {
    const current_lang = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    
    const [lang,setLang] = React.useState<string>(current_lang)


    const switchLanguage = (selectedLang: string) => {
      // setLang(selectedLang);
      const newPath = `/${selectedLang}${pathname.replace(/^\/(en|ar)/, "")}`;
      router.push(newPath);
    };




  return (
    <div className={Styles.LanguageInfo}>
      <DropListComponent 
        label={"Language"}
        placeholder='Choose Language'
        list={[
          { id: 1, value: "en", title: "English" },
          // { id: 2, value: "ar", title: "Arabic" }
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

      <div className={Styles.btnContainer}>
        <div style={{flex:1}}>
          <BottonComponent onClick={()=>switchLanguage(lang)} title='Save'/>
        </div>
        <p onClick={()=>setLang(current_lang)} style={{flex:8}}>Reset</p>
      </div>
      <div></div>
    </div>
  )
}

export default LanguageInfo
