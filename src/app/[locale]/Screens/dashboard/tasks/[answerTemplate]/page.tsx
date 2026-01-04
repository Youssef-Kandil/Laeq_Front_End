/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState ,useEffect } from "react";
import Styles from "./answerTemplate.module.css";
import { useParams , useRouter } from "next/navigation";
import { QuestionType } from "@/app/Types/checklistTypes";
import QuestionAnswerTemplateComponent from "@/app/components/QuestionAnswerTemplateComponent/QuestionAnswerTemplateComponent";
import BottonComponent from "@/app/components/global/ButtonComponent/BottonComponent";
import { useGetQuestionsByTemplatesId } from "@/app/Hooks/useTemplateQuestions";
import { useSubmitTemplateAnswers } from "@/app/Hooks/useSubmitTemplateAnswers";

import { useUpdateTaskStatus ,useUpdateTaskScore } from "@/app/Hooks/useTasks";
// import { useUpdateTaskStatus ,useUpdateTaskScore ,useDraftTask} from "@/app/Hooks/useTasks";
import { useLocale } from "next-intl";
import Popup from "@/app/components/global/Popup/Popup";
import Lottie from "lottie-react";
import WorngIcon  from '@/app/Lottie/wrong.json'
import LoadingIcon  from '@/app/Lottie/Loading animation blue.json'
import { getAdminAccountInfo } from "@/app/utils/getAccountInfo";
import { AccountInfo } from "@/app/Types/AccountsType";
import { preventPageExit } from "@/app/utils/preventPageExit";
import SkeletonLoader from "@/app/components/global/SkeletonLoader/SkeletonLoaders";
import { report_payload } from "@/app/Types/AnswerType";
// import { FaFile } from "react-icons/fa";
// نوع البيانات اللي هتتبعت للباك
interface Answer {
  userID: number;
  admin_id?:number;
  task_id?:number;
  company_id:number;
  site_id:number
  questionID: number;
  fieldID: number;
  value: string | Blob;
  type: string;
  action_level:"High"|"Low"|"Medium"|null
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
  const { mutate: submitAnswers,isPending } = useSubmitTemplateAnswers();

  let title: string | undefined = undefined;
  let id: string | number | undefined = undefined;
  let task_id: number | undefined = undefined;
  let company_id: number | undefined = undefined;
  let site_id: number | undefined = undefined;
  let inspection_to: number | undefined = undefined;
  if (templateID) {
    const raw = Array.isArray(templateID) ? templateID[0] : templateID;
  
    // نقسم كل جزء بناءً على الـ "-"
    const parts = raw.split("-");
  
    if (parts.length >= 6) {
      // أول جزء هو الـ task_id
      task_id = Number(parts[0]);
  
      // آخر 3 أجزاء دايمًا هي template_id, company_id, site_id
      task_id = Number(parts[0]);       // أول جزء
      inspection_to = Number(parts[1]); // تاني جزء
      
      // آخر 3 أجزاء = template_id, company_id, site_id
      const sitePart = parts.pop();      // site_id
      const companyPart = parts.pop();   // company_id
      const templatePart = parts.pop();  // template_id
    
      site_id = Number(sitePart);
      company_id = Number(companyPart);
      id = Number(templatePart);
  
      // الباقي من الأجزاء هو الـ title
      title = decodeURIComponent(parts.slice(2).join("-"));
    }
  }

