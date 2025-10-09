"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Styles from "./laeqAside.module.css";
import { useTranslations, useLocale } from "next-intl";
import laeq_aside_titles from "@/app/config/laeq_aside_titles";


import { FaPowerOff } from "react-icons/fa6";

import Cookies from "js-cookie";
import { getAdminAccountInfo } from "@/app/utils/getAccountInfo";
// import { useRouter } from "next/navigation";
import { AccountInfo } from "@/app/Types/AccountsType";


function LaeqAside() {
  const info :AccountInfo = getAdminAccountInfo("AccountInfo") as AccountInfo;
  console.log("Nave INFo ", info);
// const router = useRouter();
  const current_lang = useLocale();
  const t = useTranslations("aside_component");

  // ==== handel Clecked text ====
  const [clickedTitle, setClickedTitle] = React.useState<string>(
    t(laeq_aside_titles[0].title)
  );

  React.useEffect(() => {
    const savedTitle = localStorage.getItem("clickedAsideTitle");
    if (savedTitle) {
      setClickedTitle(savedTitle);
    }
  }, []);

  interface TitleElement {
    title: string;
  }

  const handleTitleClick = async (el: TitleElement) => {
    console.log("Clicked Title : ", el.title);
    setClickedTitle(el.title);
    Cookies.set("clickedAsideTitle", el.title);
  };

  // لو المستخدم موظف → فلترة العناوين بناءً على البرمشنز
  // let allowedTitles = laeq_aside_titles;
  // if (info?.role === "employee") {
  //   const userPermissions = info?.userDetails?.permissions || [];

  //   allowedTitles = laeq_aside_titles.filter(
  //     (el) =>
  //       el.title === "tasks" || 
  //       el.title === "settings" || 
  //       userPermissions.includes(el.permission_name)
  //   );
  // }

  // === Render Titles ===
  const titles = laeq_aside_titles.map((el, index) => {
    return (
      <Link
        href={`/${current_lang}/laeq-admin/dashboard${el.href}`}
        onClick={() => handleTitleClick(el)}
        style={
          clickedTitle == el.title
            ? {
                background: "#5CC6A31A",
                color: "#4DA387",
                marginBottom: index == 4 || index == 8 ? 20 : 0,
              }
            : { marginBottom: index == 4 || index == 8 ? 20 : 0 }
        }
        className={Styles.title}
        key={index}
      >
        {el.icon}
        <p>{t(`${el.title}`)}</p>
        {index == 4 && (
          <span
            style={{
              width: "100%",
              height: "1px",
              background: "#E2E8F0",
              position: "absolute",
              bottom: "-10px",
              left: "-10%",
            }}
          ></span>
        )}
        {index == 8 && (
          <span
            style={{
              width: "100%",
              height: "1px",
              background: "#E2E8F0",
              position: "absolute",
              bottom: "-10px",
              left: "-10%",
            }}
          ></span>
        )}
      </Link>
    );
  });

  return (
    <div className={Styles.parent} lang={current_lang}>
      <div className={Styles.main_title}>
        <Image
          src={"/images/laeq_icon.png"}
          style={{ borderRadius: "50%" }}
          alt=""
          loading="lazy"
          width={30}
          height={30}
        />
        <h3>LAEQ365</h3>
      </div>
      <div className={Styles.titlesList}>
        {titles}
      {/*=======  LOGOUT ====== */}
      {/*=======  LOGOUT ====== */}
      <div
          onClick={()=>{
              localStorage.clear();
              localStorage.removeItem("AccountInfo");
              Cookies.remove("AccountInfo")
          }}  
          className={Styles.title} 
          style={{textDecoration:"underline",color:"rgba(199, 8, 8, 0.5)"}}>
            <FaPowerOff style={{fontSize:20}}/>
            <p>logout</p>
          </div>
      </div>
    </div>
  );
}

export default LaeqAside;
