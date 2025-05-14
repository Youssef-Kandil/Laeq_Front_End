"use client";
import React from 'react'
import Table from '@/app/components/global/Table/Table'
import { LuTrash2 } from "react-icons/lu";
import { FiEdit2 } from "react-icons/fi";

function Actions() {
  return (
    <div>
        <Table 
          titles={["Action ID","Action name","Company","Site","Submitted by","Date","Status","Assign","",""]}
          data={[
            {id:1,name:"Report 1",company:"Company 1",site:"Site 1",submitted_by:"User 1",date:"2023-10-01",status:"Completed",assign_action:<div>Assign</div>,delete_action:<LuTrash2 style={{fontSize:20}}/>,edit_action:<FiEdit2 style={{fontSize:20}}/>},
          ]}
          rowsFlex={[0.6,1,1,1,1,1,1,1,0.2,0.2]}
         />
    </div>
  )
}

export default Actions
