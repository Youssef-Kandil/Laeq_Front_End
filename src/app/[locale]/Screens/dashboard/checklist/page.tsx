// ======== MAIN PARENT CHECK LISTS BOXES SCREEN
"use client";
import React from 'react'
import { useCheckList } from '@/app/Hooks/useCheckList';
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl';
import Styles from './checklists.module.css'
import Card from '@/app/components/global/TemplateCard/Card';
import {useTranslations} from 'next-intl';
import { IoIosSearch } from "react-icons/io";
import { getAdminAccountInfo } from '@/app/utils/getAccountInfo';
import { AccountInfo } from '@/app/Types/AccountsType';

function CheckLists() {
    const current_lang = useLocale();
    const router = useRouter();
    const t = useTranslations('table_component');
    React.useEffect(()=>{
        localStorage.setItem('clickedAsideTitle',"checklist");
    },[])
    const info = getAdminAccountInfo("AccountInfo") as AccountInfo | null;
    const isEmployee = info?.role === "employee";    
      /*TEST DATA*/ //const dataTest = [{id:"1",title:"Food Safty & Hygiene 1",img:"https/drive.google.com/iewmd12881.png"},{id:"2",title:"Food Safty & Hygiene 2",img:"https/drive.google.com/iewmd12881.png"},{id:"3",title:"Food Safty & Hygiene 3",img:"https/drive.google.com/iewmd12881.png"},]
      
      const { data, isLoading, error } = useCheckList();

        if (isLoading) {
          return <div>جاري التحميل...</div>;
        }

        if (error) {
          return <div>حدث خطأ: {error.message}</div>;
        }

        if (!data || data.length === 0) {
          return <div>لا توجد بيانات</div>;
        }
      const Cards = data.map((card:{id:number,checklist_title:string,admin_id:number},indx:number)=>{
        return <Card key={indx} title={card.checklist_title} imgSrc={""} cardInfo={card}/>
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
          {!isEmployee&& <button onClick={()=>router.push(`/${current_lang}/Screens/dashboard/checklist/AddNewTemplateForm`)} className={Styles.button} >Add New Checklist</button>}
             
        </nav>

      <section>
        <h3 className={Styles.title}>Checklists</h3>
        <div className={Styles.cardsList}>
          {Cards}
          {/* <Card cardInfo={{id:"12",title:"Custom"}} title='Custom' imgSrc=''/> */}
        </div>
      </section>
      
    </div>
  )
}

export default CheckLists
