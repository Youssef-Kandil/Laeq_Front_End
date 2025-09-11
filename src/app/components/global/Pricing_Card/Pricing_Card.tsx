import React from 'react';
import Styles from './pricing_card.module.css'
import app_identity from '@/app/config/identity';
import { MdDone , MdClose } from "react-icons/md";

import { useTapCheckout  } from '@/app/Hooks/useTapPay';
import { getAdminAccountInfo } from "@/app/utils/getAccountInfo"; 
import { AccountInfo } from "@/app/Types/AccountsType"; 

interface Feature {
  feature_id: number;
  feature_name: string;
  feature_value: string;
  type: string; // "feature" أو أي حاجة تانية
}
interface FeatureData {
  value: string;
  type: string;
}

interface PricingCardProps {
  id:number;
  title: string;
  subtitle: string;
  buttonTitle?:string;
  duration: string;
  price: string;
  features: Feature[];
  isRecommended?: boolean;
}

const arrayOfFeatures = [
  "Arabic language support",
  "Corrective action features",
  "Branches included",
  "Users included",
  "Custom checklist fee",
  "Free onsite inspections",
  "Access to training programs",
  "Daily monitoring sheets",
];


function Pricing_Card({id,title,subtitle,buttonTitle,price,duration,features,isRecommended }:PricingCardProps) {
      const [info, setInfo] = React.useState<AccountInfo | null>(null);
      React.useEffect(() => {
        const Account = getAdminAccountInfo("AccountInfo");
        if (Account) {
          setInfo(Account);
        }
      }, []);


  const {mutate} = useTapCheckout();
  function pay(){
  // === SET PLAN INFO
    localStorage?.setItem("planInfo",JSON.stringify({
        id,
       title,
       price,
       duration:duration == 'Month' ? 30:365,
       plan_features:features
   }));  
   // === SET PAY TYPE 
    if (buttonTitle == "renew") {
      localStorage?.setItem("operationType","renew")
    }else{
      localStorage?.setItem("operationType","upgrade")
    }
    // === PAY ====
    mutate(
      {
          amount:Number(price),
          currency:"SAR",
          customer:{
            first_name:info?.userDetails?.full_name||"unKnwon",
            last_name:"",
            email:info?.email || "unKnwon",
          },
          source: { id: "src_all" },
          redirect:{
            url:"http://localhost:3000/en/Screens/dashboard/payments_plans"
          },
          description:"safwef",
          charges:[
            {
              description:"Payment for subscription",
              amount:Number(price),
              
            }
          ]
      },
      {onSuccess:(data)=>{
          console.warn(data.transaction.url)
      }}
    )
  }
  

  // نحول features ل map علشان نوصل للفاليو و التايب
    const featureMap: Record<string, FeatureData> = {};
    features.forEach((f) => {
      featureMap[f.feature_name] = { value: f.feature_value, type: f.type };
    });

  return (
    <div className={Styles.card} style={isRecommended ? {background:app_identity.primary_color} : {color:'#000'}}>
      <div className={Styles.title}>
        <h2>{title}</h2>
        <p style={isRecommended ? {color:"#F7F8F9"} : {}}>{subtitle}</p>
      </div>

      <div className={Styles.price}>
        <h1><span>SAR</span> {price}</h1>
        <p style={isRecommended ? {color:"#F7F8F9"} : {}}> / {duration}</p>
      </div>

      <button onClick={pay} style={isRecommended ? {background:"#fff",color:app_identity.primary_color,border:'none'} : {}}>
       {buttonTitle?buttonTitle:"Get Started Now"} 
      </button>

      <div className={Styles.features}>
        {arrayOfFeatures.map((feature, index) => {
          const featureData = featureMap[feature];
          const isAvailable = featureData !== undefined;

          return (
            <p key={index} className={Styles.featureItem} style={!isAvailable ? { opacity: 0.5 } : {}}>
              <span className={Styles.icon} style={isRecommended ? {background:"#fff",color:app_identity.primary_color} : {}} >
                {isAvailable ? <MdDone /> : <MdClose />}
              </span>
              <span>
                {feature}
                {isAvailable && featureData.type !== "feature" ? ` / ${featureData.value}` : ""}
              </span>
            </p>
          );
        })}
      </div>
    </div>
  )
}

export default Pricing_Card
