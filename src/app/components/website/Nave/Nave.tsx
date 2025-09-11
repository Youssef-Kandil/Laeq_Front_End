"use client";
import React ,{useState} from 'react'
import { usePathname, useRouter } from "next/navigation"; 
import nave_titles from '@/app/config/nave_titles'
import app_identity from '@/app/config/identity';
import Styles from "./nave.module.css"
import Image from 'next/image';
import Link from 'next/link';
import {useTranslations,useLocale} from 'next-intl';

import { Select,MenuItem ,SelectChangeEvent ,FormControl} from '@mui/material';




function Nave() {
    const current_lang = useLocale();
      const pathname = usePathname();
      const router = useRouter();
    const t = useTranslations('nave_bar_component');

    // ==== handel Clecked text ====
    const [clickedTitle, setClickedTitle] = React.useState<string>(t(nave_titles[0].title));//+
    // const [ isChildMenuTitleShowed , setIsChildMenuTitleShowed] = React.useState(false)
    React.useEffect(() => {
    const savedTitle = localStorage.getItem('clickedTitle');
    if (savedTitle) {
        setClickedTitle(savedTitle);
    }
    }, []);
    interface TitleElement {
        title: string;
    }

    const handleTitleClick = (el: TitleElement): void => {
        setClickedTitle(el.title);
        localStorage.setItem('clickedTitle', el.title);
        // if (el?.children) {
        //   setIsChildMenuTitleShowed(!isChildMenuTitleShowed)
        // }else{
        //   setIsChildMenuTitleShowed(false)
        // }
    };
    // === Render Titles ===
    const titles = nave_titles.map((el,index)=>{
        return(
            <Link href={`/${current_lang}/Screens/website${el.href}`}  onClick={() => handleTitleClick(el)}  shallow  key={index} style={clickedTitle == el.title?{fontSize:'20px',fontWeight:500}:{}}>
                {t(el.title)}
            </Link>
        )
    })
// ==== Switch Language ====
    const [lang, setlang] = useState(current_lang);

    const switchLanguage = (event: SelectChangeEvent) => {
        setlang(event.target.value as string);
        const newPath = `/${event.target.value}${pathname.replace(/^\/(en|ar)/, "")}`;
        router.push(newPath);
    };



    
  return (
    <div className={Styles.parent} dir={current_lang == "en"?"ltr":"rtl"} style={{fontFamily:app_identity.primary_font}}>
        <div>
            <Image src={"/images/logo.webp"} alt='logo' width={120} height={120}/>
        </div>

      <div className={Styles.titles}>
         {titles}
      </div>

      <div className={Styles.nav_configs}>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 15 }}>
                <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={lang}
                        label="lang"
                        onChange={switchLanguage}
                        disableUnderline
                    >
                        <MenuItem value={"en"}>EN</MenuItem>
                        {/* <MenuItem value={"ar"}>AR</MenuItem> */}
                    </Select>
            </FormControl>

            <Link href={`/${lang}/Screens/forms/login`} shallow className={Styles.login_btn}>
                {t("login_btn")}
            </Link>


      </div>
    </div>
  )
}

export default Nave
