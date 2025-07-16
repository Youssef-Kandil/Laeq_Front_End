"use client";
import React from 'react'
import {ClientOnlyTable} from '@/app/components/global/Table/Table';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useParams ,useRouter } from 'next/navigation'
import { useLocale } from 'next-intl';

import { LuTrash2 } from "react-icons/lu";
import { FiEdit2 } from "react-icons/fi";


function Assets() {
        const router = useRouter();
        const current_lang = useLocale();


      const originalData=[
        {id:1,name:"name 1",model:"model 1",category:"category 1",brand:"brand 1",warranty:"warranty 1",company:"company 1",site:"site 1"},
      ];

      const local_var = "assets.tb_headers";
      //=== Add Action To The Table Rows
      const modifiedData = originalData.map(({ id,...rest }) => ({
        ...rest,
         delete_action:<LuTrash2 style={{fontSize:20}}/>,
         edit_action:<FiEdit2 style={{fontSize:20}}/>
      }));
  return (
    <div>
        <ClientOnlyTable 
            titles={[`${local_var}.name`,`${local_var}.model`,`${local_var}.category`,`${local_var}.brand`,`${local_var}.warranty`,`${local_var}.company`,`${local_var}.site`,"",""]}
            data={modifiedData}
            rowsFlex={[1,1,1,1,1,1,1,0.2,0.2]}
            navButtonTitle='assets'
            navButtonAction={()=>router.push(`/${current_lang}/Screens/dashboard/assets/AddAssetForm`)}
         />
    </div>
  )
}

export default Assets
