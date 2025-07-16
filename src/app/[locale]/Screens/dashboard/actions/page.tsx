"use client";
import React from 'react'
import Table from '@/app/components/global/Table/Table'
import { LuTrash2 } from "react-icons/lu";
import { FiEdit2 } from "react-icons/fi";
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

function Actions() {
    const router = useRouter();
    const current_lang = useLocale();
    const local_var = "actions.tb_headers";
  
  return (
    <div>
        <Table
          titles={[`${local_var}.id`,`${local_var}.name`,`${local_var}.company`,`${local_var}.site`,`${local_var}.submitted_by`,`${local_var}.date`,`${local_var}.status`,`${local_var}.assign`,"",""]} 
          data={[
            {id:1,name:"Report 1",company:"Company 1",site:"Site 1",submitted_by:"User 1",date:"2023-10-01",status:"Completed",assign_action:<div>Assign</div>,delete_action:<LuTrash2 style={{fontSize:20}}/>,edit_action:<FiEdit2 style={{fontSize:20}}/>},
          ]}
          rowsFlex={[0.6,1,1,1,1,1,1,1,0.2,0.2]}
          navButtonTitle='actions'
          navButtonAction={()=>router.push(`/${current_lang}/Screens/dashboard/actions/createActionForm`)}
         />
    </div>
  )
}

export default Actions
