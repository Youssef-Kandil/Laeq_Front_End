"use client";
import React, { useRef, useState, useEffect } from "react";
import Styles from "./DateInputComponent.module.css";
import { MdDateRange } from "react-icons/md";
import app_identity from "@/app/config/identity";
import { formatDate } from "@/app/utils/date";

interface Props {
  onChange: (selectedDate: string) => void;
  defaultValue?: string;  // قيمة افتراضية
  disabled?: boolean;     // قفل الكومبوننت لو ترو
}

function DateInputComponent({ onChange, defaultValue, disabled = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  // نخلي فيه ديفولت فاليو لو اتبعت، غير كدا يبقى تاريخ النهاردة
  const [selectedDate, setSelectedDate] = useState<string>(
    defaultValue ? formatDate(new Date(defaultValue)) : formatDate(new Date())
  );

  useEffect(() => {
    if (defaultValue) {
      setSelectedDate(formatDate(new Date(defaultValue)));
    }
  }, [defaultValue]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(formatDate(new Date(newDate)));
    onChange(newDate);
  };

  const openDatePicker = () => {
    if (disabled) return; // لو مقفول ميفتحش
    inputRef.current?.showPicker?.();
    inputRef.current?.click();
  };

  return (
    <div
      id={Styles.datePiker}
      className={`${Styles.input_container} ${disabled ? Styles.disabled : ""}`}
    >
      <span className={Styles.dateLable}>Date :</span>
      <div>
        <span>{selectedDate}</span>
      </div>
      <span
        onClick={openDatePicker}
        style={{ cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 }}
      >
        <MdDateRange size={25} color={app_identity.secondary_color} />
      </span>

      {/* hidden input */}
      <input
        ref={inputRef}
        type="date"
        value={selectedDate ? new Date(selectedDate).toISOString().split("T")[0] : ""}
        onChange={handleDateChange}
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

export default DateInputComponent;
