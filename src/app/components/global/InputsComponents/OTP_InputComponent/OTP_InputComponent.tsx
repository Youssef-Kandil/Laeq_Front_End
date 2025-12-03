/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useRef, useState, useEffect } from "react";
import Styles from "./otpInputComponent.module.css";
import regex from "@/app/utils/regex";
import { useRequestOTP } from "@/app/Hooks/useOTP";
import { TbReload } from "react-icons/tb";

interface Props {
  length: number;
  onChange: (otp: string) => void;
  onResend?: () => void;
  disabled?: boolean;
  timerSeconds?: number;
  email?: string;
}

const OTP_InputComponent: React.FC<Props> = ({
  length,
  onChange,
  onResend,
  disabled = false,
  timerSeconds = 60,
  email,
}) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(timerSeconds);
  const [isCounting, setIsCounting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const requestOTP = useRequestOTP();

  // 🔄 إدارة العد التنازلي
  useEffect(() => {
    if (!isCounting) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCounting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isCounting]);

  const handleChange = (index: number, value: string) => {
    value = value.replace(/[^0-9]/g, "");
    if (value.length > 1) value = value.charAt(value.length - 1);

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
    onChange(newValues.join(""));

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    // ✅ تحقق من صحة الإيميل قبل الإرسال
    if (!email || !regex.email.test(email)) {
      setError("Please enter a valid email address before resending the code.");
      return;
    }

    setError(null); // إزالة أي خطأ سابق
    setSecondsLeft(timerSeconds);
    setIsCounting(true);
    setValues(Array(length).fill(""));
    onChange("");

    requestOTP.mutate(
      { email },
      {
        onSuccess: (res) => {
          console.log("✅ OTP re-sent successfully:", res);
          setError(null);
          onResend?.();
        },
        onError: (err: any) => {
          console.error("❌ Error resending OTP:", err);
          setError("Failed to resend OTP. Please try again.");
        },
      }
    );

    inputsRef.current[0]?.focus();
  };

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.otpContainer}>
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            className={Styles.otpInput}
            type="text"
            inputMode="numeric"
            maxLength={1}
            disabled={disabled}
            value={values[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
          />
        ))}
      </div>

      {/* 🟥 رسالة الخطأ */}
      {error && <p className={Styles.errorText}>{error}</p>}

      <div className={Styles.timerContainer}>
        {isCounting ? (
          <span className={Styles.timerText}>
            Resend code in {secondsLeft} seconds
          </span>
        ) : (
          <button
            onClick={handleResend}
            className={Styles.resendButton}
            disabled={requestOTP.isPending}
          >
            {requestOTP.isPending ? "Sending..." : (
              <>
                Resend Code <TbReload />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default OTP_InputComponent;
