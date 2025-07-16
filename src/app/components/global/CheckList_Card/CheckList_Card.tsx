"use client";
import React, { ReactNode } from 'react'
// import {useLocale} from 'next-intl';
// import { useRouter } from 'next/navigation';


import Styles from './CheckList_Card.module.css'
import Image from 'next/image'


interface props {
    title:string;
    questionsCount:string | number;
    imgSrc:string;
    icon:ReactNode;
}

function Quiz_card({title,questionsCount,imgSrc,icon}:props) {
      // const router = useRouter();
      // const current_lang = useLocale();
  return (
    <div className={Styles.parent}>
      <section>
        <Image src={imgSrc} alt='QuizImg' width={60} height={60}/>
        <div className={Styles.text}>
            <h3>{title}</h3>
            <p>{questionsCount} questions</p>
        </div>
      </section>
        <span>
            {icon}
        </span>
      
    </div>
  )
}

export default Quiz_card
