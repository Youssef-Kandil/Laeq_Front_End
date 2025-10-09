"use client";
import React, { useState } from "react";
import Style from './checkBoxListComponent.module.css'

import CheckBoxComponent from '../CheckBoxComponent/CheckBoxComponent';

interface OptionsType {
  id?: number;
  label: string;
  value?: string;
}

interface Props {
  list: OptionsType[];
  onChange?: (selected: string[]) => void;
}

function CheckBoxListComponent({ list, onChange }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const handleToggle = (label: string) => {
    setSelected((prev) => {
      let newSelected: string[];

      if (prev.includes(label)) {
        // لو متعلم عليه، نشيله
        newSelected = prev.filter((item) => item !== label);
      } else {
        // لو مش متعلم عليه، نضيفه
        newSelected = [...prev, label];
      }

      // ✅ نبعت الـ array للأب
      onChange?.(newSelected);

      return newSelected;
    });
  };

  return (
    <div className={Style.list}>
      {list.map((input, index) => (
        <CheckBoxComponent
          key={index}
          label={input.label}
          checked={selected.includes(input.label)}  
          onCheck={() => handleToggle(input.label)}
        />
      ))}
    </div>
  );
}

export default CheckBoxListComponent;
