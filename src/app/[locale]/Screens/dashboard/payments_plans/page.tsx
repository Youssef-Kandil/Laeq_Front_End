"use client";
import React, { useState , useEffect } from "react";
import Styles from "./payments_plans.module.css";
import Pricing_Card from "@/app/components/global/Pricing_Card/Pricing_Card";
import { useTranslations } from "next-intl";
import CustomSwitch from "@/app/components/global/CustomSwitch/CustomSwitch";
import { usePaymentPlans } from "@/app/Hooks/usePaymentPlans";
import { useSearchParams } from "next/navigation";
import { useCheckPayStatus } from "@/app/Hooks/useTapPay";
import Popup from "@/app/components/global/Popup/Popup";
import { FiXOctagon } from "react-icons/fi";
import CurrentPlanBanerComponent from "@/app/components/global/CurrentPlanBanerComponent/CurrentPlanBanerComponent";
import { decryptionLocalStorage } from '@/app/utils/decryptionLocalstorageINFO';



function Payments_plans() {
    const [info, setInfo] = useState<{ userDetails: { plan_type: string; end_date: string } } | null>(null);
    useEffect(() => {
     const Account = decryptionLocalStorage("AccountInfo");
      if (Account) {
        setInfo(JSON.parse(Account));
      }
    }, []);
  
    const endDate = info?.userDetails?.end_date
      ? new Date(info.userDetails.end_date).getTime()
      : null;
      
  
    const now = new Date().getTime();
    const isExpired = endDate ? endDate <= now : false;
    console.warn("endDate : ",endDate);
    console.warn("now : ",now);
    console.warn("isExpired : ",isExpired);
  const t = useTranslations("website.pricing_screen");
  const { data: plans, isLoading } = usePaymentPlans();

  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
  const [showFailedPopup, setShowFailedPopup] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const transaction_id = searchParams.get("tap_id");
  const { data } = useCheckPayStatus(transaction_id || "");

    useEffect(() => {
      if (!data?.status) return;

      if (data.status === "CAPTURED") {
        setShowFailedPopup(false);
        setShowSuccessPopup(true);
        console.warn("Payment captured successfully");
        // TODO: call subscribe API here
        if (isExpired) {

        }
      } else if (data.status === "DECLINED" || data.status === "FAILED") {
        setShowSuccessPopup(false);
        setShowFailedPopup(true);
        console.warn("Payment failed");
      }
    }, [data?.status]);
      // if (data?.status == "DECLINED") {
      // }

  const [showYearly, setShowYearly] = useState(false);

  if (isLoading) return <p>...جاري التحميل</p>;
  console.warn(plans[0])

  interface PaymentPlan {
    title: string;
    price: number;
    is_yearly: number; // 1 = yearly, 0 = monthly
    plan_features: { feature_name: string; feature_value: string ,type:string}[],
  }

  // فلترة البلانز حسب حالة السويتش
  const filteredPlans = (plans as PaymentPlan[]).filter(
    (plan) => (showYearly ? plan.is_yearly === 1 : plan.is_yearly === 0)
  );

  const priceList: React.ReactNode[] = filteredPlans.map(
    (val: PaymentPlan, index: number) => (
      <Pricing_Card
        key={index}
        isRecommended={index === 1}
        title={val.title}
        buttonTitle={isExpired?"Subscripe":"Upgrade"}
        subtitle="Ideal for individuals who need advanced features and tools for client work."
        price={String(val.price)}
        duration={val.is_yearly === 1 ? "Year" : "Month"}
        features={val.plan_features?.map((f, idx) => ({
          feature_id: idx, // or use f.feature_id if available
          feature_name: f.feature_name,
          feature_value: f.feature_value,
          type: f.type // replace with actual type if available
        })) ?? []}
      />
    )
  );

  return (
    <div className={Styles.parent}>
      {showSuccessPopup&&<Popup title="Payment successful." subTitle="Thank you for your purchase 🎉" onClose={()=>setShowSuccessPopup(false)}/>}
      {showFailedPopup&&<Popup icon={<FiXOctagon color="rgba(238, 0, 0, 0.77)"/>} title="Payment failed." subTitle="Please check your card details or try again later." onClose={()=>setShowFailedPopup(false)}/>}


      <header>
        <CurrentPlanBanerComponent/>
        <p>{t("subtitle")}</p>
      </header>

      <section id={Styles.swither_section}>
        <span>{t("pay_monthly")}</span>
        <CustomSwitch
          checked={showYearly}
          onCheckedChange={(val: boolean) => setShowYearly(val)}
        />
        <span>{t("pay_yearly")}</span>
      </section>

      <section id={Styles.pricing_section}>{priceList}</section>
    </div>
  );
}

export default Payments_plans;
