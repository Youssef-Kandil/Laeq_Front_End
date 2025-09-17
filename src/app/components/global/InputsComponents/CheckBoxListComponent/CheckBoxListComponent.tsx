"use client";
import React, { useState } from "react";
import Style from './checkBoxListComponent.module.css'

import CheckBoxComponent from '../CheckBoxComponent/CheckBoxComponent';

interface opthionsType{
    id?:number;
    label:string;
    value?:string
}

interface props{
    list:opthionsType[];
    onChange?: (selected: string[]) => void;
}

function CheckBoxListComponent({list,onChange}:props) {
  const [, setSelected] = useState<string[]>([]);
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

      // ✅ نبعت ال array للأب
      onChange?.(newSelected);

      return newSelected;
    });
  };
  return (
    <div className={Style.list}>
        {list.map((input,index)=>{
            return <CheckBoxComponent 
                        key={index} 
                        label={input.label}
                        onCheck={() => handleToggle(input.label)}
                        />
        })}
    </div>
  )
}

export default CheckBoxListComponent
