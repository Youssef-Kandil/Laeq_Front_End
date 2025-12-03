/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useRef, useState, useEffect } from "react";
import Styles from "./DateTimeInputComponent.module.css";
import { MdEvent } from "react-icons/md";
import app_identity from "@/app/config/identity";

interface Props {
  onChange: (selectedDateTime: string) => void;
  defaultValue?: string; // مثل "2025-09-16T10:30"
  disabled?: boolean;
}

function DateTimeInputComponent({ onChange, defaultValue, disabled = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<string>(
    defaultValue ? normalizeDateTime(defaultValue) : "" // ✅ فاضي بدل الوقت الحالي
  );

  useEffect(() => {
    if (defaultValue) {
      setSelectedDateTime(normalizeDateTime(defaultValue));
    } else {
      setSelectedDateTime(""); // ✅ فاضي لو مفيش ديفولت
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
    inputRef.current?.focus(); // fallback لـ iPhone
  };

  // ✅ صيغة متوافقة مع datetime-local
  function formatForInput(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // ✅ تنظيف أي صيغة تاريخ / وقت
  function normalizeDateTime(dateStr: string): string {
    if (!dateStr) return "";
    if (dateStr.includes("T")) return dateStr;
    return formatForInput(new Date(dateStr));
  }

  // ✅ صيغة عرض جميلة للمستخدم
  function formatDisplay(dateTimeStr: string): string {
    if (!dateTimeStr) return "--/--/---- --:--"; // ✅ العرض الفاضي
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) return "--/--/---- --:--";
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div
      id={Styles.dateTimePicker}
      className={`${Styles.input_container} ${disabled ? Styles.disabled : ""}`}
      style={{ position: "relative" }}
    >
      <span className={Styles.dateLable}>Date & Time:</span>

      <div>
        <span>{formatDisplay(selectedDateTime)}</span>
      </div>

      {/* أيقونة */}
      <span
        onClick={openPicker}
        style={{
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          position: "relative",
        }}
      >
        <MdEvent size={25} color={app_identity.secondary_color} />
      </span>

      {/* input شفاف قابل للضغط */}
      <input
        ref={inputRef}
        type="datetime-local"
        value={selectedDateTime}
        onChange={handleChange}
        disabled={disabled}
        style={{
          position: "absolute",
          right: "8px",
          width: "30px",
          height: "30px",
          top: "50%",
          transform: "translateY(-50%)",
          opacity: 0, // شفاف لكنه قابل للضغط
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      />
    </div>
  );
}

export default DateTimeInputComponent;
