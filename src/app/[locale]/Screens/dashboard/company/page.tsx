
"use client";
import React from 'react'
import {ClientOnlyTable} from '@/app/components/global/Table/Table';

import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl';

import { LuTrash2 } from "react-icons/lu";
import { FiEdit2 } from "react-icons/fi";
import { useGetCompaniesByUserId ,useDeleteCompany } from '../../../../Hooks/useCompany';
import { getAdminAccountInfo } from '@/app/utils/getAccountInfo';
import Popup from '@/app/components/global/Popup/Popup';
import SkeletonLoader from '@/app/components/global/SkeletonLoader/SkeletonLoaders';
import { FaArrowTrendUp } from "react-icons/fa6";
import { AccountInfo } from '@/app/Types/AccountsType';
import { FaRegEye } from "react-icons/fa";


function Company() {
        const router = useRouter();
        const current_lang = useLocale();
        const info = getAdminAccountInfo("AccountInfo") as AccountInfo | null;
        const isEmployee = info?.role === "employee";    
        const targetId  =
                isEmployee
                  ? info?.userDetails?.admin_id
                  : info?.userDetails?.id;
        const limits = info?.userDetails?.admin_account_limits;
        const [maxCompanies] = React.useState<number>(
            typeof limits?.max_branches === "number" ? limits.max_branches : 0
        );
        const [showPopup, setShowPopup] = React.useState(false);
        const [confirmDeletePopup, setConfirmDeletePopup] = React.useState(false);
        const [selectedCompanyId, setSelectedCompanyId] = React.useState<number | null>(null);

        React.useEffect(() => {
            localStorage.setItem('clickedAsideTitle', "company");
        },[])

// company_name - sector_type - sites
      const local_var = "company.tb_headers";

      interface CompanyData {
        id:number;
        company_name: string;
        sector_type: string;
        sites: [];
      }
      
      // Delete hook
      const { mutate: deleteCompany } = useDeleteCompany();
      
      const { data, isLoading, error } = useGetCompaniesByUserId(targetId??-1);
              if (isLoading) return <SkeletonLoader variant="table" tableColumns={6} tableRows={8} />;
              if (error) return <div>حدث خطأ: {(error as Error).message}</div>;
              if (!data) return <div>لا توجد بيانات</div>;
              console.log("Comapny : ",data)
      //=== Add Action To The Table Rows
      const modifiedData = (data.companies as CompanyData[]).map(({id, company_name, sector_type, sites }) => ({
          company_name,
          sector_type,
          sites: sites.length, // عدد المواقع
          delete_action:<LuTrash2 onClick={()=>{
            setSelectedCompanyId(id);
            setConfirmDeletePopup(true);
           }} style={{fontSize:20}}/>,
          edit_action: isEmployee? null: <FiEdit2 onClick={()=>router.push(`/${current_lang}/Screens/dashboard/company/EditCompanyForm/${id}`)} style={{ fontSize: 20 }} />,
          show_action:  <FaRegEye onClick={()=>router.push(`/${current_lang}/Screens/dashboard/company/ShowCompanyDetails/${id}`)} style={{ fontSize: 20 }} />,
      }));
  return (
    <div>
      {showPopup&&<Popup 
        icon={<FaArrowTrendUp/>} 
        title="You’ve reached " 
        subTitle="the limit allowed in your plan." 
        btnTitle="Upgrade to unlock higher limits"
        btnFunc={()=>router.push(`/${current_lang}/Screens/dashboard/payments_plans`)}
        onClose={()=>setShowPopup(false)}/>}
            {/* بوباب تأكيد الحذف */}
      {confirmDeletePopup && (
          <Popup
            icon={<LuTrash2 style={{ color: "red" }} />}
            title="Are you sure you want to delete?"
            subTitle="when you delete this Company you cannot be undone."
            btnTitle="Yes, delete"
            btnFunc={() => {
              if (selectedCompanyId) {
                deleteCompany({ id: selectedCompanyId });
              }
              setConfirmDeletePopup(false);
              setSelectedCompanyId(null);
            }}
            onClose={() => {
              setConfirmDeletePopup(false);
              setSelectedCompanyId(null);
            }}
          />
        )}


        <ClientOnlyTable 
            titles={[`${local_var}.name`,`${local_var}.sectorType`,`${local_var}.site`,"","",""]}
            data={modifiedData}
            rowsFlex={isEmployee?[1,1,1,0,0,0.2]:[1,1,1,0.2,0.2,0.2]}
            navButtonTitle={isEmployee?"":'company'}
            navButtonAction={()=>{
              if(maxCompanies > data.companies.length){
                router.push(`/${current_lang}/Screens/dashboard/company/AddCompanyForm`)
              }else{
                setShowPopup(true)
              }
            }}
         />
    </div>
  )
}

export default Company
