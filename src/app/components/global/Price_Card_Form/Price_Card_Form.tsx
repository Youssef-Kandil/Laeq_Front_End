import React from 'react';
import Styles from './price_card_form.module.css'
import app_identity from '@/app/config/identity';
import { MdDone , MdClose } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';


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
  buttonFun?:()=>void;
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


function Pricing_Card_Form({id,title,subtitle,price,duration,features,isRecommended }:PricingCardProps) {
    const router = useRouter();
    const lang = useLocale();

  function edit(){
    if(id) {
        router.push(`/${lang}/laeq-admin/dashboard/payments_plans/EditePlanForm/${id}`);
    }
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

      <button onClick={edit} style={isRecommended ? {background:"#fff",color:app_identity.primary_color,border:'none'} : {}}>
       Edit Plan
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

export default Pricing_Card_Form