  const { data, isLoading, error } = useGetQuestionsByTemplatesId(Number(id));
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isSubmitLoading,setIsSubmiLoading] = useState<boolean>(false);
  const [isDrafted,setIsDrafted] = useState<boolean>(false);
  const [showPopup,setShowPopup] = useState<boolean>(false);
  const [showValidationPopup,setShowValidationPopup] = useState<boolean>(false);
  const [ValidationPopupMSG,setValidationPopupMSG] = useState<string>("");
  const [finalScore, setFinalScore] = useState<number>(0);
  const [templateScore,setTemplateScore] = useState<number>(0);

  // استقبال اجابة من الابن
  const  { mutate: updateTaskStatus} = useUpdateTaskStatus();
  // const  { mutate: saveDraft} = useDraftTask();
  const  { mutate: updateTaskScore} = useUpdateTaskScore();

  useEffect(() => {
    preventPageExit(true);
    return () => preventPageExit(false);
  }, []);



  
  
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  console.log("Draft :: ",data);
  useEffect(() => {
    if (data?.questions) {
      setQuestions(data?.questions);
      if (data?.draft) {
        setAnswers(JSON.parse(data?.draft))
      }
    }

  }, [data]);

  
  const handleAnswerChange = (newAnswer: Answer) => {
    newAnswer.company_id = company_id ?? -1;
    newAnswer.site_id = site_id ?? -1;
      // ✨ لو نوع الإجابة أكشن ومفيش action_level نحطها null
      if (newAnswer.type === "action" && !newAnswer.action_level) {
        newAnswer.action_level = null;
      }
    setAnswers((prev) => {
      const exist = prev.find(
        (a) =>
          a.questionID === newAnswer.questionID &&
        a.fieldID === newAnswer.fieldID
      );
      let updatedAnswers;
      if (exist) {
        updatedAnswers = prev.map((a) =>
          a.questionID === newAnswer.questionID && a.fieldID === newAnswer.fieldID
        ? newAnswer
        : a
      );
    } else {
      updatedAnswers = [...prev, newAnswer];
    }
    
    // ✅ حساب الاسكور والفاينال
    let tempScore = 0;
    let tempPenalty = 0;
    
    updatedAnswers.forEach((ans) => {
      if (ans.type === "mcq") {
        const val = Number(ans.value);
        if (val === 1) tempScore += 5; // تزود في الاسكور
        if (val === -1) tempPenalty += 5; // خصم من النهائي بس
      } else if (ans.type === "score") {
        const val = Number(ans.value);
        if (!isNaN(val)) tempScore += val;
      }
    });
    
    // ✅ totalMcqAndScore لسه زي ما هو 
    const totalMcqAndScore =
    (fieldCounts.mcq || 0) + (fieldCounts.score || 0);
    
    // النهائي الكلي = الدرجة الكاملة - الخصومات
    const maxPossible = totalMcqAndScore * 5;
    const final = maxPossible - tempPenalty;
    
    setTemplateScore(tempScore);
    setFinalScore(final);
    
    return updatedAnswers;
  });

   // ✅ هنا الجزء الخاص بإضافة أو إزالة الحقول
   if (newAnswer.type === "mcq") {
    setQuestions((prevQuestions: any) =>
      prevQuestions.map((q: any) => {
        if (q.id !== newAnswer.questionID) return q;
  
        const mcqValue = Number(newAnswer.value);
        const baseFields = q.question_fields;
        const existingFieldTypes = baseFields.map((f: any) => f.type);
  
        // ✅ الحقول اللي ممكن نضيفها
        const extraFields = [
          { id: -1, type: "action", label: "Action Required", question_field_options: [] },
          { id: -2, type: "comment", label: "Comment", question_field_options: [] },
          { id: -3, type: "images", label: "Attach Images", question_field_options: [] },
        ];
  
        if (mcqValue === 0) {
          // أضف فقط الحقول غير الموجودة بالفعل
          const missingFields = extraFields.filter(
            (ef) => !existingFieldTypes.includes(ef.type)
          );
  
          return {
            ...q,
            question_fields: [...baseFields, ...missingFields],
          };
        } else {
          // ✅ امسح إجابات الأكشن والكومنت والصور للسؤال دا
          setAnswers((prev) =>
            prev.filter(
              (a) =>
                a.questionID !== newAnswer.questionID ||
                !["action", "comment", "images"].includes(a.type)
            )
          );
          // احذف فقط الحقول اللي أضفناها يدويًا (ID سالب)
          return {
            ...q,
            question_fields: baseFields.filter(
              (f: any) =>
                !(
                  ["action", "comment", "images"].includes(f.type) &&
                  f.id < 0 // يعني مضاف محليًا مش جاى من الباك
                )
            ),
          };
        }
      })
    );

  }
  
};





