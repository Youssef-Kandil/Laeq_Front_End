"use client";
import React from "react";
import { ClientOnlyTable } from "@/app/components/global/Table/Table";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import { useSubscripe } from "@/app/Hooks/useSubscripe";
import SkeletonLoader from "@/app/components/global/SkeletonLoader/SkeletonLoaders";
import BottonComponent from "@/app/components/global/ButtonComponent/BottonComponent";





interface SubscripeType {
  id?:number;
  transaction_id: string;
  admin_users: { users: { email: string } };
  plans: { title: string; is_yearly: number };
  amount: string;
  subscripe_at: string;
}

function Subscriptions() {
  React.useEffect(() => {
    localStorage.setItem("clickedAsideTitle", "subscriptions");
  }, []);

  const router = useRouter();
  const current_lang = useLocale();






  // === Fetch subscriptions ===
  const {
    data: SubscripeData,
    isLoading,
    isError,
  } = useSubscripe();

  const local_var = "subscriptions.tb_headers";
  const baseHeaders = [
    `${local_var}.transaction_id`,
    `${local_var}.user`,
    `${local_var}.plan`,
    `${local_var}.planType`,
    `${local_var}.amount`,
    `${local_var}.subscripe_at`,
    ""
  ];




  if (isLoading) return <SkeletonLoader />;
  if (isError) return <p className="text-red-500">❌ Error loading Subscriptions</p>;

  // ✅ FIXED: correct object return from map
  const modifiedData =
    SubscripeData?.map((Subscripe: SubscripeType) => ({
      id: Subscripe?.transaction_id ?? "-",
      user: Subscripe?.admin_users?.users?.email || "—",
      plan: Subscripe?.plans?.title || "—",
      planType: Subscripe?.plans?.is_yearly == 0 ? "monthly" : "yearly",
      amount: Subscripe?.amount || "—",
      subscripe_at: Subscripe?.subscripe_at
        ? new Date(Subscripe?.subscripe_at ?? "").toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : "—",
       action:<BottonComponent title="invoice" onClick={()=>{router.push(`/${current_lang}/laeq-admin/dashboard/Subscriptions/Invoice/${Subscripe?.id}`)}}/>
    })) || [];

  return (
    <div>
      <ClientOnlyTable
        titles={baseHeaders}
        data={modifiedData}
        rowsFlex={ [2, 1, 1, 0.5, 0.5, 1, 0.5]}
      />
    </div>
  );
}

export default Subscriptions;
