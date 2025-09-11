"use client";
import React from 'react'
import Styles from './DateInputComponent.module.css'

import { MdDateRange } from "react-icons/md";
import app_identity from '@/app/config/identity';
import { formatDate } from '@/app/utils/date';


interface Props {
  onChange: (selectedDate: string) => void;
}

function DateInputComponent({ onChange }: Props) {
      const inputRef = React.useRef<HTMLInputElement>(null); 
    // const [showDatePicker, setShowDatePicker] = React.useState<boolean>(false);
    const [selectedDate, setSelectedDate] = React.useState<string>(formatDate(new Date()));


  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(formatDate(new Date(newDate)));
    onChange(newDate);
  };

  const openDatePicker = () => {
    inputRef.current?.showPicker?.(); // modern browsers
    inputRef.current?.click();        // fallback
  };


  return (
    <div id={Styles.datePiker} className={Styles.input_container}>
      <span className={Styles.dateLable}>Date :</span>
      <div>
        <span>{selectedDate}</span>
      </div>
      <span onClick={openDatePicker} style={{ cursor: 'pointer' }}>
        <MdDateRange size={25} color={app_identity.secondary_color} />
      </span>

      {/* Hidden input that triggers native calendar */}
        <input
        ref={inputRef}
        type="date"
        onChange={handleDateChange}
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

export default DateInputComponent
