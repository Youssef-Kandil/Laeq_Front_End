"use client";
import React from 'react'
import Image from 'next/image';
import Styles from './card.module.css'
import { IoEllipsisVertical } from "react-icons/io5";
import { IoMdListBox } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

interface props {
    title:string;
    imgSrc?:string;
    cardInfo:{id:number,checklist_title:string};
}

function Card({title,imgSrc,cardInfo}:props) {

  const router = useRouter();
  const current_lang = useLocale();

  // === get all quizs of this checklist with id ===
  const handelGetQuizs = ()=>{
    // Get Checklist ID
    const TemplateID = cardInfo.id
    //Send It As Param With Route To Quizs Screen
    router.push(`/${current_lang}/Screens/dashboard/checklist/Quizes/${cardInfo.checklist_title}-${TemplateID}`);

  }
  
  return (
    <div className={Styles.card} onClick={handelGetQuizs}>
      {imgSrc != "" ? <Image src={"/images/login.webp"} alt='' width={280} height={254}/>: <div className={Styles.notImg}><IoMdListBox/></div>}

      <div>
        <h3>{title?title:"Food Safety & Hygiene"}</h3>
        <IoEllipsisVertical className={Styles.icon}/>
      </div>
    </div>
  )
}

export default Card
