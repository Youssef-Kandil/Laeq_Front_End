"use client";
import React from 'react'
import Styles from './notifications.module.css'
import NotificationCardComponent from '@/app/components/global/NotificationCardComponent/NotificationCardComponent';

function notifications() {
    /*TEST DATA*/ const data = [
        {head:"Lorem ipsum dolor sit",details:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus perspiciatis deserunt, iure enim temporibus cum quis, numquam suscipit laborum perferendis illo nemo, ratione ab dolores dicta sit quibusdam asperiores expedita.",date:"12/12/2025"},
        {head:"Lorem ipsum dolor sit",details:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus perspiciatis deserunt, iure enim temporibus cum quis, numquam suscipit laborum perferendis illo nemo, ratione ab dolores dicta sit quibusdam asperiores expedita.",date:"12/12/2025"},
        {head:"Lorem ipsum dolor sit",details:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus perspiciatis deserunt, iure enim temporibus cum quis, numquam suscipit laborum perferendis illo nemo, ratione ab dolores dicta sit quibusdam asperiores expedita.",date:"12/12/2025"},
    ];
  return (
    <div className={Styles.parent}>
        {
            data.map((el,index)=>{
                return <NotificationCardComponent key={index} head={el.head} details={el.details} date={el.date}/>
            })
        }
    </div>
  )
}

export default notifications
