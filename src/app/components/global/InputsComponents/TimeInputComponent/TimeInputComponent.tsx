"use client";
import React, { useRef, useState, useEffect } from "react";
import Styles from "./TimeInputComponent.module.css";
import { MdAccessTime } from "react-icons/md";
import app_identity from "@/app/config/identity";

interface Props {
  onChange: (selectedTime: string) => void;
  defaultValue?: string;   // قيمة افتراضية زي "12:00"
  disabled?: boolean;      // عشان تمنع الفتح
}

function TimeInputComponent({ onChange, defaultValue = "--:--", disabled = false }: Props) {
  const [selectedTime, setSelectedTime] = useState<string>(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedTime(defaultValue);
  }, [defaultValue]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setSelectedTime(newTime);
    onChange(newTime);
  };

  const openTimePicker = () => {
    if (disabled) return; // لو الديسابل ترو ميفتحش
    inputRef.current?.showPicker?.();
    inputRef.current?.click();
  };

  return (
    <div
      id={Styles.datePiker}
      className={`${Styles.input_container} ${disabled ? Styles.disabled : ""}`}
    >
      <span className={Styles.dateLable}>Time :</span>
      <div>
        <span>{selectedTime}</span>
      </div>
      <span
        onClick={openTimePicker}
        style={{ cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 }}
      >
        <MdAccessTime size={25} color={app_identity.secondary_color} />
      </span>

      <input
        ref={inputRef}
        type="time"
        onChange={handleTimeChange}
        value={selectedTime === "--:--" ? "" : selectedTime}
        disabled={disabled}
        style={{
          opacity: 0,
          position: "absolute",
          left: "230px",
          top: "100%",
          width: "1px",
          height: "1px",
          zIndex: -1,
        }}
      />
    </div>
  );
}

export default TimeInputComponent;
