"use client";
import React from 'react'
import {useTranslations,useLocale} from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import Styles from "./home.module.css"

import sectors_list from '@/app/config/sectors_list';
import Gallary_Card from '@/app/components/website/Gallary_Card/Gallary_Card';
import app_identity from '@/app/config/identity';

import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
// import WidgetsIcon from '@mui/icons-material/Widgets';
// import AssessmentIcon from '@mui/icons-material/Assessment';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';




 function Home() {
    React.useEffect(()=>{
      localStorage.setItem('clickedTitle', "home");
    },[])
    const current_lang = useLocale();
      const t = useTranslations('website.home_screen');

      console.log("current_lang :: ", current_lang);


      

  // START FUNCTIONS ===
  const Solutions =  sectors_list.map((solution,index)=>{
    return(
      <Gallary_Card title={solution.title} media_url={solution.img_url} key={index}/>
    );
  })


  return (
    <div className={Styles.parent}>
  {/* ====== START HEADER SECTION ======= */}
      <header style={{fontFamily:app_identity.secondary_font}}>
        <h2>
            {t("header.first_title")}
            <span>{t("header.special_word")}</span>
            {t("header.second_title")}
        </h2>
        <div className={Styles.header_btns}>
              <Link href={"#"} shallow className={Styles.getStarted}>{t("header.get_started_btn")}</Link>
              <Link href={""} shallow className={Styles.free_trial}>{t("header.free_trial_btn")}</Link>
        </div>
        <div className={Styles.mediaSection}>
          <Image src={"/images/left_Ellipses.webp"} alt='left' width={400} height={400} />
          <div className={Styles.mediaContainer}>
            <Image src={"/images/hearo.png"} alt='pic' width={1800} height={700} loading='lazy' />

          </div>
          <Image className={Styles.rightImg} src={"/images/right_Ellipses.webp"} alt='right' width={750} height={400} loading='lazy' />

        </div>
      </header>
  {/* ====== END HEADER SECTION ======= */}



    {/* ====== START PARTNERS SECTION ======= */}
      <section id={Styles.PartnersSection} className={Styles.Section}>
        <h3>{t("partners")}</h3>
      </section>
    {/* ====== START PARTNERS SECTION ======= */}



    {/* ====== START Features SECTION ======= */}
      <section  id={Styles.FeaturesSection} className={Styles.Section}>
        <div className={Styles.SectionHeader}>
          <h3 className={Styles.h3}>{t("features.first_title")} <span>{t("features.special_word")}</span> {t("features.second_title")}</h3>
          <p>{t("features.subtitle")}</p>
        </div>

        <div className={Styles.boxs_container}>
          {[
            {title:"Scheduled Tasks",text:"You've got enough to worry about. Let Laeq365 worry about reminding you of important tasks."},
            {title:"Onboarding Wizard",text:"Onboarding Wizard Setting up Laeq365 with your unique requirements couldn't be simpler."},
            
            {title:"Temperature Monitoring",text:"Never lose track of equipment temperatures again with temperature monitoring digital solution."},
            {title:"Custom Forms",text:"Say goodbye to your printer—custom paperless forms eliminate the need for it."},
            {title:"User Accountability",text:"Track precisely who performed each action and when with User Accountability."},
            
            {title:"Business Insights Reporting",text:"Stay informed about your business operations and identify potential issues before they arise."},
            {title:"Audit/Inspection Reports",text:"Simplify your food safety audits and inspections with Laeq365"},
            {title:"Escalations",text:"It's time to automate food safety, and escalations can assist."},
            
            {title:"Management Dashboard",text:"Centralize all your food safety compliance in one convenient dashboard auditors and inspectors will appreciate it!"},
            {title:"Resource Management",text:"Leave the paperwork behind"},
            {title:"Corrective Actions",text:"Safeguard your business by assigning corrective actions to incidents and observations."},
            
            {title:"Equipment Management",text:"Simplify equipment maintenance with Laeq365’s digital asset register."},
            {title:"Encrypted Data Storage",text:"Ensure your food safety records are secure, now and always."},
            {title:"Inwards Goods Checklist",text:"Streamline your delivery process with ease"},
            {title:"Reminders",text:"With Laeq365 reminders, you'll never overlook an important food safety task."},
          ].map((val,index)=>{
            return <div key={index} className={Styles.box}>
                    <div className={Styles.icons}>
                      <span className={Styles.span}>
                        <ChecklistRtlIcon style={{fontSize:"40px"}}/>
                      </span>
                        <ArrowOutwardIcon style={{fontSize:"40px"}}/>
                    </div>
                    <h3>{val.title}</h3>
                    <p>{val.text}</p>
              </div>
          })}
        </div>

      </section>
    {/* ====== END Features SECTION ======= */}


    {/* ====== START SECTORS SECTION ======= */}
        <section id={Styles.SectorsSection} className={Styles.Section}>
          <div>
            <h4>{t("sectors.title")}</h4>
            <h2>{t("sectors.subtitle")}</h2>
            <p>{t("sectors.text")}</p>
            <Link href={""} shallow>{t("sectors.btn")}</Link>
          </div>
          <Image src={"/images/sector.webp"} alt='' width={600} height={300}/>

        </section>
    {/* ====== END SECTORS SECTION ======= */}



    {/* ====== START SOLUTIONS SECTION ======= */}
      <section id={Styles.SolutionsSection} className={Styles.Section}>
        <div className={Styles.SectionHeader}>
          <h3 className={Styles.h3}>{t("soluions.first_title")} <span>{t("soluions.special_word")}</span></h3>
          <p>{t("soluions.subtitle")}</p>
        </div>
        <div className={Styles.cards_container}>
         {Solutions}
        </div>
      </section>
      {/* ====== END SOLUTIONS SECTION ======= */}


      {/* ====== START Assets SECTION ======= */}
      <section id={Styles.AssetsSection} className={Styles.Section}>
          <Image src={"/images/assets.webp"} alt='' width={700} height={300}/>
          <div>
            <h4>{t("assets.title")}</h4>
            <h2>{t("assets.subtitle")}</h2>
            <p>{t("assets.text")}</p>
          </div>

        </section>
      {/* ====== END Assets SECTION ======= */}


      {/* ====== START Action SECTION ======= */}
      <section id={Styles.ActionSection} className={Styles.Section}>
        <div className={Styles.SectionHeader}>
          <h3 className={Styles.h3}>{t("actions.first_title")} <span>{t("actions.special_word")}</span> {t("actions.second_title")}</h3>
          <p>{t("actions.subtitle")}</p>
        </div>
      </section>

      {/* ====== END Action SECTION ======= */}


      {/* ====== START Experience SECTION ======= */}
      <section id={Styles.ExperienceSection} className={Styles.Section}>
        <div className={Styles.ExperienceSection_blackScreen}/>
        <div className={Styles.img_container}>
          <Image src={"/images/Experiance.png"} alt='' width={500} height={500}/>
        </div>

        <div className={Styles.text_container}>
          <h3>{t("experience.title")}</h3>
          <p>{t("experience.text")}</p>
          <div  className={Styles.btns_container}>
            <Link href={""} shallow className={Styles.getStartedBtn}>{t("experience.get_started_btn")}</Link>
            <Link href={""} shallow className={Styles.freeTrielBtn}>{t("experience.free_trial")}</Link>
          </div>
        </div>

      </section>
      {/* ====== END Experience SECTION ======= */}




    </div>
  )
}

export default Home
