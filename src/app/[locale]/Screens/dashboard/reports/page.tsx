"use client";
import React from "react";
import { ClientOnlyTable } from "@/app/components/global/Table/Table";
// import { HiOutlineDotsVertical } from "react-icons/hi";
import { useAdminReports, useUserReports } from "@/app/Hooks/useGetTasksReports";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import SkeletonLoader from "@/app/components/global/SkeletonLoader/SkeletonLoaders";
import { getAdminAccountInfo } from "@/app/utils/getAccountInfo";
import { AccountInfo } from "@/app/Types/AccountsType";
import { FaRegEye } from "react-icons/fa";

function Report() {
  const router = useRouter();
  const current_lang = useLocale();

  React.useEffect(() => {
    localStorage.setItem("clickedAsideTitle", "reports");
  }, []);

  // === معلومات الحساب (عشان نحدد Admin ولا User)
  const info = getAdminAccountInfo("AccountInfo") as AccountInfo | null;
  console.log("info?.email :: ",info?.email)
  const isEmployee = info?.role === "employee";
  const targetId = isEmployee ? info?.userDetails?.id : info?.userDetails?.id; // user_id لو يوزر, admin_id لو أدمن
  const adminQuery = useAdminReports(targetId ?? -1);
  const userQuery = useUserReports(targetId ?? -1);
  
  const { data, isLoading, error } = isEmployee ? userQuery : adminQuery;


  if (isLoading) return <SkeletonLoader variant="table" tableColumns={8} tableRows={8} />;
  if (error) return <div>حدث خطأ: {(error as Error).message}</div>;
  if (data == null) return <div>لا توجد بيانات</div>;
  // if (!data || data.length === 0) return <div>لا توجد بيانات</div>;

  const local_var = "reports.tb_headers";

  // === تعديل البيانات عشان تناسب الجدول
  //    "score": "{\"finalScore\":10,\"templateScore\":8,\"percentage\":\"80%\"}"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modifiedData = data.map((item: any, index: number) => ({
    id: index + 1,
    name: item.template_title,
    company: item.site_name ?? "-", // لو محتاج نضيفها بعدين
    site: item?.score ? JSON.parse(item?.score).percentage : "0%",       // لو محتاج نضيفها بعدين
    submitted_by:info?.email ==  item.answered_by_user ? "You": item.answered_by_user,
    date: item.answered_at
      ? new Date(item.answered_at).toLocaleDateString("en-GB")
      : "-",
    action: (
      <FaRegEye 
          onClick={()=>router.push( `/${current_lang}/Screens/dashboard/reports/Report_Details/data-${item?.id}`)}
          // onClick={()=>router.push( `/${current_lang}/Screens/dashboard/reports/Report_Details/${item?.template_id}-${item?.task_id}`)}
          style={{ fontSize: 20 }}/> 
    ),
  }));
  console.log("REPORT :: ",data)

  return (
    <div>
      <ClientOnlyTable
        titles={[
          `${local_var}.id`,
          `${local_var}.name`,
          `${local_var}.site`,
          `${local_var}.score`,
          `${local_var}.submitted_by`,
          `${local_var}.date`,
          "",
        ]}
        data={modifiedData}
        rowsFlex={[0.6, 1, 1, 1, 1, 1 , 0.2]}
        navButtonTitle="reports"
      />
    </div>
  );
}

export default Report;
