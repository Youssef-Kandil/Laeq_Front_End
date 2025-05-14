"use client";
import React from 'react'
import {ClientOnlyTable} from '@/app/components/global/Table/Table'
import { HiOutlineDotsVertical } from "react-icons/hi";
function Report() {
  const originalData=[
    {id:1,name:"Report 1",company:"Company 1",site:"Site 1",submitted_by:"User 1",date:"2023-10-01",score:85,status:"Completed"},
    {id:2,name:"Report 1",company:"Company 1",site:"Site 1",submitted_by:"User 1",date:"2023-10-01",score:85,status:"Completed"},
    {id:3,name:"Report 1",company:"Company 1",site:"Site 1",submitted_by:"User 1",date:"2023-10-01",score:85,status:"Completed"},
  ]

  const logal_var = "reports.tb_headers";
  //=== Add Action To The Table Rows
  const modifiedData = originalData.map(item => ({
    ...item,
    action: <HiOutlineDotsVertical onClick={()=>console.log("Row ID IS :",item.id)} style={{ fontSize: 20 }} />
  }));
  
  return (
    <div>
      <ClientOnlyTable 
          titles={[`${logal_var}.id`,`${logal_var}.name`,`${logal_var}.company`,`${logal_var}.site`,`${logal_var}.submitted_by`,`${logal_var}.date`,`${logal_var}.score`,`${logal_var}.status`,""]}
          data={modifiedData}
          rowsFlex={[0.6,1,1,1,1,1,1,1,0.2]}
          navButtonTitle='reports'
          navButton2Title='automation'
          useCheckRows
         />
    </div>
  )
}

export default Report
