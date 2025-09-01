"use client";
import React, { useEffect, useState } from "react";
import Styles from "./currentPlanBanerComponent.module.css";
import { FaSuperpowers } from "react-icons/fa";
import { decryptionLocalStorage } from "@/app/utils/decryptionLocalstorageINFO";

type AccountInfo = {
  userDetails: {
    plan_type: string;
    end_date: string;
  };
};

function CurrentPlanBanerComponent() {
  const [info, setInfo] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const decrypted = decryptionLocalStorage("AccountInfo");
      if (decrypted) {
        setInfo(JSON.parse(decrypted));
      }
    } catch (err) {
      console.error("Failed to parse AccountInfo:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className={Styles.baner}>Loading...</div>;
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

      {isExpired && info?.userDetails?.plan_type !== "7Days-free" && (
        <button type="button">Renew</button>
      )}
    </div>
  );
}

export default CurrentPlanBanerComponent;
