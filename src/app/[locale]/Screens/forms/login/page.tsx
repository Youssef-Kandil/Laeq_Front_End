"use client";
import React ,{useState,useEffect}from 'react'
import Styles from './login.module.css'
import { Alert ,AlertTitle,Stack} from '@mui/material';
import { signIn, useSession,signOut  } from "next-auth/react";
// import { signInWithGoogle } from "../../../../lib/firebase";
// import login_services from '@/app/services/website/login_services';
import regex from '@/app/utils/regex';
import encryption from '@/app/utils/encryption';
// === Components ===
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from "next/link";
import {useTranslations,useLocale} from 'next-intl';
import Cookies from "js-cookie";

import { useLogin , useGoogleLogin } from '@/app/Hooks/useLogin';

import { useQueryClient } from '@tanstack/react-query';



function Login() {
  const lang = useLocale();
  const router = useRouter();
  const { data: session } = useSession();
  const t = useTranslations('login_screen');

  Cookies.remove("AccountInfo");
  Cookies.remove("next-auth.callback-url");
  Cookies.remove("next-auth.csrf-token");
  Cookies.remove("next-auth.session-token");
  React.useEffect(() => {
   if (session) {
     // أول ما يفتح صفحة الساين اب لو في سيشن اعمله لوج اوت
     signOut({ redirect: false });
   }
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);
  console.log("Google session :: ",session)





  //  START STATE ===
  const [email,setEmail] = useState<string>("") ;
  const [password,setPassword] = useState<string>("");
  const [error,setError] = useState<string>("");
  // const [isLoading,setIsLoading] = React.useState<boolean>(false);
  const [alertSeverity,setAlertSeverity] = React.useState<"success" | "info" | "warning" | "error">("warning");
  const[ alertState,setAlertState] = React.useState<boolean>(false);
  //  END STATE ===

  // START FUNCTIONS ===
  const queryClient = useQueryClient();
const { mutate:googleLogin } = useGoogleLogin();
const { mutate } = useLogin();

useEffect(()=>{
  if (session?.user?.email) {
    googleLogin(
      { email: session.user.email },
      {
        onSuccess: (data) => {
          console.warn("Backend response:", data);
          if (data) {
            if (data?.role) {
              queryClient.setQueryData(["AccountInfo"], data);
              const token = JSON.stringify(data);
              const key = process.env.NEXT_PUBLIC_HASH_KEY || "";
              const info = encryption.encryption(token, key);
              localStorage.setItem("AccountInfo",info)
              // Cookies.set("AccountInfo", info, { expires: 90 });
  
              const isFirstTime = localStorage.getItem("first_time");
              if (data.role === "admin") {
                if (!isFirstTime) {
                  router.replace(`/${lang}/Screens/dashboard/company/AddCompanyForm`);
                } else {
                  router.replace(`/${lang}/Screens/dashboard/payments_plans`);
                }
              } else {
                router.replace(`/${lang}/Screens/dashboard/tasks`);
              }
            }
          }else{
            setAlertState(true);
            setAlertSeverity("error");
            setError(`Can't Find User With Email : ${session?.user?.email}`);
          }
        },
        onError: () => {
          setAlertState(true);
          setAlertSeverity("error");
          setError("Can't login");
        },
      }
    );
  }


},[googleLogin, lang, queryClient, router, session])

const handleLogin = () => {
  setAlertState(false);
  setAlertSeverity("warning");

  if (!email || !password || email.trim() === "" || password.trim() === "") {
    setAlertState(true);
    setError("Please enter both email and password.");
    return;
  }

  if (!regex.email.test(email)) {
    setAlertState(true);
    setError("Please enter a valid email address.");
    return;
  }

      setError("");

      mutate(
        { email, password },
        {
          onSuccess: (data) => {
            if (data) {
               if (data?.role) {   
                  queryClient.setQueryData(["AccountInfo"], data);
                  const token = JSON.stringify(data);
                  const key = process.env.NEXT_PUBLIC_HASH_KEY || ""
                 const info =  encryption.encryption(token,key)
                 console.warn("INFOOO :: ",info)
                  localStorage.setItem("AccountInfo",info)
                 const isFirstTime = localStorage.getItem("first_time")
                //  Cookies.set("AccountInfo", JSON.stringify(info), {
                //   expires: 90,
                //   path: "/",
                //   sameSite: "Lax"
                // });
                //  Cookies.set("AccountInfo", info, {
                //   expires: 90,
                //   path: "/",
                //   sameSite: "Lax"
                // });
                  if (data?.role == "admin") {
                    if (!isFirstTime) {
                      router.replace(`/${lang}/Screens/dashboard/company/AddCompanyForm`);        
                    }else{
                      router.replace(`/${lang}/Screens/dashboard/summeries`);
                    }
                  }else{
                    router.replace(`/${lang}/Screens/dashboard/tasks`);
                  }
                }
            }else{
              setAlertState(true);
              setError("Please enter a valid email address OR password.");
            }
          },
          onError: () => {
            setAlertState(true);
            setAlertSeverity("error");
            setError("فشل تسجيل الدخول");
          },
        }
      );

};

  console.log(error)



React.useEffect(() => {
  const handleKeyDown = async (e: { key: string; }) => {
    if (e.key === 'Enter') {
      console.log('Enter was pressed globally!');
      await handleLogin()
      // هنا بقى تحط الأكشن بتاعك
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  // cleanup لما الكومبوننت يتشال
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

const handleLoginWithGoogle = async () => {
  const result = await signIn("google", { redirect: false });

  console.log("Google login result:", result);

  if (result?.error) {
    setAlertState(true);
    setAlertSeverity("error");
    setError("فشل تسجيل الدخول بجوجل");
    return;
  }
};



  return (
    <div className={Styles.parent} >
      <div className={Styles.imgBox} >
        <Image className={Styles.img} src="/images/login.webp" alt="logo" width={800} height={700} />
      </div>

      <div className={Styles.form} dir={lang === "ar" ? "rtl" : "ltr"}>
        {/* === Form Headers */}
        <div>
          <h2>{t("title")} 👋 </h2>
          <p>Welcome back! component variant main layer. Pixel strikethrough style text variant edit italic scale.</p>
        </div>
        {/* === INPUTS === */}
        <div className={Styles.form_inputs}>
            <label htmlFor="email" >{t("email_label")}</label>
            <input type="text"  id="email" onChange={(e)=>setEmail(e.target.value)}  />

            <label htmlFor="password">{t("password_label")}</label>
            <input type="password"  id="password"  onChange={(e)=>setPassword(e.target.value)}  />
            <div className={Styles.have_account} style={{marginTop:5}}>
              <Link  href={`/${lang}/Screens/forms/forget_password`}>Forget Password?</Link>
            </div>
        </div>
        {/* === Login Button */}
        <div className={Styles.login_btn} onClick={handleLogin}>
         {t("submit_button")}
        </div>

        <span>{t("OR")}</span>

        <div className={Styles.google_login} onClick={()=>handleLoginWithGoogle()}>
          <Image src={'/images/google.webp'} alt='google' loading='lazy' width={20} height={20}/>
          <button >{t("google_login")}</button>
        </div>

        <div className={Styles.have_account}>
          <p>{t("Do_not_have_account")}</p> <Link  href={`/${lang}/Screens/forms/signup`}>{t("signup")}</Link>
        </div>
                {/* === Alert Message === */}
        {alertState?
            <Stack sx={{ width: '90%',position:'absolute',textAlign:'start'}} spacing={2}>
                <Alert severity={alertSeverity} onClose={() =>setAlertState(false)}>
                    <AlertTitle>{alertSeverity}</AlertTitle>
                      {error}
                </Alert>
            </Stack>
        :null}

      </div>
    </div>
  )
}

export default Login

