"use client";
import React from 'react'
import businessCards from '@/app/config/about_us_upscale_your_business_cards_list';
import ourTeam from '@/app/config/our_team';
import Styles from "./about_us.module.css"
import {useTranslations,useLocale} from 'next-intl';
import Image from 'next/image'
import Link from 'next/link'


function About_us() {
  React.useEffect(()=>{
    localStorage.setItem('clickedTitle', "about_us");
  },[])
    const current_lang = useLocale();
      const t = useTranslations('website.about_us_screen');

      console.log("current_lang :: ", current_lang);
  return (
    <div className={Styles.parent} lang={current_lang}>
      <header>
          <div className={Styles.container}>
            <div className={Styles.header_text}>
              <h1>{t("header.title")}</h1>
              <p>A Saudi team specializing in quality, food safety, and public health, we work to raise safety standards and ensure food establishments adhere to the highest levels of quality. We have experience in inspection, training, and consulting, and we strive to protect community health by implementing global best practices in line with the Kingdom s Vision 2030 to enhance quality of life.</p>
            </div>
            <div className={Styles.header_btns}>
              <Link href={""} className={Styles.getStartedBtn} shallow>{t("header.get_started_btn")}</Link>
              <Link href={""} className={Styles.startFreeTrialBtn} shallow>{t("header.free_trial_btn")}</Link>
            </div>
          </div>

          <div className={Styles.header_image}>
            <Image src={""} alt='' loading='lazy' width={100} height={100}/>
          </div>
      </header>

      <section id={Styles.business_section}>
        <div className={Styles.business_section_text}>
          <p>{t("busniess_section.suptitle")}</p>
          <h2>{t("busniess_section.title")}</h2>
        </div>

        <div className={Styles.business_section_cards}>
          {businessCards.map((card, index) => {
            return (
              <div key={index} className={Styles.business_section_card}>
              <span>{card.icon}</span>
              <h3>{String(card.Analytics)}</h3>
              <p>{t(`busniess_section.cards.${card.title}`)}</p>
            </div>
            )
          })} 
        </div>
      </section>

      <section id={Styles.team_section}>
          <h3><span>{t("team_section.special_word")}</span> {t("team_section.title")}</h3>
          {/* == STRAT CARD LIST */}
          <div className={Styles.team_section_cards}>
            {/* == STRAT CARD */}
            {ourTeam.map((card, index) => {
              return (
                <div key={index} style={(index+1)%2 == 0 ?{marginBottom:100}:{}} className={Styles.team_section_card}>       
                    <div className={Styles.card_image}>
                      <Image src={card.image} alt=''  loading='lazy' width={300} height={100}/>
                    </div>
                    <div className={Styles.card_text}>
                      <h3>{card.name}</h3>
                      <p>{card.position}</p>
                    </div>
                </div>
              )
            })} 
            {/* == END CARD */}
            {/* === END CARD  */}
          </div>
          {/* === END CARD LIST */}

      </section>

      <section id={Styles.trust_brands_section}>
            <h2>{t("brands_section.first_title")}<span>{t("brands_section.special_word")}</span>{t("brands_section.second_title")}</h2>
          <div>
            <Image src={""} alt='' loading='lazy' width={100} height={100}/>
          </div>

      </section>
    </div>
  )
}

export default About_us
