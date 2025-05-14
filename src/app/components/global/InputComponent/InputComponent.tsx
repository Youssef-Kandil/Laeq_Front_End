"use client";
import React from 'react'
import Styles from './InputComponent.module.css'

interface props{
    label:string;
    placeholder:string;
    type:React.ComponentPropsWithoutRef<'input'>['type'];
    value:string;
    isTextArea?:boolean
    onTyping:(value:string)=>void;
}

function InputComponent({label,placeholder,type,value,onTyping,isTextArea=false}:props) {
  return (
    <div  className={Styles.input}>
    <label className={Styles.lacel} htmlFor='input'>{label}</label>
    {isTextArea? 
      <textarea
       id='input'
       style={{minWidth:"100%",minHeight:"92px"}}
       className={Styles.field}
       placeholder={placeholder}
       value={value}
       onChange={(e) => onTyping(e.target.value)}
      />
      :
      <input
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