function handelSubmit(){
  setIsSubmiLoading(true);
  // ✅ تحقق من أن كل الأسئلة المطلوبة متجاوب عليها
  const requiredFields: { questionID: number; fieldID: number }[] = [];
  //=== Step 1

  data?.questions?.forEach((q: QuestionType) => {
    q.question_fields.forEach((field) => {
      // ✅ استثناء الأنواع غير المطلوبة
      if (!["action", "images", "comment"].includes(field.type)) {
        requiredFields.push({ questionID: q.id, fieldID: field.id });
      }
    });
  });

    const answeredFields = new Set(
      answers
        .filter((a) => {
          // لو النوع نصي وفضي
          if (typeof a.value === "string") return a.value.trim() !== "";
    
          // لو النوع Blob (زي الصور أو الملفات)
          if (a.value instanceof Blob) return a.value.size > 0;
    
          // لو نوع رقمي
          if (typeof a.value === "number") return !isNaN(a.value);
    
          // fallback لأي نوع تاني
          return a.value !== null && a.value !== undefined;
        })
        .map((a) => `${a.questionID}-${a.fieldID}`)
    );
    
    // === Step 3 (check missing faster)
    const missing = requiredFields.filter(
      (f) => !answeredFields.has(`${f.questionID}-${f.fieldID}`)
    );
    // === Step 4
    if (missing.length > 0) {
      setIsSubmiLoading(false);
      setShowValidationPopup(true);
    
      // استخراج أرقام الأسئلة الناقصة بناءً على ترتيبها في data
      const missingQuestionNumbers = Array.from(
        new Set(
          missing.map((m) => {
            const questionIndex = data?.questions?.findIndex((q:any) => q.id === m.questionID);
            return questionIndex !== -1 ? questionIndex + 1 : null;
          }).filter((num) => num !== null)
        )
      );
    
      const formattedList = missingQuestionNumbers.join(", ");
    
      setValidationPopupMSG(
        `You still need to answer question number: ${formattedList[0]}`
      );
      return;
    }
    

    const payload: report_payload = {
      admin_id: targetId ?? -1,
      userID: info?.id ?? -1,
      company_id: company_id ?? -1,
      site_id: site_id ?? -1,
      template_title: title ?? "Untitled",
      score: JSON.stringify({
        finalScore,
        templateScore,
        percentage: `${Math.floor((100 * (templateScore / finalScore)))}%`,
      }),
      inspection_to:inspection_to ?? -1,
      submitted_by: info?.userDetails.full_name ?? "unknown",
      // answered_at: new Date().toISOString(),
    
      questions: data?.questions?.map((q: any) => ({
        question_title: q.question_title,
        answers: answers
          .filter((a) => a.questionID === q.id)
          .map((a) => ({
            type: a.type,
            value: a.value,
            action_level:a?.action_level,
            options:
              a.type === "mcq" || a.type === "checkbox"
                ? q.question_fields
                    ?.filter((f: any) => f.type === a.type)
                    ?.flatMap((f: any) => f.question_field_options || [])
                    ?.filter((opt: any) => opt && Object.keys(opt).length > 0)
                : [],
          })),
      })),
    };
    
    
    
    
    console.error("Answers ready to send:", payload);
    // ===== SUBMIT ANSWERS
    if(isPending){
      setIsSubmiLoading(false);
      setShowValidationPopup(true);
      setValidationPopupMSG("Can't Send Duplecate Data")
      return false;
    }
    submitAnswers(payload,{
      onSuccess:()=>{
        // ===== UPDATE SCORE
        updateTaskScore({ task_id:task_id!, score: JSON.stringify({finalScore,templateScore,percentage:`${Math.floor((100*(templateScore/finalScore)))}%`}) },
        {
          onSuccess:()=>{
            // ===== UPDATE STATUS
            updateTaskStatus({ task_id:task_id!, status: "Completed" },
              {
                onSuccess:()=>{
                  router.replace(`/${Current_lang}/Screens/dashboard/tasks`);
                }
              }
            )
          }
        }
      )
      
    },
    onError:(e)=>{
      setIsSubmiLoading(false);
      setShowValidationPopup(true);
      setValidationPopupMSG(`${e}`);
    }
  });   
}

// function handelSaveAsDraft(){
//   setIsSubmiLoading(true);

//   if(!info?.id){
//     setIsSubmiLoading(false);
//     setShowValidationPopup(true);
//     setValidationPopupMSG(`001`);
//     return false;
//   }
//   if(!answers){
//     setIsSubmiLoading(false);
//     setShowValidationPopup(true);
//     setValidationPopupMSG(`002`);
//     return false;
//   }
//   if(answers.length == 0){
//     setIsSubmiLoading(false);
//     setShowValidationPopup(true);
//     setValidationPopupMSG(`003`);
//     return false;
//   }
//   if(!task_id){
//     setIsSubmiLoading(false);
//     setShowValidationPopup(true);
//     setValidationPopupMSG(`004`);
//     return false;
//   }
//   saveDraft({
//     task_id:task_id??-1,
//     draft:JSON?.stringify(answers??{}),
//     drafted_by:info?.id??-1
//   },{
//     onSuccess:()=>{
//       setIsSubmiLoading(false);
//       setIsDrafted(true);
//     },
//     onError:()=>{
//       setIsSubmiLoading(false);
//       setShowValidationPopup(true);
//       setValidationPopupMSG(`Can't Draft this template , try again later`);
//     },
//   });
   
