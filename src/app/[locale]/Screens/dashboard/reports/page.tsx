"use client";
import React from 'react'
import {ClientOnlyTable} from '@/app/components/global/Table/Table'
import { HiOutlineDotsVertical } from "react-icons/hi";

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

function Report() {
  const router = useRouter();
  const current_lang = useLocale();

  const originalData=[
    {id:1,name:"Report 1",company:"Company 1",site:"Site 1",submitted_by:"User 1",date:"2023-10-01",score:85,status:"Completed"},
    {id:2,name:"Report 1",company:"Company 1",site:"Site 1",submitted_by:"User 1",date:"2023-10-01",score:85,status:"Completed"},
    {id:3,name:"Report 1",company:"Company 1",site:"Site 1",submitted_by:"User 1",date:"2023-10-01",score:85,status:"Completed"},
  ]

  const local_var = "reports.tb_headers";
  //=== Add Action To The Table Rows
  const modifiedData = originalData.map(item => ({
    ...item,
    action: <HiOutlineDotsVertical onClick={()=>router.push(`/${current_lang}/Screens/dashboard/reports/Report_Details`)} style={{ fontSize: 20 }} />
  }));
  
  return (
    <div>
      <ClientOnlyTable 
          titles={[`${local_var}.id`,`${local_var}.name`,`${local_var}.company`,`${local_var}.site`,`${local_var}.submitted_by`,`${local_var}.date`,`${local_var}.score`,`${local_var}.status`,""]}
          data={modifiedData}
          rowsFlex={[0.6,1,1,1,1,1,1,1,0.2]}
          navButtonTitle='reports'
         />
    </div>
  )
}

export default Report
