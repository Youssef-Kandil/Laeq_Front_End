"use client";
import React from 'react'
import Table from '@/app/components/global/Table/Table'
import { LuTrash2 } from "react-icons/lu";
import { FiEdit2 } from "react-icons/fi";


function Assets() {
  return (
    <div>
        <Table 
          titles={["Asset Name","Model","Category","Company","Site","Brand","Warranty","",""]}
          data={[
            {name:"Asset name",Model:"Asset Model",Category:"Asset Category",company:"Asset company",site:"Asset site",Brand:"Asset Brand",date:"5 Years",delete_action:<LuTrash2 style={{fontSize:20}}/>,edit_action:<FiEdit2 style={{fontSize:20}}/>},

          ]}
          rowsFlex={[1,1,1,1,1,1,1,0.2,0.2]}
         />
    </div>
  )
}

export default Assets
