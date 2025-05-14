"use client";
import React from 'react'
import Styles from './checklist.module.css'
import Card from '@/app/components/global/CheckList_Card/Card';
import {useTranslations} from 'next-intl';
import { IoIosSearch } from "react-icons/io";

function CheckList() {
      const t = useTranslations('table_component');
      /*TEST DATA*/ const data = [{id:"1",title:"Food Safty & Hygiene 1",img:"https/drive.google.com/iewmd12881.png"},{id:"2",title:"Food Safty & Hygiene 2",img:"https/drive.google.com/iewmd12881.png"},{id:"3",title:"Food Safty & Hygiene 3",img:"https/drive.google.com/iewmd12881.png"},]
      const Cards = data.map((card,indx)=>{
        return <Card key={indx} title={card.title} imgSrc={card.img} cardInfo={card}/>
      })

  return (
    <div className={Styles.parent}>
              <nav>
            <div className={Styles.pikers}>
                <div className={Styles.input_container}>
                    <IoIosSearch style={{fontSize:22}}/>
                    <input type="text" placeholder={t("search")} id="" />
                </div>
            </div>
            <div className={Styles.button}>
                    <button >Add New Checklist</button>
            </div>


            
        </nav>

      <section>
        <h3 className={Styles.title}>Checklists</h3>
        <div className={Styles.cardsList}>
          {Cards}
          <Card cardInfo={{id:"12"}} title='Custom' imgSrc=''/>
        </div>
      </section>
      
    </div>
  )
}

export default CheckList
