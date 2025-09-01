"use client";
import React from "react";
import Styles from "./nave.module.css";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import app_identity from "@/app/config/identity";
import { decryptionLocalStorage } from "@/app/utils/decryptionLocalstorageINFO";

function Nave() {
  const current_lang = useLocale();
  const t = useTranslations("aside_component");
  // const router = useRouter();
  const pathname = usePathname();

  // state عشان تخزن فيها الداتا بعد ما الكومبوننت يركب
  const [info, setInfo] = React.useState<{ userDetails: { full_name: string } } | null>(null);

  React.useEffect(() => {
    const Account = decryptionLocalStorage("AccountInfo");
    if (Account) {
      try {
        setInfo(JSON.parse(Account));
      } catch (e) {
        console.error("Failed to parse AccountInfo:", e);
      }
    }
  }, []);

  const [nave_Title, setNave_Title] = React.useState("");
  React.useEffect(() => {
    function handleRouteChange() {
      const segments = String(pathname).split("/").filter(Boolean);
      const dashboardIndex = segments.indexOf("dashboard");
      setNave_Title(dashboardIndex !== -1 ? segments[dashboardIndex + 1] : "");
    }
    handleRouteChange();
  }, [pathname]);

  return (
    <div className={Styles.parent} lang={current_lang}>
      {nave_Title === "notifications" ? (
        <h2>{t("notifications")}</h2>
      ) : (
        <h2>{t(nave_Title === "summeries" ? "dashboard" : nave_Title || "dashboard")}</h2>
      )}

      <div>
        <p style={{ fontSize: 17, color: app_identity.secondary_color }}>HI,</p>
        <p>{info?.userDetails?.full_name}</p>
      </div>
    </div>
  );
}

export default Nave;
