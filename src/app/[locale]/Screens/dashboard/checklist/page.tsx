// ======== MAIN PARENT CHECK LISTS BOXES SCREEN
"use client";
import React from 'react'
import { useParams ,useRouter } from 'next/navigation'
import { useLocale } from 'next-intl';
import Styles from './checklists.module.css'
import Card from '@/app/components/global/TemplateCard/Card';
import {useTranslations} from 'next-intl';
import { IoIosSearch } from "react-icons/io";

function CheckLists() {
    const current_lang = useLocale();
    const router = useRouter();
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
          {/* === START BTN */}  
              <button onClick={()=>router.push(`/${current_lang}/Screens/dashboard/checklist/AddNewTemplateForm`)} className={Styles.button} >Add New Checklist</button>
        </nav>

      <section>
        <h3 className={Styles.title}>Checklists</h3>
        <div className={Styles.cardsList}>
          {Cards}
          <Card cardInfo={{id:"12",title:"Custom"}} title='Custom' imgSrc=''/>
        </div>
      </section>
      
    </div>
  )
}

export default CheckLists
