"use client";
import React ,{useState}from 'react'
import Styles from './login.module.css'
import { Alert ,AlertTitle,Stack} from '@mui/material';
import { signInWithGoogle } from "../../../../lib/firebase";
import login_services from '@/app/services/website/login_services';
import regex from '@/app/utils/regex';
import encryption from '@/app/utils/encryption';
// === Components ===
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from "next/link";
import {useTranslations,useLocale} from 'next-intl';
import Cookies from "js-cookie";

import { useLogin } from '@/app/Hooks/useLogin';

import { useQueryClient } from '@tanstack/react-query';



function Login() {
  const lang = useLocale();
  const router = useRouter();
  const t = useTranslations('login_screen')




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
const { mutate } = useLogin();

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
            console.warn(data);
            // خزّن البيانات في الكاش
            if (data) {
               if (data?.role) {   
                  queryClient.setQueryData(["AccountInfo"], data);
                  const token = JSON.stringify(data);
                  const key = process.env.NEXT_PUBLIC_HASH_KEY || ""
                 const info =  encryption.encryption(token,key)
                 console.warn("INFOOO :: ",info)
                  // localStorage.setItem("AccountInfo",info)
                  Cookies.set("AccountInfo", info, { expires: 90 });
                  if (data?.role == "admin") {
                    router.replace(`/${lang}/Screens/dashboard/payments_plans`);
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

// Example of the loggedInUser.providerData[0] object returned from Google Sign-In
// displayName: "youssf kandil"
// email: "youssfkandil79@gmail.com"
// phoneNumber: null
// photoURL: "https://lh3.googleusercontent.com/a/ACg8ocL8j-J0zOBIvLcsDDRt5RzP17B89adQqHivPiF8EKoZ_wfN=s96-c"
// providerId: "google.com"
// uid: "113488656261148336375"

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
    // Call the signInWithGoogle function from firebase
    const loggedInUser = await signInWithGoogle();
    const userData = loggedInUser?.providerData[0];

    console.log("email ",userData?.email);
    console.log("provider ",userData?.providerId);
    console.log("providerId ",userData?.uid);
    console.log("userData ",userData);

    // Check if the user data is available
    if (userData?.email && userData?.providerId && userData?.email != null && userData?.providerId != null ) {
        // Hash the Data
        const hashed_Email : string = encryption.encryption(userData?.email,process.env.NEXT_PUBLIC_HASH_KEY as string)
      //Call the login service
        const result = await login_services.Goolge_login(hashed_Email,userData?.providerId);
        console.log("result Sign in Google ",result);
        // Check if the login was successful And Go To Dashboard
        if(result){
          console.log("Login successful");
          // Redirect to the dashboard or perform any other action
        }
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
        </div>
        {/* === Login Button */}
        <div className={Styles.login_btn} onClick={handleLogin}>
         {t("submit_button")}
        </div>

        <span>{t("OR")}</span>

        <div className={Styles.google_login} onClick={handleLoginWithGoogle}>
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