// }

React.useEffect(() => {
  if (data) {
    const fieldCounts = data?.questions?.reduce((acc: Record<string, number>, question: QuestionType) => {
      question.question_fields.forEach((field) => {
        if (field.type === "mcq" || field.type === "score") {
          acc[field.type] = (acc[field.type] || 0) + 1;
        }
      });
      return acc;
    }, {});
    
    const totalMcqAndScore = (fieldCounts.mcq || 0) + (fieldCounts.score || 0);
    const maxPossible = totalMcqAndScore * 5;
    
    setFinalScore(maxPossible); // ✅ الفاينال يبدأ من أعلى درجة
  }
}, [data]);
// if(isError)  return <div>حدث خطأ</div>;
if (isLoading) return <SkeletonLoader/>;
if (error) return <div>حدث خطأ: {(error as Error).message}</div>;
if (!data) return <div>لا توجد بيانات</div>;
// ✅ عدّ الحقول mcq و score بس
const fieldCounts = data?.questions?.reduce((acc: Record<string, number>, question: QuestionType) => {
    question.question_fields.forEach((field) => {
      if (field.type === "mcq" || field.type === "score") {
        acc[field.type] = (acc[field.type] || 0) + 1;
      }
    });
    return acc;
  }, {});


  const Questions = questions.map((question: QuestionType, index: number) => (
    <QuestionAnswerTemplateComponent
      key={index}
      questionNumber={index + 1}
      title={question.question_title}
      fields={question.question_fields}
      questionID={question.id}
      task_id={task_id??-1}
      admin_id={targetId ?? -1}
      userID={info?.id ?? -1}
      onAnswerChange={handleAnswerChange as (newAnswer: any) => void}
      answers={answers}
    />
  ));

  return (
    <div>
      {isSubmitLoading&&<Popup
          icon={
            <Lottie
            animationData={LoadingIcon}
            loop={true}
            style={{ width: 350, height: 250 }}
          />
          } 
          title={"loading..."} 
          subTitle=" " 
          onClose={()=>{}}/>}
      {showValidationPopup&&<Popup icon={<Lottie animationData={WorngIcon} loop={false} style={{ width: 350, height: 250 }}/>} title="Wrong!" subTitle={ValidationPopupMSG} onClose={()=>setShowValidationPopup(false)}/>}
      {isDrafted&&<Popup  title="Drafted" subTitle={`Your Answers Was Drafted`} onClose={()=>setIsDrafted(false)}/>}
      {showPopup&&<Popup  title="Score" subTitle={`${Math.floor((100*(templateScore/finalScore)))}%`} onClose={()=>setShowPopup(false)}/>}
      <nav className={Styles.nav}>
        <span>{title}</span>
        <div style={{ margin: "0px 20px", padding: "10px", background: "#f0f0f0", borderRadius: "8px" }}>
          <p>Score: {templateScore} / {finalScore}</p> <span>{Math.floor((100*(templateScore/finalScore)))}%</span>
        </div>
        <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",columnGap:20}}>
        {/* <p onClick={handelSaveAsDraft} style={{color:"#444",border:"#444 1px solid",padding:'7px 15px',display:"flex",alignItems:"center",gap:10,marginBottom:10,borderRadius:5,cursor:"pointer"}}><FaFile /> {isDrafted?"Draft":"Drafted"}</p> */}
          <BottonComponent
            disabled={isPending}
            title="Submit"
            onClick={handelSubmit}
          />
        </div>
      </nav>
      {Questions}

      {data?.questions.length >=2 &&(
      <nav className={Styles.nav}>
      <span>{title}</span>
      <div style={{ margin: "0px 20px", padding: "10px", background: "#f0f0f0", borderRadius: "8px" }}>
        <p>Score: {templateScore} / {finalScore}</p> <span>{Math.floor((100*(templateScore/finalScore)))}%</span>
      </div>
      <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:20}}>
      {/* <p onClick={handelSaveAsDraft} style={{color:"#444",border:"#444 1px solid",padding:'7px 15px',display:"flex",alignItems:"center",gap:10,marginBottom:10,borderRadius:5,cursor:"pointer"}}><FaFile /> {isDrafted?"Draft":"Drafted"}</p> */}
        <BottonComponent
          disabled={isPending}
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
