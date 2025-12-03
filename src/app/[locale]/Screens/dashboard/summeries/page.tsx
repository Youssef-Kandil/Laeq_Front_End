/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from 'react'
import Styles from './summeries.module.css'
import { ChartBarInteractive } from '@/app/components/global/Charts/chart-bar-interactive/chart-bar-interactive';
import { ChartRadialShape } from '@/app/components/global/Charts/chart-radial-shape/chart-radial-shape';
// import { useLocale } from 'next-intl';
// import { useRouter } from 'next/navigation'
// import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

import { FaSquarePollVertical } from "react-icons/fa6";
import { MdSell } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";
import { SiReaddotcv } from "react-icons/si";
import { LuPackagePlus } from "react-icons/lu";
import SkeletonLoader from '@/app/components/global/SkeletonLoader/SkeletonLoaders';
import { useSummeries } from '@/app/Hooks/useSummeries';
import { getAdminAccountInfo } from '@/app/utils/getAccountInfo';
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
        // function calculateReportStatusCounts(reports: any[]) {
        //     const counts = {
        //       inProgress: 0,
        //       pendding: 0,
        //       completed: 0,
        //       rejected: 0,
        //     };
          
        //     reports?.forEach((report) => {
        //       switch (report.status?.toLowerCase()) {
        //         case "in progress":
        //           counts.inProgress += 1;
        //           break;
        //         case "pending":
        //           counts.pendding += 1;
        //           break;
        //         case "completed":
        //           counts.completed += 1;
        //           break;
        //         case "rejected":
        //           counts.rejected += 1;
        //           break;
        //         default:
        //           break;
        //       }
        //     });
          
        //     return counts;
        //   }
          

        // const t = useTranslations('table_component');

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

        const {data:SummeriesData,isLoading,isError} = useSummeries(Number(Info?.userDetails.id));
        if (isLoading) return <SkeletonLoader/>;
        if (isError) return <p>Something went wrong</p>;
        
       
        const boxesData = [{title:"Total Reports",info:SummeriesData?.ReportsCount},{title:"Total Companies",info:SummeriesData?.companiesCount},{title:"Total Sites",info:SummeriesData?.sitesCount},{title:"Total Users",info:SummeriesData?.employeesCount??""},{title:"Total Assets",info:SummeriesData?.assetsCount},]
        




         // ==== END DATE FILTER LOGIC ====

    // ==  Render boxxes
    const Boxes = boxesData.map((box,indx)=>{
        return(
            <div key={indx} style={{background:boxColors[indx].mainColor}} className={Styles.Box}>
                    <div className={Styles.Text}>
                      <span className={Styles.title}>{box.title}</span>
                      <p className={Styles.info}>{box.info}</p>
                    </div>
                    <div>
                        <span style={{background:boxColors[indx].iconColor}} className={Styles.icon} >{boxIcon[indx]}</span>
                    </div>
            </div>
        )
    })

    

   return (
      <div className={Styles.parent}>

          <section id={Styles.Summeries}>
            <h3>Summeries</h3>
            <div className={Styles.box_container}>
                {Boxes}
            </div>
          </section>
          <div className="p-6">
             <ChartBarInteractive data={SummeriesData?.tasksData}/>
        </div>
        <div className="mx-5 p-1 bg-gradient-to-br from-gray-50 to-gray-200 rounded-2xl shadow-md border border-gray-200" >
          <div className="flex flex-1 flex-col justify-center gap-1 mb-3 mt-3 px-6 pt-4 pb-3 sm:!py-0">
            <div data-slot="card-title" className="leading-none font-semibold">
              Actions Chart 
            </div>
            <div data-slot="card-description" className="text-muted-foreground text-sm">
              Showing total actions for this month
            </div>
        </div>
            <ChartRadialShape items={SummeriesData?.actionsStats as any} />
        </div>
      </div>
    )
}

export default Dashboard
