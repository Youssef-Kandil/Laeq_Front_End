/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Styles from "./forget_password.module.css";
import regex from "@/app/utils/regex";
import { useRouter } from "next/navigation";
import {
  useCheckEmail,
  useUpdateForgetPassword,
} from "@/app/Hooks/useForgetPassword";
import OTP_InputComponent from "@/app/components/global/InputsComponents/OTP_InputComponent/OTP_InputComponent";
import { useRequestOTP,useVerifyOTP } from "@/app/Hooks/useOTP";

function ResetPasswordWizard() {
    const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [direction, setDirection] = React.useState(0);

  // === States for inputs ===
  const [email, setEmail] = React.useState("");
  const [OTP, setOTP] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);


  // === Mutations ===
  const { mutate: checkEmail, isPending: checkingEmail } =
  useCheckEmail();
  const { mutate: RequestOTP } =
  useRequestOTP();
  const { mutate: VerifyOTP, isPending: verfyingOTP } =
  useVerifyOTP();

  const { mutate: updatePassword, isPending: updateLoading } =
    useUpdateForgetPassword();

  // === Animation Variants ===
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  // === Step Handler ===
  function handleNext() {
    setError(null);

    if (step === 1) {
      if (!email.trim()) return setError("Please enter your email.");
      if (!regex.email.test(email)) return setError("Please enter a valid email.");
      //  ===== 1- CHECK IF EMAIL IS Exists IN Data Base
      checkEmail(
        { email },
        {
          onSuccess: (res: any) => {
            if(res){
              // ==== 2- SEND OTP TO EMAIL
              RequestOTP(
                { email },
                {
                  onSuccess: () => {
                      setDirection(1);
                      setStep(2);
                  },
                  onError: (err: any) => setError(err.message || "can't send OTP."),
                }
              );

            }else{
                setError("Please enter a valid email.")
            }
          },
          onError: (err: any) => setError(err.message || "Invalid email."),
        }
      );
    }

    if (step === 2) {
      if (!OTP.trim()) return setError("Please Enter OTP.");
      if (OTP.length == 4) {
        VerifyOTP(
          { email ,otp:OTP},
          {
            onSuccess: (res) => {
              if (res != null) {
                  setDirection(1);
                  setStep(3);
              }else{
                  setError("OTP is Invalid.")
              }
            },
            onError: () => setError("OTP is Invalid."),
          }
        );
      }else{
         setError("Please Enter OTP.")
      }

    }

    if (step === 3) {
      if (!password.trim() || !confirmPassword.trim())
        return setError("Please fill in both password fields.");
      if (!regex.password.test(password))
        return setError("Password is not valid.");
      if (password !== confirmPassword)
        return setError("Passwords do not match.");

      updatePassword(
        { email, password },
        {
          onSuccess: () => {
            router.back();
          },
          onError: (err: any) =>
            setError(err.message || "Failed to update password."),
        }
      );
    }
  }

  function prevStep() {
    setError(null);
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }else{
        router.back();
    }
  }

  return (
    <div className={Styles.parent}>
      <div className={Styles.form}>
        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.div
              key="step1"
              variants={variants}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4 }}
              className={Styles.step}
            >
              <h2 className={Styles.title}>Step 1: Enter Email</h2>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={Styles.input}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={variants}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4 }}
              className={Styles.step}
            >
              <h2 className={Styles.title}>Step 2: Verify Email</h2>
              <OTP_InputComponent length={4} onChange={(otp)=>setOTP(otp)} email={email}/>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={variants}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4 }}
              className={Styles.step}
            >
              <h2 className={Styles.title}>Step 3: Set Password</h2>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={Styles.input}
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={Styles.input}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {error && <p className={Styles.error}>{error}</p>}

        {/* Buttons */}
        <div className={Styles.buttons}>
          <button
            onClick={prevStep}
            // disabled={step === 1}
            className={Styles.back}
          >
            {step === 1?"Cancel":"Back"}
            
          </button>
          <button onClick={handleNext} className={Styles.next}>
            {step === 3? 
              updateLoading? "Submitting...": "Submit"
              : step === 2? 
              verfyingOTP? "Checking...": "Next"
              : 
              checkingEmail? "Loading...": "Next"
              }
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordWizard;
