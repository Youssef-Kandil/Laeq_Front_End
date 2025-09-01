"use client";
import React, { ReactNode } from 'react'
import Styles from './popup.module.css'
import { RiVerifiedBadgeFill } from "react-icons/ri";
import BottonComponent from '../ButtonComponent/BottonComponent';

interface Porps {
    title:string;
    subTitle?:string;
    btnTitle?:string;
    btnFunc?:()=>void;
    icon?:ReactNode;
    onClose: (visible: boolean) => void;
}

function Popup({title,subTitle,icon,onClose,btnTitle,btnFunc}:Porps) {
  return (
    <div className={Styles.backGround} onClick={() => onClose(false)} title='Click Here To Close'>
        <div className={Styles.popup}>
            <span className={Styles.icon}>{icon?icon:<RiVerifiedBadgeFill/>}</span>
            <p className={Styles.title}>{title?title:"This is Popup"}</p>
            <p className={Styles.subTitle}>{subTitle?subTitle:"This is Popup subTitle"}</p>
           {(btnTitle&&btnFunc)&&<BottonComponent title={btnTitle} onClick={btnFunc} />} 
        </div>
    </div>
  )
}

export default Popup
