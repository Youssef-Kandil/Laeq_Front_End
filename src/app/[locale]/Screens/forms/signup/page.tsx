"use client";
import React from 'react'
import Styles from './signup.module.css'
import { CircularProgress,Alert ,AlertTitle,Stack} from '@mui/material';
// import { usePathname, useRouter } from "next/navigation"; 
import signup_services from '@/app/services/website/signup_services';
import regex from '@/app/utils/regex';
import { signInWithGoogle } from "../../../../lib/firebase";
// === Components ===
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {useTranslations,useLocale} from 'next-intl';




function Signup() {
  //   const pathname = usePathname();
  //  const router = useRouter();
   const current_lang = useLocale();
   const t = useTranslations('signup_screen');
   const t_alerts = useTranslations('alerts');

   // === STATE ===
   const [full_name,setFullName] = React.useState("");
   const [email,setEmail] = React.useState("");
   const [phone,setPhone] = React.useState("");
   const [password,setPassword] = React.useState("");
   const [confirm_password,setConfirmPassword] = React.useState("");
   const [alertMSG,setAlertMSG] = React.useState("");
   const [isLoading,setIsLoading] = React.useState<boolean>(false);
   const [alertSeverity,setAlertSeverity] = React.useState<"success" | "info" | "warning" | "error">("warning");
   const[ alertState,setAlertState] = React.useState<boolean>(false);


   // === Validation Inputes Values ===
   function validationFunctions():boolean {
    // === Check if the inputs are empty ===
        if(full_name.trim() === "" && email.trim() === "" && phone.trim() === "" && password.trim() === "" && confirm_password.trim() === ""){
          setAlertState(true);
          setAlertSeverity("warning");
          setAlertMSG(t_alerts("warning.missing_data"));
          return false ;
        }
        // === Check if the inputs are valid ===
        if(!regex.user_name.test(full_name)){
          setAlertState(true);
          setAlertSeverity("warning");
          setAlertMSG(t_alerts("warning.wrong_data"));
          return false ;
        }
        if(!regex.email.test(email)){
          setAlertState(true);
          setAlertSeverity("warning");
          setAlertMSG(t_alerts("warning.wrong_email"));
          return false ;
        }
        // if(!regex.phone.test(phone)){
        //   setAlertSeverity("warning");
        //   setAlertMSG(t_alerts("warning.wrong_phone_number"));
        //   setAlertState(true);
        //   return false ;
        // }
        if(!regex.password.test(password)){
          setAlertSeverity("warning");
          setAlertMSG(t_alerts("warning.wrong_password"));
          setAlertState(true);
          return false ;
        }
        if(password !== confirm_password){
          setAlertSeverity("warning");
          setAlertMSG(t_alerts("warning.confirm_password_not_match"));
          setAlertState(true);
            return false ;
        }

        return true;
   } 

 // === Handle Submit ===
    async function handleSubmit(){
      setAlertState(true);
          const isValide :boolean =  validationFunctions();
          console.log('Enter was pressed isValide!',isValide);  
          if (!isValide) {
              return;
            }

            setAlertState(false);
            setIsLoading(true);
          // === Call the API ===
          const response = await signup_services.createAcount(email,password,full_name,phone);
          console.log("Response from API : ",response);
          setIsLoading(false);
          if(response){
            // === redirect to the dashboard ===
            redirect(`${current_lang}/Screens/dashboard/summeries`);
          }
    }



  const handleSignupWithGoogle = async () => {
    const loggedInUser = await signInWithGoogle();
    console.log(loggedInUser);
  };

  React.useEffect(() => {
    const handleKeyDown = async (e: { key: string; }) => {
      if (e.key === 'Enter') {
        console.log('Enter was pressed globally!');
         handleSubmit()

      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    // cleanup لما الكومبوننت يتشال
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [full_name,email,phone,password,confirm_password]);
  
  
  return (
    <div className={Styles.parent} >
      <div className={Styles.imgBox} >
        <Image className={Styles.img} src="/images/signup.webp" alt="logo" width={800} height={700} />
      </div>

      <div className={Styles.form} dir={current_lang === "ar" ? "rtl" : "ltr"}>
        {/* === Form Headers */}
        <div>
          <h2>{t("title")}</h2>
        </div>
        {/* === INPUTS === */}
        <div className={Styles.form_inputs}>
            <label htmlFor="full_name" >{t("full_name_label")}</label>
            <input type="text"  id="full_name" value={full_name} onChange={(e)=>setFullName(e.target.value)}  />

            <label htmlFor="email" >{t("email_label")}</label>
            <input type="text"  id="email" value={email} onChange={(e)=>setEmail(e.target.value)} />

            <label htmlFor="phone" >{t("Phone_number_label")}</label>
            <input type="number" id="phone" value={phone} onChange={(e)=>setPhone(e.target.value)} />
            
            <label htmlFor="password">{t("password_label")}</label>
            <input type="password"  id="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>

            <label htmlFor="Confirm_Password">{t("Confirm_Password_label")}</label>
            <input type="password"  id="Confirm_Password" value={confirm_password} onChange={(e)=>setConfirmPassword(e.target.value)} />
        </div>

        {/* === signup Button === */}
        <div className={Styles.signup_btn} onClick={handleSubmit}>
         {t("submit_button") }
         {isLoading && <CircularProgress className={Styles.laoder} size={25} />}
        </div>

        <span className={Styles.span}>{t("OR")}</span>

        <div className={Styles.google_signup} onClick={handleSignupWithGoogle}>
          <Image src={'/images/google.webp'} alt='google' loading='lazy' width={20} height={20}/>
          <button >{t("google_signup")}</button>
        </div>

        <div className={Styles.have_account}>
            <p>{t("already_have_an_account")}</p> <Link  href={`/${current_lang}/Screens/forms/login`}>{t("login")}</Link>
        </div>
        {/* === Alert Message === */}
        {alertState?
          <Stack sx={{ width: '90%',position:'absolute',textAlign:'start'}} spacing={2}>
            <Alert severity={alertSeverity} onClose={() =>setAlertState(false)}>
                <AlertTitle>{alertSeverity}</AlertTitle>
                {alertMSG}
            </Alert>
          </Stack>
        :null}

      </div>
    </div>
  );

}

export default Signup

