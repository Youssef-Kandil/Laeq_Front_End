"use client";
import React from 'react'
import Styles from './contactUs.module.css'
import {useTranslations,useLocale} from 'next-intl'
import { InputComponent } from '@/app/components/global/InputsComponents';
import DropListComponent from '@/app/components/global/InputsComponents/DropListComponent/DropListComponent';

function ContactUs() {
      const Current_lang = useLocale();
      console.log("Current Lang --> ",Current_lang)
      const t = useTranslations('contact_us')


    //   const [age, setAge] = React.useState('');

    //   const handleChange = (event: SelectChangeEvent) => {
    //     setAge(event.target.value as string);
    //   };

      
  return (
    <div className={Styles.parent} lang={Current_lang}>

        <header>
            <h1>{t("title")} <span>{t("special_word")}</span> </h1>
            <p>Contact us for inquiries, feedback, or assistance. We value your time and are ready to help.</p>
        </header>

        <div className={Styles.form}>
            <InputComponent  type="text"   label="" value='' placeholder={t("full_name_placeholder")} onTyping={()=>{}}/>
            <InputComponent type="email"  label="" value='' placeholder={t("email_placeholder")} onTyping={()=>{}}/>
            <InputComponent type="number" label="" value='' placeholder={t("Phone_number_placeholder")} onTyping={()=>{}}/>

            <DropListComponent 
              label=''
              placeholder="Reason" 
              list={[
                {id:0,title:"Report a technical error",value:"Report a technical error"},
                {id:1,title:"Report a problem",value:"Report a problem"},
                {id:2,title:"Suggestion for addition to future releases",value:"Suggestion for addition to future releases"},
                {id:3,title:"Just contact",value:"Just contact"},
                ]}/>
            <InputComponent isTextArea label="" value='' placeholder="Masseg*" onTyping={()=>{}}/>


            <button type="button">{t("submit_button")}</button>
        </div>
      
    </div>
  )
}

export default ContactUs
