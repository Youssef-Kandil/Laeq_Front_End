"use client";
import React, { useRef, useState, useEffect } from "react";
import Styles from "./TimeInputComponent.module.css";
import { MdAccessTime } from "react-icons/md";
import app_identity from "@/app/config/identity";

interface Props {
  onChange: (selectedTime: string) => void;
  defaultValue?: string;
  disabled?: boolean;
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
    if (disabled) return;
    inputRef.current?.showPicker?.();
    inputRef.current?.focus();
  };

  function formatDisplay(timeStr: string) {
    if (!timeStr || timeStr === "--:--") return "--:--";
    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes));
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div
      id={Styles.datePiker}
      className={`${Styles.input_container} ${disabled ? Styles.disabled : ""}`}
      style={{ position: "relative" }}
      onClick={openTimePicker}
    >
      <span className={Styles.dateLable}>Time :</span>

      <div>
        <span>{formatDisplay(selectedTime)}</span>
      </div>

      <span
        
        style={{
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          position: "relative",
        }}
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
          position: "absolute",
          right: "8px",
          width: "30px",
          height: "30px",
          top: "50%",
          transform: "translateY(-50%)",
          opacity: 0,
          cursor: "pointer",
        }}
      />
    </div>
  );
}

export default TimeInputComponent;
