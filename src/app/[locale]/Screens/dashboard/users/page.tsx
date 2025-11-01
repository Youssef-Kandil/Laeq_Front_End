"use client";
import React from 'react'
import {ClientOnlyTable} from '@/app/components/global/Table/Table';
import { useEmployees , useDeleteEmp } from '@/app/Hooks/useEmployees';
import { getAdminAccountInfo } from '@/app/utils/getAccountInfo';
import {useRouter } from 'next/navigation'
import { useLocale } from 'next-intl';
import SkeletonLoader from '@/app/components/global/SkeletonLoader/SkeletonLoaders';
import Popup from '@/app/components/global/Popup/Popup';

import { LuTrash2 } from "react-icons/lu";
import { FiEdit2 } from "react-icons/fi";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";

function Users() {
  React.useEffect(()=>{
    localStorage.setItem('clickedAsideTitle',"users");
  },[])

  const router = useRouter();
  const current_lang = useLocale();
  const info = getAdminAccountInfo("AccountInfo");
  const limits = info?.userDetails?.admin_account_limits as { max_users?: number } ?? {};
  const [maxEmps] = React.useState(limits.max_users ?? 0);
  const [showPopup, setShowPopup] = React.useState(false);

  const isEmployee = info?.role === "employee";    
  const targetId  = isEmployee ? info?.userDetails?.admin_id : info?.userDetails?.id;

  // Hooks
  const { mutate: deleteEmp } = useDeleteEmp();
  const { data, isLoading, error } = useEmployees(targetId ?? 0);

  // حالة البوباب التأكيدي للحذف
  const [confirmDeletePopup, setConfirmDeletePopup] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState<number | null>(null);

  if (isLoading) return <SkeletonLoader variant="table" tableColumns={4} tableRows={5} />;
  if (error) return <p>حصل خطأ!</p>;

  const local_var = "employees.tb_headers";

  interface Employee {
    id:number;
    user_id:number;
    full_name: string;
    phone: string;
    users: { email: string };
    sites: { site_name: string };
    roles: { role_name: string };
  }

  const modifiedData = data?.map(({id,user_id, full_name,phone, users, sites, roles }: Employee) => {
    return {
      full_name,
      phone,
      email: users.email,
      site: sites.site_name,
      role: roles.role_name,
      delete_action: isEmployee ? null : (
        <LuTrash2 
          onClick={()=>{
            setSelectedUserId(user_id);
            setConfirmDeletePopup(true);
          }} 
          style={{ fontSize: 20, cursor:"pointer" }} 
        />
      ),
      edit_action: isEmployee ? null : <FiEdit2 onClick={()=>router.push(`/${current_lang}/Screens/dashboard/users/EditUserForm/${id}`)} style={{ fontSize: 20 }} />,
      show_action: isEmployee ? null : <FaRegEye onClick={()=>router.push(`/${current_lang}/Screens/dashboard/users/ShowUserDetails/${id}`)} style={{ fontSize: 20 }} />,
    };
  });

  return (
    <div>
      {/* بوباب حدود الخطة */}
      {showPopup && (
        <Popup 
          icon={<FaArrowTrendUp/>} 
          title="You’ve reached " 
          subTitle="the limit allowed in your plan." 
          btnTitle="Upgrade to unlock higher limits"
          btnFunc={()=>router.push(`/${current_lang}/Screens/dashboard/payments_plans`)}
          onClose={()=>setShowPopup(false)}
        />
      )}

      {/* بوباب تأكيد الحذف */}
      {confirmDeletePopup && (
      <Popup
        icon={<LuTrash2 style={{ color: "red" }} />}
        title="Are you sure you want to delete?"
        subTitle="when you delete this user you cannot be undone."
        btnTitle="Yes, delete"
        btnFunc={() => {
          if (selectedUserId) {
            deleteEmp({ id: selectedUserId });
          }
          setConfirmDeletePopup(false);
          setSelectedUserId(null);
        }}
        onClose={() => {
          setConfirmDeletePopup(false);
          setSelectedUserId(null);
        }}
      />
    )}


      <ClientOnlyTable 
        titles={[`${local_var}.name`,`${local_var}.phone`,`${local_var}.email`,`${local_var}.site`,`${local_var}.role`,"","",""]}
        data={modifiedData}
        rowsFlex={[1,1,1,1,1,0.2,0.2,0.2]}
        navButtonTitle={isEmployee?"":'employees'}
        navButtonAction={()=>{
          if (maxEmps >(data?.length??1000)) {       
            router.push(`/${current_lang}/Screens/dashboard/users/AddUserForm`)
          }else{
            setShowPopup(true);
          }
        }}
      />
    </div>
  )
}

export default Users
