
"use client";
import React from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from "next/navigation"; 
import { ClientOnlyTable } from '@/app/components/global/Table/Table';
import { MdDeleteOutline } from "react-icons/md";
import { useInspectorRequestsByAdmin ,useDeleteInspector_request } from '@/app/Hooks/useInspectorRequest'; 
import { getAdminAccountInfo } from '@/app/utils/getAccountInfo';
import SkeletonLoader from '@/app/components/global/SkeletonLoader/SkeletonLoaders';
import { AccountInfo } from '@/app/Types/AccountsType';
import Popup from '@/app/components/global/Popup/Popup';
import { FaArrowTrendUp } from "react-icons/fa6";
import { LuTrash2 } from "react-icons/lu";
import Link from 'next/link';
import { generateMapLinks } from '@/app/utils/mapLinks';

function Inspector_requests() {
  const current_lang = useLocale();
  const router = useRouter();

  React.useEffect(() => {
    localStorage.setItem('clickedAsideTitle', "inspector_requests");
  }, []);

  // === Get admin_id from account info
  const info = getAdminAccountInfo("AccountInfo") as AccountInfo | null;
  const isEmployee = info?.role === "employee";
  const limits = info?.userDetails?.admin_account_limits; 
  const [maxRequests] = React.useState<number>(
    typeof limits?.free_onsite_inspections === "number" ? limits.free_onsite_inspections : 0
  ); 
  const admin_id = isEmployee? 
          info?.userDetails?.admin_id ?? -1
          : info?.userDetails?.id ?? -1;

    const [showPopup, setShowPopup] = React.useState(false);
    const [confirmDeletePopup, setConfirmDeletePopup] = React.useState(false);
    const [selectedRequestId, setSelectedRequestId] = React.useState<number | null>(null);

    // Delete hook
    const { mutate: deleteRequest } = useDeleteInspector_request();

  // === Fetch inspector requests by admin_id
  const { data, isLoading, error } = useInspectorRequestsByAdmin(admin_id);

  if (isLoading) return <SkeletonLoader variant="table" tableColumns={6} tableRows={8} />;
  if (error) return <div>حدث خطأ: {(error as Error).message}</div>;
  if (!data) return <div>لا توجد بيانات</div>;

    // === حساب عدد الريكوستات في نفس الشهر الحالي
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11
    const currentYear = now.getFullYear();
  
    // تصفية الريكوستات اللي في نفس الشهر والسنة
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const requestsThisMonth = data.filter((item: any) => {
      const reqDate = new Date(item.request_date);
      return (
        reqDate.getMonth() === currentMonth &&
        reqDate.getFullYear() === currentYear
      );
    });
  
    const currentMonthRequestsCount = requestsThisMonth.length;
  
    console.log("📅 عدد الريكوستات في الشهر الحالي:", currentMonthRequestsCount);
    console.log("📅 الحد الأقصى المسموح:", maxRequests);
    console.log("🕒 التاريخ الحالي بالملي ثانية:", Date.now());
    console.log(
      "🕒 أول ريكوست في الشهر ده:",
      requestsThisMonth[0]
        ? new Date(requestsThisMonth[0].request_date).getTime()
        : "no requests"
    );
  

  // === Map the data for the table
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modifiedData = data.map((item: any) => ({
    id: item.id,
    company: item.companies.company_name ?? "-",
    site: item.sites.site_name ?? "-",
    status: item.status,
    location:item?.sites?.lat? <Link href={generateMapLinks(item?.sites?.lat??"",item?.sites?.long??"").google_search} style={{ color: "#68A6A6", textDecoration: "underline" }} target="_blank">Site Location</Link>:item?.sites?.full_address??"No Location",
    date: item.request_date
    ? new Date(item.request_date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-",
    action: item.status =="Pending"?(
      <MdDeleteOutline
        onClick={() => {
          setSelectedRequestId(item.id);
          setConfirmDeletePopup(true);
        }}
        color="rgba(239, 54, 54, 0.5)"
        style={{ fontSize: 20 }}
      />
    ):"-",
  }));

  const local_var = "inspector_requests.tb_headers";

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
            subTitle="when you delete this Request you cannot be undone."
            btnTitle="Yes, delete"
            btnFunc={() => {
              if (selectedRequestId) {
                deleteRequest({ id: selectedRequestId });
              }
              setConfirmDeletePopup(false);
              setSelectedRequestId(null);
            }}
            onClose={() => {
              setConfirmDeletePopup(false);
              setSelectedRequestId(null);
            }}
          />
        )}

      <ClientOnlyTable
        titles={[
          `${local_var}.id`,
          `${local_var}.company`,
          `${local_var}.site`,
          `${local_var}.status`,
          `${local_var}.location`,
          `${local_var}.date`,
          "",
        ]}
        data={modifiedData}
        filter
        rowsFlex={[1, 1, 1, 1,1, 1, 0.2]}
        navButtonTitle="inspector_requests"
        navButtonAction={() =>{
          if (maxRequests > currentMonthRequestsCount ) {
            router.push(`/${current_lang}/Screens/dashboard/inspector_requests/requestForm`);
          }else{
            setShowPopup(true)
          }
        }}
      />
    </div>
  );
}

export default Inspector_requests;
