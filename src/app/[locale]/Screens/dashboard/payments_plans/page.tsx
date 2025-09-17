"use client";
import React, { useState , useEffect } from "react";
import Styles from "./payments_plans.module.css";
import Pricing_Card from "@/app/components/global/Pricing_Card/Pricing_Card";
import { useTranslations } from "next-intl";
import { useRouter , usePathname} from "next/navigation";
import CustomSwitch from "@/app/components/global/CustomSwitch/CustomSwitch";
import { usePaymentPlans } from "@/app/Hooks/usePaymentPlans";
import { useSearchParams } from "next/navigation";
import { useHandelPayStatus } from "@/app/Hooks/useTapPay";
import Popup from "@/app/components/global/Popup/Popup";
import { FiXOctagon } from "react-icons/fi";
import CurrentPlanBanerComponent from "@/app/components/global/CurrentPlanBanerComponent/CurrentPlanBanerComponent";
import { getAdminAccountInfo } from "@/app/utils/getAccountInfo"; 
import { AccountInfo } from "@/app/Types/AccountsType"; 
import { getFutureDate  } from "@/app/utils/date";
import { mapPlanToLimits } from "@/app/Hooks/usePlanMapper";
import Cookies from "js-cookie";
import encryption from "@/app/utils/encryption";


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
  const router = useRouter();
  const pathname = usePathname();

      React.useEffect(()=>{
            localStorage.setItem('clickedAsideTitle',"payments_plans");
            Cookies.set('clickedAsideTitle',"payments_plans",{expires:90});
      },[])
      
      const [info, setInfo] = useState<AccountInfo | null>(null);
      const [updatedInfo, setUpdatedInfo] = useState<AccountInfo | null>(null);
      const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
      const [showFailedPopup, setShowFailedPopup] = useState<boolean>(false);
      const [showYearly, setShowYearly] = useState(false);

    useEffect(() => {
     const Account = getAdminAccountInfo("AccountInfo");
     if (Account) {
       setInfo(Account);
        console.log("Account >>>>>> ",Account)
      }
    }, []);

    const endDate = info?.userDetails?.end_date
      ? new Date(info.userDetails.end_date).getTime()
      : null;
       
    const now = new Date().getTime();
    const isExpired = endDate ? endDate <= now : false;

  
    const searchParams = useSearchParams();
    const transaction_id = searchParams.get("tap_id");
    console.log("transaction_id >> ",transaction_id)
    const { mutate:Supscipe , data  } = useHandelPayStatus();
          
      useEffect(()=>{
        if (!transaction_id&&!info) return;
          const plane = localStorage?.getItem("planInfo");
          const planeInfo:PaymentPlan  = JSON.parse(plane??"{}");
          const limits = mapPlanToLimits(planeInfo);
        const operationType = localStorage?.getItem("operationType")||"upgrade";
        if (operationType == "upgrade" && transaction_id) {  
          console.warn("data >>>>>> ",data)
          console.warn("info >>>>>> ",info)
            Supscipe(
              {
                operationType:"upgrade",
                admin_id:info?.userDetails?.id||0,
                transaction_id:transaction_id||"",
                amount:planeInfo?.price,
                plan_id:planeInfo?.id||0,
                plan_type:planeInfo?.title,
                start_date:new Date().toISOString(),
                end_date:getFutureDate(Number(planeInfo.duration)).toISOString(),
    
                ...limits
            },
            {
              onSuccess:()=>{
                const updatedAccountInfo: AccountInfo = {
                  ...info!,
                  userDetails: {
                    ...info?.userDetails,
                    full_name: info?.userDetails.full_name ?? "",
                    id: info?.userDetails.id ?? 0,                 
                    phone: info?.userDetails.phone ?? "",
                    plan_id: planeInfo?.id || 0,
                    plan_type: planeInfo?.title || "",
                    start_date: new Date().toISOString(),
                    end_date: getFutureDate(Number(planeInfo.duration)).toISOString(),
                    admin_account_limits: {
                      max_branches: limits.max_branches ?? 0,
                      max_users: limits.max_users ?? 0,
                      max_custom_checklists: limits.max_custom_checklists ?? 0,
                      max_Corrective_action: limits.max_Corrective_action ?? 0,
                      free_onsite_inspections: limits.free_onsite_inspections ?? 0,
                      Arabic_language_support: limits.Arabic_language_support ?? 0,
                      Access_to_training_programs: limits.Access_to_training_programs ?? 0,
                      Daily_monitoring_sheets: limits.Daily_monitoring_sheets ?? 0,
                    }
                  }
                };
                const token = JSON.stringify(updatedAccountInfo);
                const key = process.env.NEXT_PUBLIC_HASH_KEY || ""
               const updatedInfo =  encryption.encryption(token,key)
              
               setUpdatedInfo(updatedAccountInfo);
                Cookies.set("AccountInfo", JSON.stringify(updatedInfo), { expires: 90 });
                localStorage.setItem("AccountInfo", JSON.stringify(updatedInfo));
                router.replace(pathname);
              }
            }
            
            
          ); 
        }
        if (operationType == "renew" && transaction_id) {  
            Supscipe({
                operationType:"renew",
                admin_id:info?.userDetails?.id||0,
                transaction_id:transaction_id||"",
                amount:planeInfo?.price,
                plan_id:planeInfo?.id||0,
                plan_type:planeInfo?.title,
                start_date:new Date().toISOString(),
                end_date:getFutureDate(Number(planeInfo.duration)).toISOString(),
            },
            {
              onSuccess:()=>{
                router.replace(pathname);
              }
            }
          ); 
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[transaction_id,info])
  
     
      useEffect(() => {
        if (!data?.status) return;
  
        if (data.status === "CAPTURED") {
          setShowFailedPopup(false);
          setShowSuccessPopup(true);
          console.warn("Payment captured successfully");
          // TODO: call subscribe API here
        } else if (data.status === "DECLINED" || data.status === "FAILED") {
          setShowSuccessPopup(false);
          setShowFailedPopup(true);
          console.warn("Payment failed");
        }
      }, [data?.status]);


  const { data: plans, isLoading,isError ,error } = usePaymentPlans();
      if (isLoading) return <p>...جاري التحميل</p>;
      if (isError) return <p>{error.message}</p>;

      console.warn("Plans >>> ",plans)

      // if (data?.status == "DECLINED") {
      // }


  


  // فلترة البلانز حسب حالة السويتش
  const filteredPlans = plans?.filter(
    (plan:PaymentPlan) => (showYearly ? plan.is_yearly === 1 : plan.is_yearly === 0)
  );

  const priceList: React.ReactNode[] = filteredPlans?.map(
    (val: PaymentPlan, index: number) => {
      let buttonTitle = "Subscripe";
  
      if (!isExpired) {
        // لو عنده خطة حالية
        if (info?.userDetails?.plan_id === val.id) {
          buttonTitle = "Renew";
        } else {
          buttonTitle = "Upgrade";
        }
      }

  
      return (
        <Pricing_Card
          key={index}
          id={val.id}
          isRecommended={index === 1}
          title={val.title}
          buttonTitle={buttonTitle}
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
      {showSuccessPopup&&<Popup title="Payment successful." subTitle="Thank you for your purchase 🎉" onClose={()=>setShowSuccessPopup(false)}/>}
      {showFailedPopup&&<Popup icon={<FiXOctagon color="rgba(238, 0, 0, 0.77)"/>} title="Payment failed." subTitle="Please check your card details or try again later." onClose={()=>setShowFailedPopup(false)}/>}


      <header>
        {/* <CurrentPlanBanerComponent info={getAdminAccountInfo("AccountInfo")}/> */}
        <CurrentPlanBanerComponent info={updatedInfo == null?info:updatedInfo}/>
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
