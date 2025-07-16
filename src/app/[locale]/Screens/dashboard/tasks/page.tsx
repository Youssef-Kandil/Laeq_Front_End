"use client";
import React from 'react'
import {ClientOnlyTable} from '@/app/components/global/Table/Table'
import { HiOutlineDotsVertical } from "react-icons/hi";




function Tasks() {


  const originalData=[
    {id:1,name:"Report 1",checklist:"checklist 1",repeated:"No repeated",site:"Site 1",company:"Company 1",status:"Completed",date:"2023-10-01"},
  ]

  const local_var = "tasks.tb_headers";
  //=== Add Action To The Table Rows
    const modifiedData = originalData.map(({ id, ...rest }) => ({
          ...rest,
          action: <HiOutlineDotsVertical onClick={()=>{}} style={{ fontSize: 20 }} />
      }));
  
  return (
    <div>
        <ClientOnlyTable 
            titles={[`${local_var}.employee`,`${local_var}.checklist`,`${local_var}.repeated`,`${local_var}.site`,`${local_var}.company`,`${local_var}.status`,`${local_var}.date`,""]}
            data={modifiedData}
            rowsFlex={[1,1,1,1,1,1,1,0.2]}
            // useCheckRows    
        />
    </div>
  )
}

export default Tasks
