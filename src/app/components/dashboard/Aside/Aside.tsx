"use client";
import React  from 'react'
import Image from 'next/image';
import Link from 'next/link';
import Styles from "./aside.module.css"
import {useTranslations,useLocale} from 'next-intl';
import aside_titles from '@/app/config/aside_titles';




function Aside() {
    const current_lang = useLocale();
    const t = useTranslations('aside_component');
        // ==== handel Clecked text ====
        const [clickedTitle, setClickedTitle] = React.useState<string>(t(aside_titles[0].title));//+
        // const [ isChildMenuTitleShowed , setIsChildMenuTitleShowed] = React.useState(false)
        React.useEffect(() => {
        const savedTitle = localStorage.getItem('clickedAsideTitle');
        if (savedTitle) {
            setClickedTitle(savedTitle);
        }
        }, []);
        interface TitleElement {
            title: string;
        }
    
        const handleTitleClick = (el: TitleElement): void => {
          console.log("Clicked Title : ",el.title)
            setClickedTitle(el.title);
            localStorage.setItem('clickedAsideTitle', el.title);
            // if (el?.children) {
            //   setIsChildMenuTitleShowed(!isChildMenuTitleShowed)
            // }else{
            //   setIsChildMenuTitleShowed(false)
            // }
        };
        // === Render Titles ===
    const titles = aside_titles.map((el,index)=>{
      return(
        <Link href={`/${current_lang}/Screens/dashboard${el.href}`} onClick={() => handleTitleClick(el)}   style={clickedTitle == el.title?{background:"#5CC6A31A",color:"#4DA387",marginBottom:index == 4||index ==8?20:0}:{marginBottom:index == 4||index ==8?20:0}}  className={Styles.title}  key={index}>
          {el.icon}
          <p >{t(`${el.title}`)}</p>
          {index == 4  && <span style={{width:"100%",height:"1px",background:"#E2E8F0",position:'absolute',bottom:'-10px',left:"-10%"}}></span>}
          {index == 8  && <span style={{width:"100%",height:"1px",background:"#E2E8F0",position:'absolute',bottom:'-10px',left:"-10%"}}></span>}
        </Link>
      )
    })


  return (
    <div className={Styles.parent} lang={current_lang}>
       <div className={Styles.main_title}>
          <Image src={""} alt='' loading="lazy" width={30} height={30} />
          {/* <h3>{t("title")}</h3> */}
          <h3>LAEQ365</h3>
       </div>
       <div className={Styles.titlesList}>
            {titles}
       </div>
    </div>
  )
}

export default Aside
