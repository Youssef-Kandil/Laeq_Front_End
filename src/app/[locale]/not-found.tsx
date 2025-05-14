import React from 'react'
import {useTranslations,useLocale} from 'next-intl';
import app_identity from '../config/identity';
import Image from 'next/image'


function NotFound() {
      const current_lang = useLocale();
        const t = useTranslations('not_found_screen');
        console.log("home lang : ",current_lang);
  return (
    <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',textAlign:'center',marginTop:'50px',fontFamily:app_identity.secondary_font}}>
      <Image src={"/images/404.webp"} width={350} height={400} alt='not found 404' loading='lazy'/>
        <h2 style={{marginTop:'20px',marginBottom:'20px',fontWeight:"500",fontSize:'71.53px'}}>{t("title")}</h2>
        <p style={{marginTop:'20px',marginBottom:'20px',fontWeight:"400",fontSize:'28px',color:"#00000099"}}>{t("text")}</p>
  
    </div>
  )
}

export default NotFound


