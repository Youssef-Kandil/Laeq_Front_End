"use client";
import React from 'react'
import {ClientOnlyTable} from '@/app/components/global/Table/Table';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useParams ,useRouter } from 'next/navigation'
import { useLocale } from 'next-intl';

import { LuTrash2 } from "react-icons/lu";
import { FiEdit2 } from "react-icons/fi";

function Department() {
      const router = useRouter();
      const current_lang = useLocale();

    // Start Sceleton Loading..
    //  Get template ID  From Params
      // const params = useParams(); 
      // const   { templateID ,checklistID}= params

      const originalData=[
        {id:1,name:"name 1",company:"company 1",site:"Site 1"},
        {id:2,name:"name 2",company:"company 2",site:"Site 2"},
        {id:3,name:"name 3",company:"company 3",site:"Site 3"},
      ];

      const local_var = "department.tb_headers";
      //=== Add Action To The Table Rows
      const modifiedData = originalData.map(({ id,...rest }) => ({
        ...rest,
         delete_action:<LuTrash2 style={{fontSize:20}}/>,
         edit_action:<FiEdit2 style={{fontSize:20}}/>
      }));

  return (
    <div>
        <ClientOnlyTable 
            titles={[`${local_var}.name`,`${local_var}.company`,`${local_var}.site`,"",""]}
            data={modifiedData}
            rowsFlex={[1,1,1,0.2,0.2]}
            navButtonTitle='department'
            navButtonAction={()=>router.push(`/${current_lang}/Screens/dashboard/department/AddDepartmentForm`)}
        />
    </div>
  )
}

export default Department
