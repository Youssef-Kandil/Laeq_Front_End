"use client";
import React, { useState, useEffect } from "react";
import Styles from "./singleChoice.module.css";

interface optionsType {
  id?: number;
  label: string;
  value: string;
}

interface props {
  options: optionsType[];
  onChoose?: (selectedChoice: number) => void;
  disabled?: boolean;        // ✅ prop جديد
  defaultValue?: number;     // ✅ prop جديد
}

function SingleChoiceAnswer({ options, onChoose, disabled = false, defaultValue }: props) {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  // ✅ أول ما الكمبوننت يشتغل أو الـ defaultValue تتغير
  useEffect(() => {
    if (defaultValue !== undefined && defaultValue !== null) {
      setSelectedChoice(defaultValue);
    }
  }, [defaultValue]);

  function handelChoicesStyles(value: number) {
    if (Number(value) === 1 && selectedChoice === Number(value)) {
      return { color: "#fff", background: "rgba(104, 166, 166, 1)" };
    }
    if (Number(value) === 0 && selectedChoice === Number(value)) {
      return { color: "#fff", background: "rgba(229, 21, 25, 1)" };
    }
    if (Number(value) === -1 && selectedChoice === Number(value)) {
      return { color: "#fff", background: "rgba(238, 201, 12, 1)" };
    }
    return {};
  }

  const Coices = options.map((choice, index) => {
    const val = Number(choice.value);
    return (
      <span
        title={choice.label}
        key={index}
        onClick={() => {
          if (disabled) return; // ✅ مش هيستجيب للكليك لو disabled
          setSelectedChoice(val);
          if (onChoose) onChoose(val);
        }}
        style={handelChoicesStyles(val)}
      >
        {choice.label}
      </span>
    );
  });

  return <div className={Styles.Choices}>{Coices}</div>;
}

export default SingleChoiceAnswer;
