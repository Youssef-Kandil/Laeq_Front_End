"use client";
import React from 'react'
import {ClientOnlyTable} from '@/app/components/global/Table/Table';

import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl';

import { LuTrash2 } from "react-icons/lu";
import { FiEdit2 } from "react-icons/fi";
import { useGetCompaniesByUserId } from '../../../../Hooks/useCompany';
import { getAdminAccountInfo } from '@/app/utils/getAccountInfo';
import Popup from '@/app/components/global/Popup/Popup';
import SkeletonLoader from '@/app/components/global/SkeletonLoader/SkeletonLoaders';
import { FaArrowTrendUp } from "react-icons/fa6";

function Company() {
        const router = useRouter();
        const current_lang = useLocale();
        const AdminInfo = getAdminAccountInfo("AccountInfo");
        const limits = AdminInfo?.userDetails?.admin_account_limits ?? [];
        const [maxCompanies] = React.useState(limits[0]?.max_companies ?? 0);
        const [showPopup,setShowPopup] = React.useState(false);

// company_name - sector_type - sites
      const local_var = "company.tb_headers";

      interface CompanyData {
        company_name: string;
        sector_type: string;
        sites: [];
      }

      const { data, isLoading, error } = useGetCompaniesByUserId(AdminInfo?.userDetails.id??0);
              if (isLoading) return <SkeletonLoader variant="table" tableColumns={6} tableRows={8} />;
              if (error) return <div>حدث خطأ: {(error as Error).message}</div>;
              if (!data) return <div>لا توجد بيانات</div>;
      //=== Add Action To The Table Rows
      const modifiedData = (data as CompanyData[]).map(({ company_name, sector_type, sites }) => ({
          company_name,
          sector_type,
          sites: sites.length, // عدد المواقع
          delete_action: <LuTrash2 style={{ fontSize: 20 }} />,
          edit_action: <FiEdit2 style={{ fontSize: 20 }} />
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


        <ClientOnlyTable 
            titles={[`${local_var}.name`,`${local_var}.sectorType`,`${local_var}.site`,"",""]}
            data={modifiedData}
            rowsFlex={[1,1,1,0.2,0.2]}
            navButtonTitle='company'
            navButtonAction={()=>{
              if(maxCompanies <= data.length){
                  console.log("maxCompanies");
                  setShowPopup(true)
              }else{
                router.push(`/${current_lang}/Screens/dashboard/company/AddCompanyForm`)
              }
            }}
         />
    </div>
  )
}

export default Company
