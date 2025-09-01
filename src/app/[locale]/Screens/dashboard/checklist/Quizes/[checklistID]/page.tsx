//  ===== ROWS LIST OF Templates
"use client";
import React from 'react'
import Styles from './quizes.module.css'

import { useParams ,useRouter } from 'next/navigation'
import {useTranslations} from 'next-intl';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";

import { LuSend } from "react-icons/lu";
import { IoIosSearch } from "react-icons/io";
import Quiz_card from '@/app/components/global/CheckList_Card/CheckList_Card';

import { useLocale } from 'next-intl';
import { TemplateType } from '@/app/Types/checklistTypes';
import {useGetTemplatesByChecklistId} from '@/app/Hooks/useTemplates'

// NOTES: THE ROWS OF Checklists THAT HAVE SAME PARENT template

function Quizes() {
    const t = useTranslations('table_component');
      const router = useRouter();
      const current_lang = useLocale();

    // Start Sceleton Loading..
    //  Get template ID  From Params
    const params = useParams(); 
    const { checklistID }= params
    const ID = checklistID?.toString().slice(-1)

    // Send Request To Backend To Get All Quizes OF This template 


    /*TESTING DATA*/// const data = [{id:1,title:"Food Safty Inspection",questionsCount:"50",srcImg:"/images/login.webp"}] 

    const { data, isLoading, error } = useGetTemplatesByChecklistId(Number(ID));
        if (isLoading) return <div>جاري التحميل...</div>;
        if (error) return <div>حدث خطأ: {(error as Error).message}</div>;
        if (!data) return <div>لا توجد بيانات</div>;

    // Reander It (Maping)
    const Cards = data.map((card:TemplateType,indx:number)=>{
        return  <Quiz_card
                    key={indx}
                    imgSrc={"/images/login.webp"} 
                    title={card.template_title}
                    questionsCount={card._count.questions}
                    icon={ <div  style={{display:"flex",alignItems:"center",gap:"20px"}}>
                        <FaRegEye onClick={()=>router.push(`/${current_lang}/Screens/dashboard/checklist/Quizes/${checklistID}/${card.template_title}-${card.id}`)}/> 
                        <LuSend onClick={()=>  router.push(`/${current_lang}/Screens/dashboard/checklist/Quizes/${checklistID}/${card.template_title}-${card.id}/ChooseUserTableScreen`)}/>
                    </div> }/>
    })
    
    //Send Request To Backend To Get All Checklists
    // interface checklistsType {
    //     id:string|number;
    //     title: string;
    // }
    // let testData =  [{id:1,title:"checklist 1"},{id:2,title:"checklist 2"},{id:3,title:"checklist 3"},]
    // const [Checklists, SetChecklists] = React.useState<checklistsType[]>(testData);





    
    // hndel dropdowen
    // const [showPicker, setShowPicker] = React.useState<boolean>(false);


    // const [selectedChecklist, setSelectedChecklist] = React.useState<checklistsType>(
    //     Checklists.find(item => item.id === 1) || { id: -1, title: "Default Checklist" }
    // );

    // const handleChecklistChange = (checklist:checklistsType) => {
    //     // start loding popup
    //     // set Selected Checklist
    //     setSelectedChecklist(checklist)
    //     // call Api to get the Quizes With Checklist ID
    //     const checklistID  = checklist.id
    //     console.log(checklistID)
    //     // set Quizes State
    //         // setQuizes()
    //     // Stop Loading popup
    // };
    // // maping on Checklists
    // const dropDownData = Checklists.map((checkList,indx)=>{
    //     return <p className={Styles.label} key={indx} onClick={()=>handleChecklistChange(checkList)}>{checkList.title}</p>
    // })

      

    

  return (
    <div className={Styles.parent}>
        
        <nav>
            <div className={Styles.pikers}>
                <div className={Styles.input_container}>
                    <IoIosSearch style={{fontSize:22}}/>
                    <input type="text" placeholder={t("search")} id="" />
                </div>

                <div 
                  id={Styles.FiltersPiker}
                  className={Styles.input_container}
                  onClick={()=>{
                        // setShowPicker(!showPicker)
                }}>

                    <div>
                        {/* {selectedChecklist?.title} */}
                    </div>
                        <MdOutlineKeyboardArrowDown/>

                    {/* {showPicker && ( 
                        <div className={Styles.filterOptions}>
                            <div className={Styles.title}>
                                <p>Select Checklist</p>
                            </div>

                            <div className={Styles.checkBoxGroup}>
                                {dropDownData}       
                            </div>
                        </div>
                    )} */}
                </div>
            </div>
      </nav>

      
      <section>
        {Cards}
      </section>
    </div>
  )
}

export default Quizes
