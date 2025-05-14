import React from 'react'
import Styles from "./gallary_card.module.css"
import Image from 'next/image';
import app_identity from '@/app/config/identity';

interface gallary_card_props {
        title: string;
        media_url:string;
}

function Gallary_Card({title,media_url }:gallary_card_props) {
  return (
    <div className={Styles.parent} style={{fontFamily:app_identity.primary_font}}>
      <Image src={media_url} alt=''/>
        <h3>{title}</h3>
    </div>
  )
}

export default Gallary_Card
