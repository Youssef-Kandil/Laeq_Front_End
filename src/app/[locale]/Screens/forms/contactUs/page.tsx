"use client";
import React from 'react'
import Styles from './contactUs.module.css'
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
import {useTranslations,useLocale} from 'next-intl';

function ContactUs() {
      const Current_lang = useLocale();
      console.log("Current Lang --> ",Current_lang)
      const t = useTranslations('contact_us')


    //   const [age, setAge] = React.useState('');

    //   const handleChange = (event: SelectChangeEvent) => {
    //     setAge(event.target.value as string);
    //   };

      
  return (
    <div className={Styles.parent} lang={Current_lang}>

        <header>
            <h1>{t("title")} <span>{t("special_word")}</span> </h1>
            <p>{t("subtitle")}</p>
        </header>

        <div className={Styles.form}>
            <input type="text" placeholder={t("full_name_placeholder")} name="" id="" />
            <input type="email" placeholder={t("email_placeholder")} name="" id="" />
            <input type="number" placeholder={t("Phone_number_placeholder")} />
            {/* <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{t("how_did_you_find_us_placeholder")}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label={t("how_did_you_find_us_placeholder")}
                    onChange={handleChange}
                    >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl> */}

            <button type="button">{t("submit_button")}</button>
        </div>
      
    </div>
  )
}

export default ContactUs
