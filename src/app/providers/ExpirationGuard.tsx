"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CheckIsExpired } from "@/app/utils/CheckIsExpired";
import { getAdminAccountInfo } from "../utils/getAccountInfo";
import TableSceletonLoader from "../components/global/Table/TableSceletonLoader";

export default function ExpirationGuard({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const info = getAdminAccountInfo("AccountInfo");
    const expired = CheckIsExpired();
    console.warn("expired ",expired)
    const onPaymentPage = pathname.includes("payments_plans");
    if (expired == "INFO IS NULL") {
      router.replace(`/${locale}/Screens/forms/login`);
    }

    if(info?.role == "employee"){
      setChecked(true);
      return;
    }

    if (expired && !onPaymentPage) {
      // الاشتراك منتهي وأنت مش على صفحة الدفع → اعمل redirect
      router.replace(`/${locale}/Screens/dashboard/payments_plans`);
    } else {
      // الاشتراك سليم أو انت بالفعل على صفحة الدفع → خلي الأطفال يظهروا
      setChecked(true);
    }
  }, [locale, router, pathname]);

  if (!checked) {
    return <TableSceletonLoader/>; // أو أي loading skeleton تحبه
  }

  return <>{children}</>;
}
