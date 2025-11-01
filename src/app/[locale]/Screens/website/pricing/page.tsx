"use client";
import React, { useState  } from "react";
import Styles from "./pricing.module.css";
import Pricing_Card from "@/app/components/global/Pricing_Card/Pricing_Card";
import { useTranslations } from "next-intl";
import CustomSwitch from "@/app/components/global/CustomSwitch/CustomSwitch";
import { usePaymentPlans } from "@/app/Hooks/usePaymentPlans";
import { useRouter } from "next/navigation"; 
import { useLocale } from "next-intl";

// import Popup from "@/app/components/global/Popup/Popup";
// import { FiXOctagon } from "react-icons/fi";
// import CurrentPlanBanerComponent from "@/app/components/global/CurrentPlanBanerComponent/CurrentPlanBanerComponent";





function Priceing() {
  const router = useRouter();
  const local = useLocale();
    React.useEffect(()=>{
      localStorage.setItem('clickedTitle', "pricing");
    },[])
  const t = useTranslations("website.pricing_screen");
  const { data: plans, isLoading } = usePaymentPlans();




  const [showYearly, setShowYearly] = useState(false);

  if (isLoading) return <p>...جاري التحميل</p>;
  console.warn(plans[0])

  interface PaymentPlan {
    id:number;
    title: string;
    price: number;
    is_yearly: number; // 1 = yearly, 0 = monthly
    plan_features: { feature_name: string; feature_value: string ,type:string}[],
  }

  const allPlans = plans as PaymentPlan[];

  // نحسب التوفير لكل باقة
  const savings = allPlans
    .filter((p) => p.is_yearly === 1) // الباقات السنوية فقط
    .map((yearlyPlan) => {
      const monthlyPlan = allPlans.find(
        (p) => p.title === yearlyPlan.title && p.is_yearly === 0
      );
      if (monthlyPlan) {
        const saved = monthlyPlan.price * 12 - yearlyPlan.price;
        return {
          title: yearlyPlan.title,
          saved: saved,
        };
      }
      return null;
    })
    .filter(Boolean);

  // فلترة البلانز حسب حالة السويتش
  const filteredPlans = (plans as PaymentPlan[]).filter(
    (plan) => (showYearly ? plan.is_yearly === 1 : plan.is_yearly === 0)
  );
  const priceList: React.ReactNode[] = filteredPlans.map(
    (val: PaymentPlan, index: number) => {
      const savingInfo = savings.find((s) => s?.title === val.title);
      const savedAmount = savingInfo?.saved ?? 0;

      return (
        <Pricing_Card
          id={val.id}
          key={index}
          isRecommended={index === 1}
          buttonFun={() => router.push(`/${local}/Screens/forms/signup`)}
          title={val.title}
          buttonTitle={"Create Account"}
          subtitle={
            index == 0
              ? "Perfect for small teams starting out who need smart tools to manage daily operations easily."
              : index == 1
              ? "Designed for growing teams who need more control, flexibility, and advanced management tools"
              : "Built for large organizations that require powerful tools, scalability, and dedicated support."
          }
          price={String(val.price)}
          duration={val.is_yearly === 1 ? "Year" : "Month"}
          features={
            val.plan_features?.map((f, idx) => ({
              feature_id: idx,
              feature_name: f.feature_name,
              feature_value: f.feature_value,
              type: f.type,
            })) ?? []
          }
          // ✅ تقدر تبعت التوفير للكارت لو عايز تعرضه
          saving={val.is_yearly === 1 ? savedAmount : undefined}
        />
      );
    }
  );

  // const priceList: React.ReactNode[] = filteredPlans.map(
  //   (val: PaymentPlan, index: number) => (
      
  //     <Pricing_Card
  //       id={val.id}
  //       key={index}
  //       isRecommended={index === 1}
  //       buttonFun={()=>router.push(`/${local}/Screens/forms/signup`)}
  //       title={val.title}
  //       buttonTitle={"Create Account"}
  //       subtitle={index == 0?"Perfect for small teams starting out who need smart tools to manage daily operations easily.":index == 1?"Designed for growing teams who need more control, flexibility, and advanced management tools":"Built for large organizations that require powerful tools, scalability, and dedicated support."}
  //       price={String(val.price)}
  //       duration={val.is_yearly === 1 ? "Year" : "Month"}
  //       features={val.plan_features?.map((f, idx) => ({
  //         feature_id: idx, // or use f.feature_id if available
  //         feature_name: f.feature_name,
  //         feature_value: f.feature_value,
  //         type: f.type // replace with actual type if available
  //       })) ?? []}
  //       saving={val.is_yearly === 1 ? savedAmount : undefined}
  //     />
  //   )
  // );

  return (
    <div className={Styles.parent}>
      <header>
        <h1>{t("title")}</h1>
        <h1 className={Styles.special_word}>{t("special_word")}</h1>
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

       <section id={Styles.pricing_section}>
          {priceList}
       </section>
    </div>
  )
}

export default Priceing
