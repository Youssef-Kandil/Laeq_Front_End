"use client";
import React from 'react'
import {ClientOnlyTable} from '@/app/components/global/Table/Table';
import { useEmployees } from '@/app/Hooks/useEmployees';
import { getAdminAccountInfo } from '@/app/utils/getAccountInfo';
import {useRouter } from 'next/navigation'
import { useLocale } from 'next-intl';
import SkeletonLoader from '@/app/components/global/SkeletonLoader/SkeletonLoaders';

import { LuTrash2 } from "react-icons/lu";
import { FiEdit2 } from "react-icons/fi";

function Users() {
        const router = useRouter();
        const current_lang = useLocale();
        const AdminInfo = getAdminAccountInfo();
        const { data, isLoading, error } = useEmployees(AdminInfo?.userDetails?.id ?? 0);
          if (isLoading) return <SkeletonLoader variant="table" tableColumns={4} tableRows={5} />;
          if (error) return <p>حصل خطأ!</p>;
        console.warn("USERS : ",data)


      const local_var = "employees.tb_headers";
      //=== Add Action To The Table Rows
      interface Employee {
        full_name: string;
        users: { email: string };
        sites: { site_name: string };
        roles: { role_name: string };
      }

      const modifiedData = data?.map(({ full_name, users, sites, roles }: Employee) => ({
        full_name,
        email: users.email,
        site: sites.site_name,
        role: roles.role_name,
        delete_action: <LuTrash2 style={{ fontSize: 20 }} />,
        edit_action: <FiEdit2 style={{ fontSize: 20 }} />
      }));
  return (
    <div>
        <ClientOnlyTable 
            titles={[`${local_var}.name`,`${local_var}.email`,`${local_var}.site`,`${local_var}.role`,"",""]}
            data={modifiedData}
            rowsFlex={[1,1,1,1,0.2,0.2]}
            navButtonTitle='employees'
            navButtonAction={()=>router.push(`/${current_lang}/Screens/dashboard/users/AddUserForm`)}
         />
    </div>
  )
}

export default Users
