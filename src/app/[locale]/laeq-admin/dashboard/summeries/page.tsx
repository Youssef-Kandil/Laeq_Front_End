/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from 'react'
import Styles from './summeries.module.css'
// import { useLocale } from 'next-intl';
// import { useRouter } from 'next/navigation'
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

import { FaSquarePollVertical } from "react-icons/fa6";
import { MdSell } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";
import { SiReaddotcv } from "react-icons/si";
import { LuPackagePlus } from "react-icons/lu";
import SkeletonLoader from '@/app/components/global/SkeletonLoader/SkeletonLoaders';
import { useLaeqSummeries} from '@/app/Hooks/useSummeries';
import { getAdminAccountInfo } from '@/app/utils/getAccountInfo';
import Image from 'next/image';
// import {formatDate} from '@/app/utils/date';



// import {  Range, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // style الأساسي
import 'react-date-range/dist/theme/default.css'; // الثيم
// import app_identity from '@/app/config/identity';


// import Popup from '@/app/components/global/Popup/Popup';

// interface  dateRang{
//     startDate: Date;
//     endDate: Date;
//     key: string;
// }

 function Dashboard() {
    // const router = useRouter();
    //  const current_lang = useLocale();

        React.useEffect(()=>{
            localStorage.setItem('clickedAsideTitle',"dashboard");
        },[])


        const Info = getAdminAccountInfo("AccountInfo"); 
        function calculateReportStatusCounts(reports: any[]) {
            const counts = {
              inProgress: 0,
              pendding: 0,
              completed: 0,
              rejected: 0,
            };
          
            reports?.forEach((report) => {
              switch (report.status?.toLowerCase()) {
                case "in progress":
                  counts.inProgress += 1;
                  break;
                case "pending":
                  counts.pendding += 1;
                  break;
                case "completed":
                  counts.completed += 1;
                  break;
                case "rejected":
                  counts.rejected += 1;
                  break;
                default:
                  break;
              }
            });
          
            return counts;
          }
          

        // const t = useTranslations('table_component');

        const boxColors = [
            {iconColor:"#FA5A7D",mainColor: "#FFE2E5"},
            {iconColor:"#FF947A",mainColor: "#FFF4DE"},
            {iconColor:"#3CD856",mainColor: "#DCFCE7"},
            {iconColor:"#BF83FF",mainColor: "#F3E8FF"},
            {iconColor:"#FF947A",mainColor: "#FFF4DE"},
        ]
        const boxIcon =[
          <SiReaddotcv key="poll-icon"/>,
          <IoMdPersonAdd key="users-icon"/>,
          <MdSell key="sell-icon"/>,
          <FaSquarePollVertical key="poll-icon"/>,
            <LuPackagePlus key="assets-icon"/>,
        ]

        const {data:SummeriesData,isLoading,isError} = useLaeqSummeries(Number(Info?.userDetails.id));
        if (isLoading) return <SkeletonLoader/>;
        if (isError) return <p>Something went wrong</p>;
        
       
        const boxesData = [
            {title:"Total Companies",info:SummeriesData?.companiesCount},
            {title:"Total Clients",info:SummeriesData?.SubscripersCount},
            {title:"Total Sales",info:SummeriesData?.totalAmount},
            {title:"Total Reports",info:SummeriesData?.ReportsCount??""},
            {title:"Total Inspectors",info:SummeriesData?.employeesCount}]
        const tasksCounts = calculateReportStatusCounts(SummeriesData?.ReportSummeries || []);
        const ActionsCounts = calculateReportStatusCounts(SummeriesData?.actionSummeries || []);
        
        const TotalActionsData = {
          total:
            ActionsCounts.inProgress +
            ActionsCounts.pendding +
            ActionsCounts.completed ,
            // ActionsCounts.rejected,
          data: ActionsCounts,
        };
        const TotalTasksData = {
          total:
            tasksCounts.inProgress +
            tasksCounts.pendding +
            tasksCounts.completed ,
            // tasksCounts.rejected,
          data: tasksCounts,
        };

        // const TotalData = {total:100 ,data:{inProgress:25,pendding:15,completed:50,rejected:10}}
        // ==== START DATE FILTER LOGIC ====
        //  const [showDatePicker, setShowDatePicker] = React.useState<boolean>(false);
        //  const [range, setRange] = React.useState<Range[]>([
        //      {
        //        startDate: new Date(),
        //        endDate: new Date(),
        //        key: 'selection'
        //      }
        //    ]);
     
     
          //  function handleDateRangeChange(
          //    rangesByKey: RangeKeyDict,
          //    setRange: (range: dateRang[]) => void,
          //  ) {
          //    const selection = rangesByKey.selection;
           
          //    // تأكد من أن التواريخ معرفة وليست undefined
          //    if (selection.startDate && selection.endDate) {
          //      const newRange: dateRang[] = [
          //        {
          //          startDate: selection.startDate,
          //          endDate: selection.endDate,
          //          key: selection.key ?? "defaultKey",
          //        },
          //      ];
          //      setRange(newRange);
          //    }
          //  }
         // ==== END DATE FILTER LOGIC ====

    // ==  Render boxxes
    const Boxes = boxesData.map((box,indx)=>{
        return(
            <div key={indx} style={{background:boxColors[indx].mainColor}} className={Styles.Box}>
                    <div>
                        <span className={Styles.title}>{box.title}</span>
                        <span style={{background:boxColors[indx].iconColor}} className={Styles.icon} >{boxIcon[indx]}</span>
                    </div>
                    
                    <p className={Styles.info}>{box.info} {box.title == "Total Sales"?<Image src="/price.svg" alt="" width={30} height={30}/>:null}</p>
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
            <h3>Tasks</h3>
            <div className={Styles.info_container}>
                
                <div className={Styles.Box}>
                    <h3>Inprogress</h3>
                        <Gauge 
                            width={200} 
                            height={100} 
                            value={TotalTasksData.data.inProgress} 
                            valueMax={TotalTasksData.total}
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
                            value={TotalTasksData.data.pendding} 
                            valueMax={TotalTasksData.total}
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
                            value={TotalTasksData.data.completed} 
                            valueMax={TotalTasksData.total}
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

            </div>
          </section>

          <section id={Styles.Totals}>
            <h3>Actions</h3>
            <div className={Styles.info_container}>
                
                <div className={Styles.Box}>
                    <h3>Inprogress</h3>
                        <Gauge 
                            width={200} 
                            height={100} 
                            value={TotalActionsData.data.inProgress} 
                            valueMax={TotalActionsData.total}
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
                            value={TotalActionsData.data.pendding} 
                            valueMax={TotalActionsData.total}
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
                            value={TotalActionsData.data.completed} 
                            valueMax={TotalActionsData.total}
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

            </div>
          </section>
      </div>
    )
}

export default Dashboard
