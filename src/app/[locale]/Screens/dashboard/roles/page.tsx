"use client";
import React from 'react'
import {ClientOnlyTable} from '@/app/components/global/Table/Table';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useParams ,useRouter } from 'next/navigation'
import { useLocale } from 'next-intl';

import { LuTrash2 } from "react-icons/lu";
import { FiEdit2 } from "react-icons/fi";

function Roles() {
        const router = useRouter();
        const current_lang = useLocale();


      const originalData=[
        {id:1,name:"name 1",department:"department 1",description:"description 1"},
        {id:2,name:"name 2",department:"department 2",description:"description 2"},
        {id:3,name:"name 3",department:"department 3",description:"description 3"},
      ];

      const local_var = "roles.tb_headers";
      //=== Add Action To The Table Rows
      const modifiedData = originalData.map(({ id,...rest }) => ({
        ...rest,
         delete_action:<LuTrash2 style={{fontSize:20}}/>,
         edit_action:<FiEdit2 style={{fontSize:20}}/>
      }));
  return (
    <div>
        <ClientOnlyTable 
            titles={[`${local_var}.name`,`${local_var}.department`,`${local_var}.description`,"",""]}
            data={modifiedData}
            rowsFlex={[1,1,1,0.2,0.2]}
            navButtonTitle='roles'
            navButtonAction={()=>router.push(`/${current_lang}/Screens/dashboard/roles/AddRoleForm`)}
         />
    </div>
  )
}

export default Roles
