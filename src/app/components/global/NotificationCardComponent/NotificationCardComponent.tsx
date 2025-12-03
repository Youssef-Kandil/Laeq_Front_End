"use client";
import React from 'react'
import Styles from './NotificationCardComponent.module.css'
import { CiWarning } from "react-icons/ci";


interface props{
    head:string;
    details:string;
    date:string;
}

function NotificationCardComponent({head,details,date}:props) {
  return (
    <div title={details} className={Styles.parent}>
      <div className={Styles.Icon}>
            <CiWarning />
      </div>
      <div className={Styles.Text}>
        <h3>{head}</h3>
        <p>{details}</p>
      </div>
      <p className={Styles.dateText}>{date}</p>
    </div>
  )
}

export default NotificationCardComponent
