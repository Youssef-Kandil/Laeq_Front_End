"use client";
import React from "react";
import Styles from "./nave.module.css";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import app_identity from "@/app/config/identity";
// import { decryptionLocalStorage } from "@/app/utils/decryptionLocalstorageINFO";
import { getAdminAccountInfo } from "@/app/utils/getAccountInfo";

function Nave() {
  const current_lang = useLocale();
  const t = useTranslations("aside_component");
  // const router = useRouter();
  const pathname = usePathname();
  const info = getAdminAccountInfo("AccountInfo");



  const avatarColors = [
    { bg: "#FEE2E2", color: "#B91C1C" }, // أحمر فاتح
    { bg: "#E0F2FE", color: "#0369A1" }, // أزرق سماوي
    { bg: app_identity?.secondary_color , color: app_identity?.primary_color }, // أخضر
    { bg: "#F3E8FF", color: "#6B21A8" }, // بنفسجي
    { bg: "#FFF7ED", color: "#C2410C" }, // أورانج
    { bg: "#EDE9FE", color: "#4C1D95" }, // موف
  ];

  function getAvatarStyle(name: string) {
    if (!name) {
      return avatarColors[0]; // fallback
    }
  
    const firstChar = name[0].toUpperCase();
    const index = firstChar.charCodeAt(0) % avatarColors.length; // يختار لون ثابت
  
    return avatarColors[index];
  }

  const userName = info?.userDetails?.full_name ?? "";
  const avatar = getAvatarStyle(userName);
  const firstLetter = userName[0]?.toUpperCase() ?? "";
  

  // state عشان تخزن فيها الداتا بعد ما الكومبوننت يركب



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

      <div style={{display: "flex",gap:10}}>
        <div style={{display: "flex",flexDirection:"column"}}>
          <p style={{ fontSize: 16 }}>{info?.userDetails?.full_name??""}</p>
          <p style={{ fontSize: 13, color:"#a7a7a7" }}>{info?.role} account</p>
        </div>
        <div
          style={{
            width: 38,
            height: 38,
            border:`1px solid ${avatar.color}`,
            borderRadius: "50%",
            background: avatar.bg,
            color: avatar.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {firstLetter}
        </div>

      </div>
    </div>
  );
}

export default Nave;
