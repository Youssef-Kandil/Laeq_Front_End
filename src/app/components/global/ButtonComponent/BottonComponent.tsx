"use client";
import React from 'react'
import Styles from './bottonComponent.module.css'

interface Props {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  colorRed?:boolean,

}

function BottonComponent({ title, onClick, disabled = false,colorRed = false }: Props) {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`${Styles.btn}`}
      style={{ cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,background:colorRed?"rgba(255, 3, 3, 0.5)":"" }}
    >
      <p>{title}</p>
    </div>
  )
}

export default BottonComponent
