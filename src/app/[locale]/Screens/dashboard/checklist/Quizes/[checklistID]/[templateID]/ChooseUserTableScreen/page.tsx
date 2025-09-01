"use client";
import React from 'react'
import {ClientOnlyTable} from '@/app/components/global/Table/Table';
// import { HiOutlineDotsVertical } from "react-icons/hi";
import { useParams ,useRouter } from 'next/navigation'
import { useLocale } from 'next-intl';

function ChooseUserTableScreen() {
      const router = useRouter();
      const current_lang = useLocale();

    // Start Sceleton Loading..
    //  Get template ID  From Params
      const params = useParams(); 
      const   { templateID ,checklistID}= params

      const originalData=[
        {id:1,employee:"employee 1",email:"Company@1.com",site:"Site 1",company:"company 1",role:"User"},
        {id:2,employee:"Reemployeeport 2",email:"Company@1.com",site:"Site 2",company:"company 2",role:"User"},
        {id:3,employee:"employee 3",email:"Company@1.com",site:"Site 3",company:"company 3",role:"User"},
      ]
    
      const local_var = "chooseUser.tb_headers";
      //=== Add Action To The Table Rows
      // const modifiedData = originalData.map(({ id, ...rest }) => ({
      //   ...rest
      // }));
      const modifiedData = originalData.map(({ ...rest }) => ({
        ...rest
      }));


  return (
    <div>
        <ClientOnlyTable 
            titles={[`${local_var}.id`,`${local_var}.employee`,`${local_var}.email`,`${local_var}.site`,`${local_var}.company`,`${local_var}.role`]}
            data={modifiedData}
            rowsFlex={[0.5,1,1,1,1,1]}
            navButtonTitle='chooseUser'
            // navButton2Title='chooseUser'
            navButton2Action={()=>router.push(`/${current_lang}/Screens/dashboard/checklist/Quizes/${templateID}/${checklistID}/ChooseUserTableScreen/AutomationForm`)}
            
            useCheckRows
            
        />
    </div>
  )
}

export default ChooseUserTableScreen
