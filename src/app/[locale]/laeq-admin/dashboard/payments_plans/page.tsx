"use client";
import React, { useState  } from "react";
import Styles from "./payments_plans.module.css";
import Pricing_Card_Form from "@/app/components/global/Price_Card_Form/Price_Card_Form";
import { useTranslations } from "next-intl";
// import { useRouter } from "next/navigation";
import CustomSwitch from "@/app/components/global/CustomSwitch/CustomSwitch";
import { usePaymentPlans } from "@/app/Hooks/usePaymentPlans";



import Cookies from "js-cookie";



interface PaymentPlan {
    id:number;
    title: string;
    price: number;
    duration:string;
    is_yearly: number; // 1 = yearly, 0 = monthly
    plan_features: { feature_name: string; feature_value: string ,type:string}[],
}



function Payments_plans() {
  const t = useTranslations("website.pricing_screen");
//   const router = useRouter();


      React.useEffect(()=>{
            localStorage.setItem('clickedAsideTitle',"payments_plans");
            Cookies.set('clickedAsideTitle',"payments_plans",{expires:90});
      },[])
      
      const [showYearly, setShowYearly] = useState(false);




  



  const { data: plans, isLoading,isError ,error } = usePaymentPlans();
      if (isLoading) return <p>...جاري التحميل</p>;
      if (isError) return <p>{error.message}</p>;

      console.warn("Plans >>> ",plans)

  // فلترة البلانز حسب حالة السويتش
  const filteredPlans = plans?.filter(
    (plan:PaymentPlan) => (showYearly ? plan.is_yearly === 1 : plan.is_yearly === 0)
  );

  const priceList: React.ReactNode[] = filteredPlans?.map(
    (val: PaymentPlan, index: number) => {
      return (
        <Pricing_Card_Form
          key={index}
          id={val.id}
          isRecommended={index === 1}
          title={val.title}
          subtitle="Ideal for individuals who need advanced features and tools for client work."
          price={String(val.price)}
          duration={val.is_yearly === 1 ? "Year" : "Month"}
          features={val.plan_features?.map((f, idx) => ({
            feature_id: idx,
            feature_name: f.feature_name,
            feature_value: f.feature_value,
            type: f.type
          })) ?? []}
        />
      );
    }
  );
  
  return (
    <div className={Styles.parent}>
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
