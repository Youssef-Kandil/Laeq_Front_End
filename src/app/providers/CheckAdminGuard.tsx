"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CheckIsExpired } from "@/app/utils/CheckIsExpired";
import { getAdminAccountInfo } from "../utils/getAccountInfo";
import TableSceletonLoader from "../components/global/Table/TableSceletonLoader";

export default function CheckAdminGuard({
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
    if (expired == "INFO IS NULL") {
      router.replace(`/${locale}/Screens/forms/login`);
    }

    if(info?.role == "laeq"){
      setChecked(true);
      return;
    }else{
      setChecked(false);
      router.replace(`/${locale}/Screens/forms/login`);
    }
  }, [locale, router, pathname]);

  if (!checked) {
    return <TableSceletonLoader/>; // أو أي loading skeleton تحبه
  }

  return <>{children}</>;
}
