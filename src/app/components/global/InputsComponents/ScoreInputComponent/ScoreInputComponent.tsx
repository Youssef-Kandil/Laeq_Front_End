"use client";
import React from "react";
import Styles from "./ScoreInputComponent.module.css";
import app_identity from "@/app/config/identity";

interface BoxProp {
  value: string;
  onClick: () => void;
  isSelected: boolean;
  disabled: boolean;
}

interface ScoreInputComponentProps {
  value?: string; // قيمة متحكم فيها
  defaultValue?: string; // قيمة افتراضية
  onChange?: (value: string) => void;
  disabled?: boolean; // تعطيل الكومبوننت
}

function ScoreInputComponent({
  value,
  defaultValue,
  onChange,
  disabled = false,
}: ScoreInputComponentProps) {
  type ScoreValue = "1" | "2" | "3" | "4" | "5";
  const Boxs: ScoreValue[] = ["1", "2", "3", "4", "5"];

  const [SelectedBox, setSelectedBox] = React.useState<ScoreValue | null>(
    (value as ScoreValue) || (defaultValue as ScoreValue) || null
  );

  React.useEffect(() => {
    if (onChange && SelectedBox) {
      onChange(SelectedBox);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SelectedBox]);

  return (
    <div
      className={`${Styles.ScoreInput}`}
    >
      <span>Score</span>
      <div className={Styles.boxsContainer}>
        {Boxs.map((boxValue, i) => (
          <Box
            key={i}
            isSelected={SelectedBox === boxValue}
            onClick={() => {
              if (!disabled) setSelectedBox(boxValue);
            }}
            value={boxValue}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

function Box({ value, onClick, isSelected, disabled }: BoxProp) {
  return (
    <div
      className={Styles.Box}
      onClick={disabled ? undefined : onClick}
      style={{
        background: isSelected ? app_identity.secondary_color : "",
        color: isSelected ? "#FFF" : "",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <span>{value}</span>
    </div>
  );
}

export default ScoreInputComponent;
