"use client";
import React from 'react'
import Table from '@/app/components/global/Table/Table'
import { LuTrash2 } from "react-icons/lu";
import { FiEdit2 } from "react-icons/fi";

function Company() {
  return (
    <div>
        <Table 
          titles={["Company  Name","Sector type","Site","Size","",""]}
          data={[
            {name:"Company name",Sector:"Sector",Site:"Site",Size:"Size",delete_action:<LuTrash2 style={{fontSize:20}}/>,edit_action:<FiEdit2 style={{fontSize:20}}/>},
          ]}
          rowsFlex={[1,1,1,2,0.2,0.2]}
         />
    </div>
  )
}

export default Company
