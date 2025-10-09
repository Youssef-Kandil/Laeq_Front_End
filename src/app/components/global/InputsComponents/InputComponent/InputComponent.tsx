"use client";
import React from 'react'
import Styles from './InputComponent.module.css'

interface props{
    label:string;
    placeholder:string;
    type?:React.ComponentPropsWithoutRef<'input'>['type'];
    value:string;
    disabled?:boolean
    isTextArea?:boolean

    onTyping:(value:string)=>void;
}

function InputComponent({label,placeholder,type,value,onTyping,isTextArea=false,disabled=false}:props) {
  return (
    <div  className={Styles.input}>
    <label className={Styles.label} htmlFor='input'>{label}</label>
    {isTextArea? 
      <textarea
      disabled={disabled}  
       id='input'
       style={{minWidth:"100%",minHeight:"92px"}}
       className={Styles.field}
       placeholder={placeholder}
       value={value}
       onChange={(e) => onTyping(e.target.value)}
      />
      :
      <input
        disabled={disabled}  
        id='input'
        className={Styles.field}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(e) => onTyping(e.target.value)}

      />  
    }
    </div>
  )
}

export default InputComponent
