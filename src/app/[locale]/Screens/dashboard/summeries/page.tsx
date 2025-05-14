"use client";
import React from 'react'
import {useTranslations,useLocale} from 'next-intl';
import Styles from './summeries.module.css'
import Stack from '@mui/material/Stack';
// import { Gauge } from '@mui/x-charts/Gauge';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { Typography } from '@mui/material';

import { FaSquarePollVertical } from "react-icons/fa6";
import { MdSell } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";
import { SiReaddotcv } from "react-icons/si";
import { LuPackagePlus } from "react-icons/lu";
import {formatDate} from '@/app/utils/date';
import { IoIosSearch } from "react-icons/io";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";


import { DateRange, Range, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // style الأساسي
import 'react-date-range/dist/theme/default.css'; // الثيم
import app_identity from '@/app/config/identity';


import Popup from '@/app/components/global/Popup/Popup';

interface  dateRang{
    startDate: Date;
    endDate: Date;
    key: string;
}

 function Dashboard() {

        // const current_lang = useLocale();
        const t = useTranslations('table_component');

        const boxColors = [
            {iconColor:"#FA5A7D",mainColor: "#FFE2E5"},
            {iconColor:"#FF947A",mainColor: "#FFF4DE"},
            {iconColor:"#3CD856",mainColor: "#DCFCE7"},
            {iconColor:"#BF83FF",mainColor: "#F3E8FF"},
            {iconColor:"#FF947A",mainColor: "#FFF4DE"},
        ]
        const boxIcon =[
            <FaSquarePollVertical key="poll-icon"/>,
            <SiReaddotcv key="poll-icon"/>,
            <MdSell key="sell-icon"/>,
            <IoMdPersonAdd key="users-icon"/>,
            <LuPackagePlus key="assets-icon"/>,
        ]
        
        /*TESTING DATA*/  const boxesData = [{title:"Total Reports",info:"389"},{title:"Total Companies",info:"2"},{title:"Total Sites",info:"5"},{title:"Total Users",info:"675"},{title:"Total Assets",info:"238"},]
        /*TESTING DATA*/  const TotalData = {total:100 ,data:{inProgress:25,pendding:15,completed:50,rejected:10}}
        // ==== START DATE FILTER LOGIC ====
         const [showDatePicker, setShowDatePicker] = React.useState<boolean>(false);
         const [range, setRange] = React.useState<Range[]>([
             {
               startDate: new Date(),
               endDate: new Date(),
               key: 'selection'
             }
           ]);
     
     
           function handleDateRangeChange(
             rangesByKey: RangeKeyDict,
             setRange: (range: dateRang[]) => void,
           ) {
             const selection = rangesByKey.selection;
           
             // تأكد من أن التواريخ معرفة وليست undefined
             if (selection.startDate && selection.endDate) {
               const newRange: dateRang[] = [
                 {
                   startDate: selection.startDate,
                   endDate: selection.endDate,
                   key: selection.key ?? "defaultKey",
                 },
               ];
               setRange(newRange);
             }
           }
         // ==== END DATE FILTER LOGIC ====

    // ==  Render boxxes
    const Boxes = boxesData.map((box,indx)=>{
        return(
            <div key={indx} style={{background:boxColors[indx].mainColor}} className={Styles.Box}>
                    <div>
                        <span style={{background:boxColors[indx].iconColor}} className={Styles.icon} >{boxIcon[indx]}</span>
                    </div>
                    <p className={Styles.info}>{box.info}</p>
                    <span className={Styles.title}>{box.title}</span>
            </div>
        )
    })

    // === handel chart progress ===
    

   return (
      <div className={Styles.parent}>

          <section id={Styles.Summeries}>
            <h3>Summeries</h3>
            <div className={Styles.box_container}>
                {Boxes}
            </div>
          </section>

          <section id={Styles.Totals}>
            <h3>Total Actions</h3>
            <div className={Styles.info_container}>
                
                <div className={Styles.Box}>
                    <h3>Inprogress</h3>
                        <Gauge 
                            width={200} 
                            height={100} 
                            value={TotalData.data.inProgress} 
                            valueMax={TotalData.total}
                            startAngle={-90} 
                            endAngle={90}
                            sx={{
                                // track
                                [`& .${gaugeClasses.referenceArc}`]: {fill: '#36434E',},
                                // progress
                                [`& .${gaugeClasses.valueArc}`]: {fill: '#FF6060',},
                                // text
                                [`& .${gaugeClasses.valueText}`]: {fontSize: '1rem',fontWeight: 600,fill: '#FFFFFF',color:"#323135",},
                              }}
                            
                            text={({ value, valueMax }) => `${value} / ${valueMax}`}
                             />
                </div>

                <div className={Styles.Box}>
                    <h3>Pendding</h3>
                        <Gauge 
                            width={200} 
                            height={100} 
                            value={TotalData.data.pendding} 
                            valueMax={TotalData.total}
                            startAngle={-90} 
                            endAngle={90}
                            sx={{
                                // track
                                [`& .${gaugeClasses.referenceArc}`]: {fill: '#36434E',},
                                // progress
                                [`& .${gaugeClasses.valueArc}`]: {fill: 'rgba(27, 203, 128, 1)',},
                                // text
                                [`& .${gaugeClasses.valueText}`]: {fontSize: '1rem',fontWeight: 600,fill: '#FFFFFF',color:"#323135",},
                              }}
                            
                            text={({ value, valueMax }) => `${value} / ${valueMax}`}
                             />
                </div>

                <div className={Styles.Box}>
                    <h3>Completed</h3>
                        <Gauge 
                            width={200} 
                            height={100} 
                            value={TotalData.data.completed} 
                            valueMax={TotalData.total}
                            startAngle={-90} 
                            endAngle={90}
                            sx={{
                                // track
                                [`& .${gaugeClasses.referenceArc}`]: {fill: '#36434E',},
                                // progress
                                [`& .${gaugeClasses.valueArc}`]: {fill: 'rgba(151, 71, 255, 1)',},
                                // text
                                [`& .${gaugeClasses.valueText}`]: {fontSize: '1rem',fontWeight: 600,fill: '#FFFFFF',color:"#323135",},
                              }}
                            
                            text={({ value, valueMax }) => `${value} / ${valueMax}`}
                             />
                </div>

                <div className={Styles.Box}>
                    <h3>Rejected</h3>
                        <Gauge 
                            width={200} 
                            height={100} 
                            value={TotalData.data.rejected} 
                            valueMax={TotalData.total}
                            startAngle={-90} 
                            endAngle={90}
                            sx={{
                                // track
                                [`& .${gaugeClasses.referenceArc}`]: {fill: '#36434E',},
                                // progress
                                [`& .${gaugeClasses.valueArc}`]: {fill: 'rgba(251, 178, 20, 1)',},
                                // text
                                [`& .${gaugeClasses.valueText}`]: {fontSize: '1rem',fontWeight: 600,fill: '#FFFFFF',color:"#323135",},
                              }}
                            
                            text={({ value, valueMax }) => `${value} / ${valueMax}`}
                             />
                </div>
            </div>
          </section>
      </div>
    )
}

export default Dashboard
