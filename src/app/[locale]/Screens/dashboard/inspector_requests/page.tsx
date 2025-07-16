"use client";
import React from 'react';
import {useLocale} from 'next-intl';
import {usePathname, useRouter } from "next/navigation"; 
import {ClientOnlyTable} from '@/app/components/global/Table/Table'
import { MdDeleteOutline } from "react-icons/md";




function Inspector_requests() {
    const current_lang = useLocale();
    const router = useRouter();
    const pathname = usePathname();

  const originalData=[
    {id:1,company:"Company 1",site:"Site 1",date:"2023-10-01",status:"Completed"},
    {id:2,company:"Company 1",site:"Site 1",date:"2023-10-01",status:"Completed"},
    {id:3,company:"Company 1",site:"Site 1",date:"2023-10-01",status:"Completed"},
  ]

  const local_var = "inspector_requests.tb_headers";
  //=== Add Action To The Table Rows
  const modifiedData = originalData.map(item => ({
    ...item,
    action: <MdDeleteOutline onClick={()=>{}} color='rgba(239, 54, 54, 0.5)' style={{ fontSize: 20 }} />
  }));
  return (
    <div>
      <ClientOnlyTable 
          titles={[`${local_var}.id`,`${local_var}.company`,`${local_var}.site`,`${local_var}.date`,`${local_var}.status`,""]}
          data={modifiedData}
          rowsFlex={[1,1,1,1,1,0.2]}
          navButtonTitle='inspector_requests'
          navButtonAction={()=>router.push(`/${current_lang}/Screens/dashboard/inspector_requests/requestForm`)}
         />
      
    </div>
  )
}

export default Inspector_requests
