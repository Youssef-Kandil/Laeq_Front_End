"use client";
import React from 'react'
import Styles from './contactUs.module.css'
import {useTranslations,useLocale} from 'next-intl'
import { InputComponent } from '@/app/components/global/InputsComponents';
import DropListComponent from '@/app/components/global/InputsComponents/DropListComponent/DropListComponent';
import TrelloService from '@/app/lib/TrelloService';
// import regex from '@/app/utils/regex';
import Lottie from 'lottie-react';
import LoadingIcon  from '@/app/Lottie/Loading animation blue.json'
import Alert from '@mui/material/Alert';

function ContactUs() {
      const Current_lang = useLocale();
      const trello = new TrelloService();
      console.log("Current Lang --> ",Current_lang)
      const t = useTranslations('contact_us')


      const [Name,setName] = React.useState<string>("");
      const [Email,setEmail] = React.useState<string>("");
      const [phone,setPhone] = React.useState<string>("");
      const [msgType,setMsgType] = React.useState<{id:number,title:string|undefined,value:string}|null>(null);
      const [msg,setMsg] = React.useState<string>("");

      const [loading,setLoading] = React.useState<boolean>(false);
      const [showErrorPopup,setShowErrorPopup] = React.useState<boolean>(false);
      const [ErrorPopupMSG,setErrorPopupMSG] = React.useState<{title:string,subTitle:string}>({title:"",subTitle:""});
      

    //   const handleChange = (event: SelectChangeEvent) => {
    //     setAge(event.target.value as string);
    //   };

    function validateForm() {
      setLoading(true);
      if (!Name.trim() || !Email.trim() || !phone.trim() || !msg.trim()|| !msgType) {
        setLoading(false);
        setErrorPopupMSG({
          title: "Missing Information",
          subTitle: "make sure all fields are filled in",
        });
        setShowErrorPopup(true);
        return false;
      }
  
      // Email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(Email)) {
        setLoading(false);
        setErrorPopupMSG({
          title: "Invalid Email",
          subTitle: "example@mail.com.",
        });
        setShowErrorPopup(true);
        return false;
      }
  
      // Phone validation (digits only, length 7-15 تقريباً)
      const phoneRegex = /^[0-9]{7,15}$/;
      if (!phoneRegex.test(phone)) {
        setLoading(false);
        setErrorPopupMSG({
          title: "Invalid Phone Number",
          subTitle: "enter a valid phone number",
        });
        setShowErrorPopup(true);
        return false;
      }
      // === Message Type validation ===
      if (!msgType) {
        setLoading(false);
        setErrorPopupMSG({
          title: "Select a Reason",
          subTitle: "Please select the reason for contacting us",
        });
        setShowErrorPopup(true);
        return false;
      }

  
      return true;
    }
  
    function handelSendToTrello(name:string,desc:string){
      if (!validateForm()) return; // لو في خطأ يوقف هنا
  
      trello.addCard(msgType?.value??"", name, desc)
        .then(card => {
          console.log("Card created:", card);
          setName("");
          setEmail("");
          setPhone("");
          setMsg("");
          setMsgType(null);
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
          console.error("Error:", err);
          setErrorPopupMSG({
            title: "Failed to Send Message",
            subTitle:
              "Please try again later",
          });
          setShowErrorPopup(true);
        });
    }

      
  return (
    <div>
      <div className={Styles.parent} lang={Current_lang}>

          <header>
              <h1>{t("title")} <span>{t("special_word")}</span> </h1>
              <p>Contact us for inquiries, feedback, or assistance. We value your time and are ready to help.</p>
          </header>

          <div className={Styles.form}>
              <InputComponent  type="text"   label="" value={Name} placeholder={t("full_name_placeholder")} onTyping={(txt)=>setName(txt)}/>
              <InputComponent type="email"  label="" value={Email} placeholder={t("email_placeholder")} onTyping={(txt)=>setEmail(txt)}/>
              <InputComponent type="number" label="" value={phone} placeholder={t("Phone_number_placeholder")} onTyping={(txt)=>setPhone(txt)}/>

              <DropListComponent 
                label=''
                placeholder="Reason" 
                list={[
                  {id:0,title:"Report a technical error",value:"690c460342aae75b27bfd22a"},
                  {id:1,title:"Report a problem",value:"690c460342aae75b27bfd22b"},
                  {id:2,title:"Suggestion for addition to future releases",value:"690c460342aae75b27bfd22c"},
                  {id:3,title:"Just contact",value:"690c460342aae75b27bfd22d"},
                  ]}
                  value={msgType}
                  onSelect={(val) =>
                    // Ensure that 'val' has the required shape for setMsgType
                    setMsgType(
                      val
                        ? {
                            id: val.id,
                            title: val.title ?? "",
                            value: val.value,
                          }
                        : null
                    )
                  }
                />
              <InputComponent isTextArea label="" value={msg} placeholder="Masseg*" onTyping={(txt)=>setMsg(txt)}/>
              {showErrorPopup && <Alert variant="filled" severity={"error"} onClick={()=>setShowErrorPopup(false)}>
                {ErrorPopupMSG.title}
              </Alert>}
              <button 
                type="button" 
                onClick={()=>handelSendToTrello(
                  `
                  ====== user info =======
                  Name : ${Name} ,
                  Email : ${Email} ,
                  Phone : ${phone} ,
                  Date : ${new Date().toLocaleString('en-GB', {
                    day: 'numeric',      // رقم اليوم
                    month: 'short',      // اختصار الشهر (Jan, Feb, Mar...)
                    year: 'numeric',     // السنة أرقام
                    hour: '2-digit',     // الساعات
                    minute: '2-digit',   // الدقايق
                    hour12: true         // نظام 12 ساعة (AM/PM)
                  })} ,
                  =============
                  `,
                  msg)}>
                {t("submit_button")}
                {loading&& <Lottie
                  animationData={LoadingIcon}
                  loop={true}
                  style={{ width: 100, height: 100 }}
                />}
              </button>
          </div>
        
      </div>
    </div>
  )
}

export default ContactUs
