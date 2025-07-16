"use client";
import React from 'react'
import Styles from './bottonComponent.module.css'

interface props {
    title:string
    onClick?:()=>void;
}

function BottonComponent({title,onClick}:props) {
  return (
    <div onClick={onClick} className={Styles.btn}>
      <p>{title}</p>
    </div>
  )
}

export default BottonComponent
