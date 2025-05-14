"use client";
import React  from 'react'
import Image from 'next/image';
import Styles from "./nave.module.css"
import {useTranslations,useLocale} from 'next-intl';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { usePathname  } from 'next/navigation';
import { useRouter } from 'next/navigation';



function Nave() {

    const current_lang = useLocale();
    const t = useTranslations('aside_component');
    const router = useRouter();

    const pathname = usePathname();

    const [nave_Title,setNave_Title]  = React.useState("")
    React.useEffect(()=>{  
      function handleRouteChange(){
        console.log("path", pathname)
        const segments = String(pathname).split('/').filter(Boolean); 
        const dashboardIndex =  segments.indexOf('dashboard');
        setNave_Title(dashboardIndex !== -1 ? segments[dashboardIndex + 1] : "")
        console.log("nave_Title",nave_Title)
      }
      handleRouteChange()

  }, [nave_Title, pathname, router])





  return (
    <div className={Styles.parent} lang={current_lang}>
      <h2>{t(nave_Title === "summeries" ? "dashboard" : nave_Title || "dashboard")}</h2>
       <div>
          <NotificationsOutlinedIcon/>
          <Image src={""} alt='' loading="lazy" width={50} height={50} />
       </div>
    </div>
  )
}

export default Nave
