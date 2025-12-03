"use client";
import React from "react";
import Styles from "./currentPlanBanerComponent.module.css";
import { FaSuperpowers } from "react-icons/fa";
// import { getAdminAccountInfo } from "@/app/utils/getAccountInfo"; 

import { AccountInfo } from "@/app/Types/AccountsType";

interface CurrentPlanBanerComponentProps {
  info: AccountInfo | null | undefined;
}

function CurrentPlanBanerComponent({ info }: CurrentPlanBanerComponentProps) {
  if (!info) {
    return <div className={Styles.baner}>Error To Get Your Plan Try Refresh Page !</div>;
  }

  const endDate = info?.userDetails?.end_date
    ? new Date(info.userDetails.end_date).getTime()
    : null;

  const now = Date.now();
  const isExpired = endDate ? endDate < now : false;

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className={Styles.baner}>
      <section>
        <div className={Styles.banerIconBox}>
          <FaSuperpowers />
        </div>
        <div className={Styles.banerText}>
          <h3>{info?.userDetails?.plan_type || "No plan"}</h3>
          {endDate && (
            <p style={{ color: isExpired ? "rgba(226, 40, 40, 0.7)" : "green" }}>
              {isExpired
                ? `Expired on ${formatDate(endDate)}`
                : `Expires on ${formatDate(endDate)}`}
            </p>
          )}
        </div>
      </section>

      {isExpired && (!info?.userDetails?.plan_type?.includes("free")) && (
        <button type="button">Renew</button>
      )}
    </div>
  );
}

export default CurrentPlanBanerComponent;
