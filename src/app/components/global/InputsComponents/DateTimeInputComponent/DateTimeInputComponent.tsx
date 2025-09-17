"use client";
import React, { useRef, useState, useEffect } from "react";
import Styles from "./DateTimeInputComponent.module.css";
import { MdEvent } from "react-icons/md";
import app_identity from "@/app/config/identity";

interface Props {
  onChange: (selectedDateTime: string) => void;
  defaultValue?: string;  // قيمة افتراضية زي "2025-09-16T10:30"
  disabled?: boolean;     // قفل الكومبوننت لو ترو
}

function DateTimeInputComponent({ onChange, defaultValue, disabled = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<string>(
    defaultValue || "--/--/---- --:--"
  );

  useEffect(() => {
    if (defaultValue) {
      setSelectedDateTime(defaultValue);
    }
  }, [defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedDateTime(value);
    onChange(value);
  };

  const openPicker = () => {
    if (disabled) return;
    inputRef.current?.showPicker?.();
    inputRef.current?.click();
  };

  return (
    <div
      id={Styles.datePiker}
      className={`${Styles.input_container} ${disabled ? Styles.disabled : ""}`}
    >
      <span className={Styles.dateLable}>Date & Time:</span>
      <div>
        <span>{selectedDateTime}</span>
      </div>
      <span
        onClick={openPicker}
        style={{
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <MdEvent size={25} color={app_identity.secondary_color} />
      </span>

      <input
        ref={inputRef}
        type="datetime-local"
        value={selectedDateTime.includes("--") ? "" : selectedDateTime}
        onChange={handleChange}
        disabled={disabled}
        style={{
          opacity: 0,
          position: "absolute",
          left: 0,
          top: 0,
          width: "1px",
          height: "1px",
          zIndex: -1,
        }}
      />
    </div>
  );
}

export default DateTimeInputComponent;
