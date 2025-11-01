/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useRef, useState, useEffect } from "react";
import Styles from "./DateInputComponent.module.css";
import { MdDateRange } from "react-icons/md";
import app_identity from "@/app/config/identity";

interface Props {
  onChange: (selectedDate: string) => void;
  defaultValue?: string;
  disabled?: boolean;
}

function DateInputComponent({ onChange, defaultValue, disabled = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    if (defaultValue) return normalizeDate(defaultValue);
    return ""; // ✅ خليها فاضية بدل التاريخ الحالي
  });

  useEffect(() => {
    if (defaultValue) {
      setSelectedDate(normalizeDate(defaultValue));
    } else {
      setSelectedDate(""); // ✅ فاضي لو مفيش ديفولت
    }
  }, [defaultValue]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    onChange(newDate);
  };

  // فتح التقويم في كل الأجهزة
  const openDatePicker = () => {
    if (disabled) return;
    inputRef.current?.showPicker?.();
    inputRef.current?.focus();
  };

  // تنظيف التاريخ من أي شكل
  function normalizeDate(dateStr: string): string {
    if (!dateStr) return "";
    const parts = dateStr.split(/[\/\-]/);
    let year = "", month = "", day = "";
    if (parts[0].length === 4) {
      [year, month, day] = parts;
    } else {
      [day, month, year] = parts;
    }
    if (!year || !month || !day) return "";
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  // صيغة العرض
  function formatDisplay(dateStr: string): string {
    if (!dateStr) return "--/--/--"; // ✅ عرض الفاضي
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "--/--/----";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div
      id={Styles.datePiker}
      className={`${Styles.input_container} ${disabled ? Styles.disabled : ""}`}
      style={{ position: "relative" }}
    >
      <span className={Styles.dateLable}>Date :</span>

      <div>
        <span>{formatDisplay(selectedDate)}</span>
      </div>

      <span
        onClick={openDatePicker}
        style={{
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          position: "relative",
        }}
      >
        <MdDateRange size={25} color={app_identity.secondary_color} />
      </span>

      <input
        ref={inputRef}
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
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

export default DateInputComponent;
