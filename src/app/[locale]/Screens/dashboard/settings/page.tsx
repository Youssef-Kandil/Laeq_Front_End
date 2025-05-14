"use client";
import React from 'react'
import Styles from './settings.module.css'
import app_identity from '@/app/config/identity';
import AccountInfo from './AccountInfo';
import LanguageInfo from './LanguageInfo';

function Settings() {
    const settingsTabs = ["Account Setting","Language"];
    const [SelectedTab,setSelectedTab] = React.useState("Account Setting");
  return (
    <div className={Styles.parent}>
      <section className={Styles.mainContainer}>
      {/* === START NAV === */}
        <nav>
            {
              settingsTabs.map((title,index)=>{
                return (
                    <div onClick={()=>setSelectedTab(title)} key={index} style={title == SelectedTab?{borderBottom:`2px solid ${app_identity.secondary_color}`,color:app_identity.secondary_color}:{}}>
                      <p>{title}</p>
                    </div>
                )
              })
            }
        </nav>
      {/* === START CONTENT === */}
          {SelectedTab == "Language"?<LanguageInfo/>:<AccountInfo/>}
      </section>
    </div>
  )
}

export default Settings
