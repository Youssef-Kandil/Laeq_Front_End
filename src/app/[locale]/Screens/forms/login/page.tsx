"use client";
import React ,{useState}from 'react'
import Styles from './login.module.css'
import { CircularProgress,Alert ,AlertTitle,Stack} from '@mui/material';
import { signInWithGoogle } from "../../../../lib/firebase";
import login_services from '@/app/services/website/login_services';
import regex from '@/app/utils/regex';
import encryption from '@/app/utils/encryption';
// === Components ===
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from "next/link";
import {useTranslations,useLocale} from 'next-intl';



function Login() {
  const lang = useLocale();
  console.log("Current Lang --> ",lang)
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

  const handleLogin = async () => {
    setAlertState(false);
    setAlertSeverity("warning");
    // Check if the email and password are not empty
    if (!email || !password) {

      setAlertState(true);
      setError("Please enter both email and password.");
      return;
    }
    if(email.length == 0 || password.length == 0){
      setAlertState(true);
      setError("Please enter both email and password.");
      return;
    }
    if(email.trim() == "" || password.trim() == ""){
      setAlertState(true);
      setError("Please enter both email and password.");
      return;
    }
    // Check if the email is valid
    if (regex.email.test(email) == false) {
      setAlertState(true);
      setError("Please enter a valid email address.");
           return;
    }
    // Check if the password is valid
    // if (regex.password.test(password) == false) {
    //       setAlertState(true);
    //       setError("Please enter a valid password.");
    //        return;
    // }

    // Hash the Data
    // const hashed_Email : string = encryption.encryption(email,process.env.NEXT_PUBLIC_HASH_KEY as string)
    // const hashed_Password : string = encryption.encryption(password,process.env.NEXT_PUBLIC_HASH_KEY as string)
    
    // If all checks pass, proceed with login
    setError("");
    // console.log("Login with email: ",email," and password: ",password);
    // console.log("Login with hashed_Email: ",hashed_Email," and hashed_Password: ",hashed_Password);
    // Call the login service
    // const result = await login_services.login(hashed_Email,hashed_Password)
    const result = await login_services.login(email,password)
    console.log("Login : ",result);
    // Check if the login was successful And Go To Dashboard
    if(result){
      console.log("Login successful");
      localStorage.setItem('clickedAsideTitle', "dashboard");
      // Redirect to the dashboard or perform any other action
      redirect(`/${lang}/Screens/dashboard/summeries`);
    }else{
      setAlertState(true);
      setAlertSeverity("error")
      setError("فشل تسجيل الدخول")
    }
  }
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

