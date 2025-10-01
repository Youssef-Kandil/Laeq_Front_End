"use client";
import React from 'react'
import {ClientOnlyTable} from '@/app/components/global/Table/Table';
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl';
import { useRole ,useDeleteRole } from '@/app/Hooks/useRole';
import { getAdminAccountInfo } from '@/app/utils/getAccountInfo';
import SkeletonLoader from '@/app/components/global/SkeletonLoader/SkeletonLoaders';

import { LuTrash2 } from "react-icons/lu";
import { FiEdit2 } from "react-icons/fi";

function Roles() {
        React.useEffect(()=>{
            localStorage.setItem('clickedAsideTitle',"roles");
        },[])
        const router = useRouter();
        const current_lang = useLocale();
        const Info = getAdminAccountInfo("AccountInfo"); 
        const local_var = "roles.tb_headers";

      // Delete hook
      const { mutate: deleteRole } = useDeleteRole();
        const {data,isLoading,error} = useRole(Info?.userDetails.id ?? 0);
        console.warn("data : ",data)
              if (isLoading) return <SkeletonLoader variant="table" tableColumns={6} tableRows={8} />;
              if (error) return <div>حدث خطأ: {(error as Error).message}</div>;
              if (!data) return <div>لا توجد بيانات</div>;



      //=== Add Action To The Table Rows
      // Define a type for the role data

      type Role = {
        id: number;
        admin_id:number;
        role_name: string;
        description: string;
        date_created: string;
        role_permissions: [];
        // Add other fields as needed
      };

      // Ensure 'data' is typed as Role[]
      const modifiedData = (data as Role[]).map(({id, role_name,description}) => ({
        role_name,
        description,
         delete_action:<LuTrash2 onClick={()=>deleteRole({id})} style={{fontSize:20}}/>,
         edit_action:<FiEdit2 onClick={()=>router.push(`/${current_lang}/Screens/dashboard/roles/EditRoleForm/${id}`)} style={{fontSize:20}}/>
      }));
  return (
    <div>
        <ClientOnlyTable 
            titles={[`${local_var}.name`,`${local_var}.description`,"",""]}
            data={modifiedData}
            rowsFlex={[1,1,0.2,0.2]}
            navButtonTitle='roles'
            navButtonAction={()=>router.push(`/${current_lang}/Screens/dashboard/roles/AddRoleForm`)}
         />
    </div>
  )
}

export default Roles
