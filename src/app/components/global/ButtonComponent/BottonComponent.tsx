"use client";
import React from 'react'
import Styles from './bottonComponent.module.css'

interface Props {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
}

function BottonComponent({ title, onClick, disabled = false }: Props) {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`${Styles.btn} ${disabled ? Styles.disabled : ""}`}
      style={{ cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 }}
    >
      <p>{title}</p>
    </div>
  )
}

export default BottonComponent
