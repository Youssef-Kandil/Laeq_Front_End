"use client";
import React from 'react'
import {useTranslations,useLocale} from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import Styles from "./home.module.css"

import sectors_list from '@/app/config/sectors_list';
import Gallary_Card from '@/app/components/website/Gallary_Card/Gallary_Card';
import app_identity from '@/app/config/identity';

// import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
// import WidgetsIcon from '@mui/icons-material/Widgets';
// import AssessmentIcon from '@mui/icons-material/Assessment';
// import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';

import {
  TaskAltOutlined,
  AutoStoriesOutlined,
  ThermostatOutlined,
  AssignmentOutlined,
  PeopleOutline,
  InsightsOutlined,
  FactCheckOutlined,
  NotificationsActiveOutlined,
  DashboardOutlined,
  Inventory2Outlined,
  BuildOutlined,
  SettingsOutlined,
  LockOutlined,
  LocalShippingOutlined,
} from '@mui/icons-material';

const featuresList = [
  { title: "Encrypted Data Storage", text: "Keep all records secure.", icon: <LockOutlined /> },
  { title: "Management Dashboard", text: "Centralize all compliance in one dashboard.", icon: <DashboardOutlined /> },
  { title: "Custom Forms", text: "Paperless forms for all your needs.", icon: <AssignmentOutlined /> },
  { title: "Scheduled Tasks", text: "Laeq365 reminds you of important tasks.", icon: <TaskAltOutlined /> },
  { title: "Temperature Monitoring", text: "Monitor equipment temperatures digitally.", icon: <ThermostatOutlined /> },
  { title: "Onboarding Wizard", text: "Easily set up Laeq365 for your business.", icon: <AutoStoriesOutlined /> },
  { title: "User Accountability", text: "Track who performed each action and when.", icon: <PeopleOutline /> },
  { title: "Business Insights", text: "Identify potential issues before they arise.", icon: <InsightsOutlined /> },
  { title: "Audit Reports", text: "Simplify your audits and inspections.", icon: <FactCheckOutlined /> },
  { title: "Escalations", text: "Automate food safety escalations.", icon: <NotificationsActiveOutlined /> },
  { title: "Resource Management", text: "Manage your resources efficiently.", icon: <Inventory2Outlined /> },
  { title: "Corrective Actions", text: "Assign corrective actions to incidents.", icon: <BuildOutlined /> },
  { title: "Equipment Management", text: "Digital asset register for maintenance.", icon: <SettingsOutlined /> },
  { title: "Inwards Goods Checklist", text: "Streamline your delivery process.", icon: <LocalShippingOutlined /> },
  { title: "Reminders", text: "Never miss an important task with automated reminders.", icon: <NotificationsActiveOutlined /> },
];



 function Home() {
    React.useEffect(()=>{
      localStorage.setItem('clickedTitle', "home");
    },[])
    const current_lang = useLocale();
      const t = useTranslations('website.home_screen');

      console.log("current_lang :: ", current_lang);

      // const [visibleCount, setVisibleCount] = React.useState(6); 
      const [showAll, setShowAll] = React.useState(false);
      const visibleCount = showAll ? featuresList.length : 4; // عدد الكاردات الظاهرة في الوضع الافتراضي
    
      const toggleShow = () => setShowAll(!showAll);// 6 كاردات أولية

      // const showMore = () => {
      //   setVisibleCount(featuresList.length);
      // };
      
      

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
              <Link href={`/${current_lang}/Screens/forms/signup`} shallow className={Styles.getStarted}>{t("header.get_started_btn")}</Link>
              <Link href={`/${current_lang}/Screens/forms/signup`} shallow className={Styles.free_trial}>{t("header.free_trial_btn")}</Link>
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
      {/* <section  id={Styles.FeaturesSection} className={Styles.Section}>
        <div className={Styles.SectionHeader}>
          <h3 className={Styles.h3}>{t("features.first_title")} <span>{t("features.special_word")}</span> {t("features.second_title")}</h3>
          <p>{t("features.subtitle")}</p>
        </div>

        <div className={Styles.boxs_container}>
        {featuresList.map((val, index) => (
          <div key={index} className={Styles.box}>
            <div className={Styles.icons}>
              <span className={Styles.span}><ChecklistRtlIcon style={{ fontSize: '24px' }} /></span>
              <ArrowOutwardIcon style={{ fontSize: '24px' }} />
            </div>
            <h3>{val.title}</h3>
            <p>{val.text}</p>
          </div>
        ))}
      </div>

      </section> */}
<section id={Styles.FeaturesSection} className={Styles.Section}>
  <div className={Styles.SectionHeader}>
    <h3 className={Styles.h3}>
      Features <span>Highlights</span>
    </h3>
    <p>Explore all the key digital solutions Laeq365 provides for your business.</p>
  </div>

  <div className={Styles.boxs_container}>
    {featuresList.slice(0, visibleCount).map((feature, index) => (
      <div
        key={index}
        className={`${Styles.box} ${Styles.fadeIn}`}
        style={{ animationDelay: `${index * 100 + 50}ms` }} 
      >
        <div className={Styles.icon_wrapper}>{feature.icon}</div>
        <h3>{feature.title}</h3>
        <p>{feature.text}</p>
      </div>
    ))}
  </div>


    <div className={Styles.readMoreWrapper}>
      <button onClick={toggleShow} className={Styles.readMoreBtn}>
        {showAll ? "Show Less" : "Read More"}
      </button>
    </div>

</section>
    {/* ====== END Features SECTION ======= */}


    {/* ====== START SECTORS SECTION ======= */}
        <section id={Styles.SectorsSection} className={Styles.Section}>
          <div>
            <h4>{t("sectors.title")}</h4>
            <h2>{t("sectors.subtitle")}</h2>
            <p>{t("sectors.text")}</p>
            <Link href={`/${current_lang}/Screens/forms/signup`} shallow>{t("sectors.btn")}</Link>
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
            <Link href={`/${current_lang}/Screens/forms/signup`} shallow className={Styles.getStartedBtn}>{t("experience.get_started_btn")}</Link>
            <Link href={`/${current_lang}/Screens/forms/signup`} shallow className={Styles.freeTrielBtn}>{t("experience.free_trial")}</Link>
          </div>
        </div>

      </section>
      {/* ====== END Experience SECTION ======= */}




    </div>
  )
}

export default Home
