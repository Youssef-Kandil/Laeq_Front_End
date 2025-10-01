"use client";
/* eslint-disable @next/next/no-img-element */
import React from "react";
import Styles from "./laeq_login.module.css";
import { InputComponent } from "@/app/components/global/InputsComponents";
import BottonComponent from "@/app/components/global/ButtonComponent/BottonComponent";
import regex from "@/app/utils/regex";
import { useLogin } from "@/app/Hooks/useLogin";
import app_identity from "@/app/config/identity";
import Link from "next/link";
import { useLocale } from "next-intl";

function Laeq_login() {
    const lang = useLocale();
  // ==== STATES ====
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  // ==== LOGIN HANDLER ====
  const {mutate:login,isPending} = useLogin();
  function handleLogin() {
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    if (!regex.email.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!regex.password.test(password)) {
      setError("Please enter a valid Password.");
      return;
    }


    
    // هنا تحط API login call
    login({email,password},{
        onSuccess:(data)=>{
            console.log("Logging in with:", { email, password },"data :",data);        
        },
        onError:(err)=>{
            setError(`Login Error : ${err}`);

        },
    })
  }

  return (
    <div className={Styles.parent}>
      <section className={Styles.form}>
        <div className={Styles.formHeader}>
          <img src="/images/شعار لائق -06.jpeg" loading="lazy" alt="logo" />
          <div>
            <h3>Welcome back!</h3>
            <p>Login to your account</p>
          </div>
        </div>

        <div className={Styles.formInputs}>
          <InputComponent
            label=" "
            placeholder="Email Address"
            value={email}
            onTyping={(txt) => setEmail(txt)}
          />
          <InputComponent
            label=" "
            placeholder="Password"
            value={password}
            onTyping={(txt) => setPassword(txt)}
            type="password"
          />
          <Link 
            href={`/${lang}/laeq-admin/forget_password`}  
            style={{textAlign:"right",color:app_identity.secondary_color,cursor:"pointer",display: "block",}}>
                Forget Password?
            </Link>
          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
        </div>

        <BottonComponent
          title={isPending ? "Loading..." : "Login"}
          onClick={handleLogin}
          disabled={isPending}
        />
      </section>
    </div>
  );
}

export default Laeq_login;
