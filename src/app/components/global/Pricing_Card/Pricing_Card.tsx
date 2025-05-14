import React from 'react'
import Styles from './pricing_card.module.css'
import app_identity from '@/app/config/identity';
import { MdDone , MdClose } from "react-icons/md";

interface PricingCardProps {
  title: string;
  subtitle: string;
  duration: string;
  price: string;
  features: string[];
  isRecommended?: boolean;
}

const arrayOfFeatures = ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5", "Feature 6", "Feature 7", "Feature 8"];
// Define the component

function Pricing_Card({title,subtitle,price,duration,features,isRecommended }:PricingCardProps) {
  return (
    <div className={Styles.card} style={isRecommended?{background:app_identity.primary_color}:{color:'#000'}}>
      <div className={Styles.title}>
        <h2>{title}</h2>
        <p style={isRecommended?{color:"#F7F8F9"}:{}}>{subtitle}</p>
      </div>

      <div className={Styles.price}>

        <h1>SAR {price}</h1>
        <p style={isRecommended?{color:"#F7F8F9"}:{}}> / {duration}</p>
      </div>

      <button style={isRecommended?{background:"#fff",color:app_identity.primary_color,border:'none'}:{}}>Get Started Now</button>
      <div className={Styles.features}>
      {arrayOfFeatures.map((feature, index) => {
          const isAvailable = features.includes(feature);
          return (
            <p key={index} className={Styles.featureItem} style={!isAvailable ? { opacity: 0.5 } : {}}>
              <span className={Styles.icon} style={isRecommended?{background:"#fff",color:app_identity.primary_color}:{}} >
                {isAvailable ? <MdDone /> : <MdClose />}
              </span>
              <span>{feature}</span>
            </p>
          );
        })}
      </div>
    </div>
  )
}

export default Pricing_Card
