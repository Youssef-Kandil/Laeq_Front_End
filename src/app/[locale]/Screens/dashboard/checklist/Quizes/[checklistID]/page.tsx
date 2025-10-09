//  ===== ROWS LIST OF Templates
"use client";
import React from 'react'
import Styles from './quizes.module.css'

import { useParams ,useRouter } from 'next/navigation'
import {useTranslations} from 'next-intl';
// import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";

import { LuSend } from "react-icons/lu";
import { IoIosSearch } from "react-icons/io";
// import { RiDeleteBinLine } from "react-icons/ri";
import Quiz_card from '@/app/components/global/CheckList_Card/CheckList_Card';
// import BottonComponent from '@/app/components/global/ButtonComponent/BottonComponent';
// import DropListComponent from '@/app/components/global/InputsComponents/DropListComponent/DropListComponent';

import { useLocale } from 'next-intl';
import { TemplateType } from '@/app/Types/checklistTypes';
import {useGetTemplatesByChecklistId  } from '@/app/Hooks/useTemplates'
import SkeletonLoader from '@/app/components/global/SkeletonLoader/SkeletonLoaders';
import { MdModeEdit } from "react-icons/md";
// import { useDeleteCheckList } from '@/app/Hooks/useCheckList';
// import { useQueryClient } from '@tanstack/react-query';

// NOTES: THE ROWS OF Checklists THAT HAVE SAME PARENT template

function Quizes() {
    const t = useTranslations('table_component');
      const router = useRouter();
      const current_lang = useLocale();
      // const queryClient = useQueryClient();

    // Start Sceleton Loading..
    //  Get template ID  From Params
    const params = useParams(); 
    const { checklistID }= params
    const ID = checklistID?.toString().split("-")[1]; 
    // const ID = checklistID?.toString().slice(-1)

    // Send Request To Backend To Get All Quizes OF This template 
    
    const { data, isLoading, error } = useGetTemplatesByChecklistId(Number(ID));
    // const {mutate:deleteChecklist,isPending:isPendingChecklist}= useDeleteCheckList();
    // const {mutate:deleteTemplate,isPending}= useDeleteTemplate();


    // const handelDeleteTemplate = (id:number)=>{
    //   if (!isPending) {
    //     deleteTemplate({id:id},
    //       {
    //         onSuccess: () => {
    //           // 🟢 كدا بيجبر الكويري إنه يعمل refetch
    //           queryClient.invalidateQueries({
    //             queryKey: ['templates', Number(ID)],
    //           });
    //         },
    //       }
    //     )
    //   }
    // }

    if (isLoading) return <SkeletonLoader/>;
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
                        <MdModeEdit style={{color:"rgba(29, 144, 238, 0.75)"}}  onClick={()=>router.push(`/${current_lang}/Screens/dashboard/checklist/Quizes/${checklistID}/EditTemplate/${card.id}`)}/>
                        {/* <RiDeleteBinLine style={{color:"red"}} onClick={()=>handelDeleteTemplate(card.id??-1)}/> */}
                        <FaRegEye onClick={()=>router.push(`/${current_lang}/Screens/dashboard/checklist/Quizes/${checklistID}/${card.template_title}-${card.id}`)}/> 
                        <LuSend onClick={()=>  router.push(`/${current_lang}/Screens/dashboard/checklist/Quizes/${checklistID}/${card.template_title}-${card.id}/ChooseUserTableScreen`)}/>
                    </div> }/>
    })
    


      

    

  return (
    <div className={Styles.parent}>
        
        <nav>
            <div className={Styles.pikers}>
                <div className={Styles.input_container}>
                    <IoIosSearch style={{fontSize:22}}/>
                    <input type="text" placeholder={t("search")} id="" />
                </div>
                {/* <BottonComponent colorRed onClick={handelDeleteChecklist} title="Delete this Checklist"/> */}
            </div>
      </nav>

      
      <section>
        {Cards}
      </section>
    </div>
  )
}

export default Quizes
