"use client";
import React from "react";
import Styles from './Report_Details.module.css'
import { useParams,useRouter } from "next/navigation";
import QuestionReportTemplateComponent from "@/app/components/QuestionReportTemplateComponent/QuestionReportTemplateComponent";
import { useGetReportDetails } from "@/app/Hooks/useGetReportDetails";
import BottonComponent from "@/app/components/global/ButtonComponent/BottonComponent";
import Image from "next/image";
import app_identity from "@/app/config/identity";
import SkeletonLoader from "@/app/components/global/SkeletonLoader/SkeletonLoaders";


function Report_Details() {
  const router = useRouter();
  // const params = useParams();
  const params = useParams() as { TemplateID?: string };


  let template_title: number | null = null;
  let report_id: number | null = null;
  
  if (params.TemplateID) {
    [template_title, report_id] = params.TemplateID.split("-").map(Number);
  }// 👈 لازم اسم البارام يكون زي اللي معرفه في الراوت
  const { data, isLoading, error } = useGetReportDetails(Number(report_id));
  
  if (isLoading) return <SkeletonLoader/>;
  if (error) router.back();
  if (!data || data.length == 0) return router.back();;
  console.log("REPO DET :: ",data ,template_title)

  // === Looping On Data ===
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Questions = data?.report_questions?.map((question: any, index: number) => (
    <QuestionReportTemplateComponent
      key={index}
      questionNumber={index + 1}
      title={question.question_title}
      answers={question.report_fields_answers}
    />
  ));

  return(
      <div className={Styles.parent}>
        <nav className={Styles.nav}>
          <div className={Styles.nav_details}>

              <div style={{display:'flex',alignItems:"center"}}>
                {/* <Image src={"/images/شعار لائق -06.jpeg"} alt='logo' width={120} height={120}/> */}
                <Image src={"/images/logo365.jpeg"} alt='logo' width={40} height={120}/>
                <strong style={{fontSize:'1.4rem',marginLeft:6}}>
                    <p style={{color:app_identity.primary_color}}>LAEQ</p>
                    <p style={{lineHeight:0.5,color:app_identity.secondary_color}}>365</p>
                </strong>
                </div>
          </div>
          
          <div className={Styles.nav_details}>
            <div>
              <p>Site</p>
              <span>{data?.sites?.site_name}</span>
            </div>
          </div>
          <div className={Styles.nav_details}>
            <div>
              <p>Score</p>
              <span>{JSON.parse(data.score??"")?.percentage??"0%"}</span>
            </div>
          </div>

          <div className={Styles.nav_details}>
            <div>
              <p>Points</p>
              <span>{JSON.parse(data.score).templateScore}/{JSON.parse(data.score).finalScore}</span>
            </div>
          </div>

          <div>
            <p>Submited By</p>
            <span>{data.submitted_by}</span>
          </div>

          <div>
            <p>Submitted At</p>
            <span>{new Date(data.date).toLocaleDateString("en-GB", {
              day: "numeric",   // اليوم رقم
              month: "short",   // الشهر نص قصير (Jan, Feb, ...)
              year: "numeric",  // السنة رقم
              hour: "2-digit",  // الساعة برقمين
              minute: "2-digit",// الدقايق برقمين
              hour12: true     // نظام 24 ساعة
            })}</span>
          </div>
        <div className={Styles.printBtn}>
          <BottonComponent
            title="Print Report"
            onClick={()=>window.print()}
          />
        </div>
      </nav>
        {Questions}
      </div>
  ) 
}

export default Report_Details;
