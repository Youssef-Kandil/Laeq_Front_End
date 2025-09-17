"use client";
import React, { useState } from "react";
import Styles from "./answerTemplate.module.css";
import { useParams , useRouter } from "next/navigation";
import { QuestionType } from "@/app/Types/checklistTypes";
import QuestionAnswerTemplateComponent from "@/app/components/QuestionAnswerTemplateComponent/QuestionAnswerTemplateComponent";
import BottonComponent from "@/app/components/global/ButtonComponent/BottonComponent";
import { useGetQuestionsByTemplatesId } from "@/app/Hooks/useTemplateQuestions";
import { useSubmitTemplateAnswers } from "@/app/Hooks/useSubmitTemplateAnswers";
import { useUpdateTaskStatus } from "@/app/Hooks/useTasks";
import { useLocale } from "next-intl";
import Popup from "@/app/components/global/Popup/Popup";
import { CiSquareRemove } from "react-icons/ci";
import { getAdminAccountInfo } from "@/app/utils/getAccountInfo";
import { AccountInfo } from "@/app/Types/AccountsType";

// نوع البيانات اللي هتتبعت للباك
interface Answer {
  userID: number;
  admin_id?:number;
  task_id?:number;
  questionID: number;
  fieldID: number;
  value: string | Blob;
  type: string;
}

function AnswerTemplate() {
  const router = useRouter();
  const params = useParams();
  const Current_lang = useLocale();
  const info = getAdminAccountInfo("AccountInfo") as AccountInfo | null;
  console.log("info?.email :: ",info)
  const isEmployee = info?.role === "employee";
  const targetId  =
  isEmployee
    ? info?.userDetails?.admin_id
    : info?.userDetails?.id;
  const { answerTemplate: templateID } = params;
  const { mutate: submitAnswers } = useSubmitTemplateAnswers();

  let title: string | undefined = undefined;
  let id: string | number | undefined = undefined;
  let task_id: number | undefined = undefined;

  if (templateID) {
    const raw = Array.isArray(templateID) ? templateID[0] : templateID;
    const firstDash = raw.indexOf("-");
    const lastDash = raw.lastIndexOf("-");

    if (firstDash !== -1 && lastDash !== -1 && firstDash < lastDash) {
      const rawTaskId = raw.slice(0, firstDash);
      const encodedTitle = raw.slice(firstDash + 1, lastDash);
      const rawTemplateId = raw.slice(lastDash + 1);
  
      task_id = Number(rawTaskId);
      title = decodeURIComponent(encodedTitle);
      id = Number(rawTemplateId);
    }
  }

  const { data, isLoading, error } = useGetQuestionsByTemplatesId(Number(id));
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showPopup,setShowPopup] = useState<boolean>(false);

  // استقبال اجابة من الابن
  const  { mutate: updateTaskStatus} = useUpdateTaskStatus();
  const handleAnswerChange = (newAnswer: Answer) => {
    setAnswers((prev) => {
      // لو الاجابة موجودة قبل كدا تتحدث
      const exist = prev.find(
        (a) =>
          a.questionID === newAnswer.questionID &&
          a.fieldID === newAnswer.fieldID
      );
      if (exist) {
        return prev.map((a) =>
          a.questionID === newAnswer.questionID && a.fieldID === newAnswer.fieldID
            ? newAnswer
            : a
        );
      }
      return [...prev, newAnswer];
    });
  };
  function handelSubmit(){
    setShowPopup(false);
    console.log("Answers ready to send:", answers);
    submitAnswers(answers,{
      onSuccess:()=>{
        updateTaskStatus({ task_id:task_id!, status: "Completed" },
          {
            onSuccess:()=>{
              router.replace(`/${Current_lang}/Screens/dashboard/tasks`);
            }
          }
        )
      },
      onError:()=>{
        setShowPopup(true);
      }
    });   
  }

  if (isLoading) return <div>جاري التحميل...</div>;
  if (error) return <div>حدث خطأ: {(error as Error).message}</div>;
  if (!data) return <div>لا توجد بيانات</div>;
  console.log("Questionss ::>> ",data);

  const Questions = data.map((question: QuestionType, index: number) => (
    <QuestionAnswerTemplateComponent
      key={index}
      questionNumber={index + 1}
      title={question.question_title}
      fields={question.question_fields}
      questionID={question.id}
      task_id={task_id??-1}
      admin_id={targetId??-1}
      userID={info?.id??-1}
      onAnswerChange={handleAnswerChange}
      answers={answers}
    />
  ));

  return (
    <div>
      {showPopup&&<Popup icon={<CiSquareRemove color="red"/>} title="Please try again later." subTitle="Your answers were not saved." onClose={()=>setShowPopup(false)}/>}
      <nav className={Styles.nav}>
        <span>{title}</span>
        <div>
          <BottonComponent
            title="Submit"
            onClick={handelSubmit}
          />
        </div>
      </nav>
      {Questions}

      {data.length >=2 &&(
              <nav className={Styles.nav}>
              <span>{title}</span>
              <div>
                <BottonComponent
                  title="Submit"
                  onClick={handelSubmit}
                />
              </div>
            </nav>
      )}
    </div>
  );
}

export default AnswerTemplate;
