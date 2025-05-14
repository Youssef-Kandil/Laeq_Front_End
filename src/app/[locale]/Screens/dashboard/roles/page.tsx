"use client";
import React from 'react'
import Table from '@/app/components/global/Table/Table'
import { LuTrash2 } from "react-icons/lu";
import { FiEdit2 } from "react-icons/fi";

function Roles() {
  return (
    <div>
        <Table 
          titles={["Role Name","Department","Description","",""]}
          data={[
            {name:"Asset name",Department:"Department",Description:"Description DescriptionDescription Description Description DescriptionvDescription",delete_action:<LuTrash2 style={{fontSize:20}}/>,edit_action:<FiEdit2 style={{fontSize:20}}/>},
          ]}
          rowsFlex={[1,1,2,0.2,0.2]}
         />
    </div>
  )
}

export default Roles
