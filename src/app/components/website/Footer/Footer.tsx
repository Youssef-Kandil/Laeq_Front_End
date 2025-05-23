"use client";
import React  from 'react'
import Styles from "./footer.module.css"
// import { usePathname, useRouter } from "next/navigation"; 
// import {useTranslations,useLocale} from 'next-intl';
import {useTranslations} from 'next-intl';
import nave_titles from '@/app/config/nave_titles';
import app_identity from '@/app/config/identity';
// import Link from 'next/link'
import Image from 'next/image'


import MailIcon from '@mui/icons-material/Mail';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';



function Footer() {
    // const current_lang = useLocale();
    // const pathname = usePathname();
    // const router = useRouter();
    const t_footer = useTranslations('footer_component');
    const t_nave = useTranslations('nave_bar_component');


    const titles = nave_titles.map((el,index)=>{
        return(
            <div key={index}>
                <p>
                    {t_nave(el.title)}
                </p>
            </div>
        )
    })
  return (
    <div className={Styles.parent} style={{fontFamily:app_identity.primary_font}}>
    {/* ===== START  Social ===== */}
      <section className={Styles.section} id='1'>
        <Image src={"/images/logo.webp"} alt='logo' width={200} height={200}/>
        <div>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>

      </section>
    {/* ===== END Social ===== */}

    {/* ===== START Company ===== */}
      <section className={Styles.section} id='2'>
        <h3>{t_footer("company")}</h3>
         {titles}
      </section>
    {/* ===== END Company ===== */}

    {/* ===== START Legal ===== */}
      <section className={Styles.section} id='3'>   
        <h3>{t_footer("legal.title")}</h3>
        <div>
            <p>
                {t_footer("legal.privacy_policy")}
            </p>
        </div>
        <div>
            <p>
                {t_footer("legal.terms_services")}
            </p>
        </div>
        <div>
            <p>
                {t_footer("legal.terms_of_use")}
            </p>
        </div>
      </section>
    {/* ===== END Legal ===== */}

     {/* ===== START Reach us ===== */}
      <section className={Styles.section} id='4'>
        <h3>{t_footer("reach_us")}</h3>
        <div>
            <LocalPhoneIcon className={Styles.icon}/>
            <p>+1012 3456 789</p>
        </div>
        <div>
            <MailIcon className={Styles.icon}/>
            <p>demo@gmail.com</p>
        </div>
        <div>
            <LocationOnIcon className={Styles.icon}/>
            <p>132 Dartmouth Street Boston, Massachusetts 02156 United States</p>
        </div>

      </section>
      {/* ===== END Reach us ===== */}
    </div>
  )
}

export default Footer
