"use client";
import React from "react";
import Styles from './Report_Details.module.css'
import { useParams,useRouter } from "next/navigation";
import QuestionReportTemplateComponent from "@/app/components/QuestionReportTemplateComponent/QuestionReportTemplateComponent";
import { useGetReportDetails } from "@/app/Hooks/useGetReportDetails";
import BottonComponent from "@/app/components/global/ButtonComponent/BottonComponent";



function Report_Details() {
  const router = useRouter();
  // const params = useParams();
  const params = useParams() as { TemplateID?: string };


  let template_id: number | null = null;
  let task_id: number | null = null;
  
  if (params.TemplateID) {
    [template_id, task_id] = params.TemplateID.split("-").map(Number);
  }// 👈 لازم اسم البارام يكون زي اللي معرفه في الراوت
  const { data, isLoading, error } = useGetReportDetails(Number(template_id),Number(task_id));
  
  if (isLoading) return <div>جاري تحميل التقرير...</div>;
  if (error) router.back();
  if (!data || data.length == 0) return router.back();;
  console.log("REPO DET :: ",data)

  // === Looping On Data ===
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Questions = data?.questions?.map((question: any, index: number) => (
    <QuestionReportTemplateComponent
      key={index}
      questionNumber={index + 1}
      title={question.question_title}
      answers={question.question_answers}
    />
  ));

  return(
      <div >
        <nav className={Styles.nav}>
          <div className={Styles.nav_details}>
            <div>
              <p>Tepmlate</p>
              <span>{data.template_title}</span>
            </div>
          </div>
          <div>
            <p>Submited By</p>
            <span>{data.questions[0].question_answers[0].users.email}</span>
          </div>
          <div>
            <p>Submited At</p>
            <span>{data.questions[0].question_answers[0].answered_at}</span>
          </div>
        <div>
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
