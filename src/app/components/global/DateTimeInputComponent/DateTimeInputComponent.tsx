"use client";
import React, { useRef, useState } from "react";
import Styles from './DateTimeInputComponent.module.css';
import { MdEvent } from "react-icons/md";
import app_identity from "@/app/config/identity";

interface Props {
  onChange: (selectedDateTime: string) => void;
}

function DateTimeInputComponent({ onChange }: Props) {
  const [selectedDateTime, setSelectedDateTime] = useState<string>("--/--/---- --:--");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedDateTime(value);
    onChange(value);
  };

  const openPicker = () => {
    inputRef.current?.showPicker?.();
    inputRef.current?.click();
  };

  return (
    <div id={Styles.datePiker} className={Styles.input_container}>
      <span className={Styles.dateLable}>Date & Time:</span>
      <div>
        <span>{selectedDateTime}</span>
      </div>
      <span
        onClick={openPicker}
        style={{ cursor: "pointer" }}
      >
        <MdEvent size={25} color={app_identity.secondary_color} />
      </span>

      <input
        ref={inputRef}
        type="datetime-local"
        onChange={handleChange}
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
