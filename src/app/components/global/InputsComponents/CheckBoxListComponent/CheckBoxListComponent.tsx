"use client";
import React from 'react'
import Style from './checkBoxListComponent.module.css'

import CheckBoxComponent from '../CheckBoxComponent/CheckBoxComponent';

interface opthionsType{
    label:string;
    value?:number
}

interface props{
    list:opthionsType[]
}

function CheckBoxListComponent({list}:props) {
  return (
    <div className={Style.list}>
        {list.map((input,index)=>{
            return <CheckBoxComponent key={index} label={input.label}/>
        })}
    </div>
  )
}

export default CheckBoxListComponent
