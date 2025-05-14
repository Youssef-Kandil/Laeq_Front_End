"use client";
import React from 'react'
import Styles from "./pricing.module.css"
import Pricing_Card from '@/app/components/global/Pricing_Card/Pricing_Card'
import {useTranslations} from 'next-intl';

import CustomSwitch from '@/app/components/global/CustomSwitch/CustomSwitch';




function Priceing() {

    const array = new Array(3).fill(0)
    const t = useTranslations('website.pricing_screen');


    const priceList = array.map((val,index)=>{
        return(
          <Pricing_Card 
            key={index}
            isRecommended={index == 1}
            title='Free' 
            subtitle='Ideal for individuals who who need advanced features and tools for client work.' 
            price='100'  
            duration='Month' 
            features={['Feature 1', 'Feature 2', 'Feature 8']} />
        )
    })


  return (
    <div className={Styles.parent}>
      <header>
        <h1>{t("title")}</h1>
        <h1 className={Styles.special_word}>{t("special_word")}</h1>
        <p>{t("subtitle")}</p>
      </header>

      <section id={Styles.swither_section}>
        <span>{t("pay_monthly")}</span>
        <CustomSwitch defaultChecked />
        <span>{t("pay_yearly")}</span>
      </section>

       <section id={Styles.pricing_section}>
          {priceList}
       </section>
    </div>
  )
}

export default Priceing
