"use client";
import React from 'react'
import Styles from './bottonComponent.module.css'

interface props {
    title:string
}

function BottonComponent({title}:props) {
  return (
    <div className={Styles.btn}>
      <p>{title}</p>
    </div>
  )
}

export default BottonComponent
