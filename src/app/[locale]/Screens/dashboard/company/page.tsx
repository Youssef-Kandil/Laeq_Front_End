"use client";
import React from 'react'
import {ClientOnlyTable} from '@/app/components/global/Table/Table';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useParams ,useRouter } from 'next/navigation'
import { useLocale } from 'next-intl';

import { LuTrash2 } from "react-icons/lu";
import { FiEdit2 } from "react-icons/fi";

function Company() {
        const router = useRouter();
        const current_lang = useLocale();


      const originalData=[
        {id:1,name:"name 1",sectorType:"sectorType 1",site:"Site 1",size:"size 1"},
        {id:2,name:"name 2",sectorType:"sectorType 2",site:"size 2",size:"size 2"},
        {id:3,name:"name 3",sectorType:"sectorType 3",site:"size 3",size:"size 3"},
      ];

      const local_var = "company.tb_headers";
      //=== Add Action To The Table Rows
      const modifiedData = originalData.map(({ id,...rest }) => ({
        ...rest,
         delete_action:<LuTrash2 style={{fontSize:20}}/>,
         edit_action:<FiEdit2 style={{fontSize:20}}/>
      }));
  return (
    <div>
        <ClientOnlyTable 
            titles={[`${local_var}.name`,`${local_var}.sectorType`,`${local_var}.site`,`${local_var}.size`,"",""]}
            data={modifiedData}
            rowsFlex={[1,1,1,1,0.2,0.2]}
            navButtonTitle='company'
            navButtonAction={()=>router.push(`/${current_lang}/Screens/dashboard/company/AddCompanyForm`)}
         />
    </div>
  )
}

export default Company
