"use client";
import React, { ReactNode } from 'react'
import Styles from './popup.module.css'
import { RiVerifiedBadgeFill } from "react-icons/ri";

interface Porps {
    title:string;
    icon?:ReactNode;
    onClose: (visible: boolean) => void;
}

function Popup({title,icon,onClose}:Porps) {
  return (
    <div className={Styles.backGround} onClick={() => onClose(false)} title='Click Here To Close'>
        <div className={Styles.popup}>
            <span className={Styles.icon}>{icon?icon:<RiVerifiedBadgeFill/>}</span>
            <p>{title?title:"This is Popup"}</p>
        </div>
    </div>
  )
}

export default Popup
