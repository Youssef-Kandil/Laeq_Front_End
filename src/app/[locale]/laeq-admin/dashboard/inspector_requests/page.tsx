
"use client";
import React from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from "next/navigation"; 
import { ClientOnlyTable } from '@/app/components/global/Table/Table';
import { useInspectorRequests ,useUpdateInspectorRequestStatus } from '@/app/Hooks/useInspectorRequest'; 

// import { getAdminAccountInfo } from '@/app/utils/getAccountInfo';
import SkeletonLoader from '@/app/components/global/SkeletonLoader/SkeletonLoaders';
// import { AccountInfo } from '@/app/Types/AccountsType';
// import Popup from '@/app/components/global/Popup/Popup';
import BottonComponent from '@/app/components/global/ButtonComponent/BottonComponent';
import Link from 'next/link';
import { generateMapLinks } from '@/app/utils/mapLinks';

function Inspector_requests() {
  const current_lang = useLocale();
  const router = useRouter();

  React.useEffect(() => {
    localStorage.setItem('clickedAsideTitle', "inspector_requests");
  }, []);

  // === Get admin_id from account info
  // const info = getAdminAccountInfo("AccountInfo") as AccountInfo | null;





    // Delete hook
    const { mutate: updateStatus } = useUpdateInspectorRequestStatus();

  // === Fetch inspector requests by admin_id
  const { data, isLoading, error } = useInspectorRequests();

  if (isLoading) return <SkeletonLoader variant="table" tableColumns={6} tableRows={8} />;
  if (error) return <div>حدث خطأ: {(error as Error).message}</div>;
  if (!data) return <div>لا توجد بيانات</div>;

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
    assignAction:
    item.status === "Pending" ? (
      <BottonComponent
        title="Assign"
        onClick={() => {
          router.push(
            `/${current_lang}/laeq-admin/dashboard/inspector_requests/AssignForm/${item.id}-${item?.admin_id}-${item?.companies?.id}-${item?.sites?.id}`
          );
        }}
      />
    ) : item.status === "Rejected" ? (
      <p style={{ color: "red" }}>Rejected</p>
    ) : (
      <p style={{ color: "green" }}>Assigned</p>
    ),
    rejectAction:item.status == "Pending"? (
      <BottonComponent
        title='reject'
        onClick={() => {
          updateStatus({request_id:Number(item.id),status:"Rejected"})
        }}
        colorRed
      />
    ):"--",
  }));

  const local_var = "inspector_requests.tb_headers";

  return (
    <div>


      <ClientOnlyTable
        titles={[
          `${local_var}.id`,
          `${local_var}.company`,
          `${local_var}.site`,
          `${local_var}.status`,
          `${local_var}.location`,
          `${local_var}.date`,
          "",
          "",
        ]}
        data={modifiedData}
        filter
        rowsFlex={[1, 1, 1, 1,1, 1, 0.5, 0.5]}
      />
    </div>
  );
}

export default Inspector_requests;
