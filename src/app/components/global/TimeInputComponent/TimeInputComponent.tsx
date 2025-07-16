"use client";
import React, { useRef, useState } from "react";
import Styles from './TimeInputComponent.module.css'; // لو عايز تعمل استايل مختلف للوقت
import { MdAccessTime } from "react-icons/md"; 
import app_identity from "@/app/config/identity";

interface Props {
  onChange: (selectedTime: string) => void;
}

function TimeInputComponent({ onChange }: Props) {
  const [selectedTime, setSelectedTime] = useState<string>("--:--");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setSelectedTime(newTime);
    onChange(newTime);
  };

  const openTimePicker = () => {
    inputRef.current?.showPicker?.(); // للمتصفحات الحديثة
    inputRef.current?.click();        // احتياطي
  };

  return (
    <div id={Styles.datePiker} className={Styles.input_container}>
      <span className={Styles.dateLable}>Time :</span>
      <div>
        <span>{selectedTime}</span>
      </div>
      <span
        onClick={openTimePicker}
        style={{ cursor: "pointer" }}
      >
        <MdAccessTime size={25} color={app_identity.secondary_color} />
      </span>

      <input
        ref={inputRef}
        type="time"
        onChange={handleTimeChange}
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
