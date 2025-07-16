"use client";
import React from 'react'
import {ClientOnlyTable} from '@/app/components/global/Table/Table';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useParams ,useRouter } from 'next/navigation'
import { useLocale } from 'next-intl';

import { LuTrash2 } from "react-icons/lu";
import { FiEdit2 } from "react-icons/fi";

function Users() {
        const router = useRouter();
        const current_lang = useLocale();


      const originalData=[
        {id:1,name:"name 1",email:"email 1",site:"site 1",emp_status:"status 1",role:"role 1"},
      ];

      const local_var = "employees.tb_headers";
      //=== Add Action To The Table Rows
      const modifiedData = originalData.map(({ id,...rest }) => ({
        ...rest,
         delete_action:<LuTrash2 style={{fontSize:20}}/>,
         edit_action:<FiEdit2 style={{fontSize:20}}/>
      }));
  return (
    <div>
        <ClientOnlyTable 
            titles={[`${local_var}.name`,`${local_var}.email`,`${local_var}.site`,`${local_var}.status`,`${local_var}.role`,"",""]}
            data={modifiedData}
            rowsFlex={[1,1,1,1,1,0.2,0.2]}
            navButtonTitle='employees'
            navButtonAction={()=>router.push(`/${current_lang}/Screens/dashboard/users/AddUserForm`)}
         />
    </div>
  )
}

export default Users
