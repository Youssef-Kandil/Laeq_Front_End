/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Styles from "./EditeTemplate.module.css";

import BottonComponent from "@/app/components/global/ButtonComponent/BottonComponent";
import QuestionFormComponent from "@/app/components/global/QuestionFormComponent/QuestionFormComponent";
import InputComponent from "@/app/components/global/InputsComponents/InputComponent/InputComponent";
import { useEditTemplate  ,useGetTemplateDataByID} from "@/app/Hooks/useTemplates"; 


import Popup from "@/app/components/global/Popup/Popup";
import Lottie from "lottie-react";
import WorngIcon  from '@/app/Lottie/wrong.json'
import LoadingIcon  from '@/app/Lottie/Loading animation blue.json'
import { useRouter,useParams } from "next/navigation";
import SkeletonLoader from "@/app/components/global/SkeletonLoader/SkeletonLoaders";


interface FieldType {
  id: string | number;
  type: string;
  options?: { id?: string | number; label: string; value: string }[];
}

interface questionType {
  question_title: string;
  fields: FieldType[];
}

// ===== FORM CONTROLERS VARS ====
const MAX_QUESTIONS_LIMIT = 300;

function EditTemplateForm() {
  const router = useRouter();
  const {template_id} = useParams();
  const {data:templateData,isLoading:dataLoading,isError} = useGetTemplateDataByID(Number(template_id)??-1);
  const {mutate:editTemplate,isPending} = useEditTemplate();
//   const {mutate:sendTemplateDataToDB} = useCreateTemplate();
  const [isLoading,setIsLoading] = useState<boolean>(false);
  const [showPopup,setShowPopup] = useState<boolean>(false);
  const [showErrorPopup,setShowErrorPopup] = useState<boolean>(false);
  const [ErrorPopupMSG,setErrorPopupMSG] = useState<{title:string,subTitle:string}>({title:"",subTitle:""});
  const [templateName,setTemplateName] = useState<string>("");
  const [QuestionsList, setQuestionsList] = useState<questionType[]>([
    {
      question_title: "",
      fields: [{ id: 1, type: "short_text" }],
    },
  ])

  const transformed = templateData?.questions.map((q:any) => ({
    question_title: q.question_title,
    fields: q.question_fields.map((f: any) => ({
        id: f.id ?? Date.now(), // أو استخدم f.id لو موجود
        type: f.type,
        options: f.question_field_options?.map((opt: any) => ({
          label: opt.label,
          value: opt.value,
        })) ?? [],
      })),
  }));
  
  useEffect(()=>{
    setTemplateName(templateData?.template_title??"");
    setQuestionsList(transformed??[    {
        question_title: "",
        fields: [{ id: 1, type: "short_text" }],
      }])
    
  },[templateData])

  if(dataLoading)  return <SkeletonLoader/>
  if(isError)  return <p>Oops! Can not Get Data Write Now Try again Later</p>

  const handleUpdateQuestionTitle = (index: number, newTitle: string) => {
    setQuestionsList((prev) =>
      prev.map((q, i) =>
        i === index ? { ...q, question_title: newTitle } : q
      )
    );
  };

  const handleAddNewQuestion = () => {
    if (QuestionsList.length >= MAX_QUESTIONS_LIMIT) {
      alert(`You can only add up to ${MAX_QUESTIONS_LIMIT} questions.`);
      return;
    }

    setQuestionsList((prev) => [
      ...prev,
      {
        question_title: "",
        fields: [{ id: Date.now(), type: "short_text" }],
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestionsList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddField = (questionIndex: number, field: FieldType) => {
    setQuestionsList((prev) =>
      prev.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              fields: [...q.fields, field],
            }
          : q
      )
    );
  };

  const handleRemoveField = (questionIndex: number, fieldId: string | number) => {
    setQuestionsList((prev) =>
      prev.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              fields: q.fields.filter((f) => f.id !== fieldId),
            }
          : q
      )
    );
  };


  const handelSubmit = () => {
    setIsLoading(true);
    // 1. Validate template title
    const templateTitle = templateName.trim(); // لازم تعمل state للتايتل
    if (!templateTitle) {
      setIsLoading(false);
      setShowErrorPopup(true);
      setErrorPopupMSG({
        title:"Template title is required.",
        subTitle:"Please enter a valid template name."
      });
      return;
    }
  
    // 2. Validate that at least one question exists
    if (QuestionsList.length === 0) {
      setIsLoading(false);
      setShowErrorPopup(true);
      setErrorPopupMSG({
        title:"At least one question is required.",
        subTitle:""
      });
      return;
    }
  
    // 3. Validate every question title
    const invalidQuestionIndex = QuestionsList.findIndex(
      (q) => !q.question_title || !q.question_title.trim()
    );
    if (invalidQuestionIndex !== -1) {
      setIsLoading(false);
      setShowErrorPopup(true);
      setErrorPopupMSG({
        title:"Question Title Required",
        subTitle:`Question Number ${invalidQuestionIndex + 1} must have a valid title.`
      });
      return;
    }

    // 4. Validate that Checklist_id exists
    if (!template_id) {
      setIsLoading(false);
      setShowErrorPopup(true);
      setErrorPopupMSG({
        title:"Wrong!",
        subTitle:"try again"
      });
      return;
    }

    const payload = {
        id: Number(template_id),
        checklist_id: templateData?.checklist_id ?? -1, // لو عندك الـ checklist_id جاي من الـ templateData
        template_title: templateName,
        questions: QuestionsList.map((q, qIndex) => ({
          template_id: Number(template_id),
          question_title: q.question_title,
          fields: q.fields.map((f) => ({
            question_id: qIndex + 1, // أو لو عندك id فعلي من السيرفر، استخدمه بدل ده
            type: f.type,
            options:
              f.options?.map((opt) => ({
                label: opt.label,
                value: opt.value,
              })) ?? [],
          })),
        })),
      };
      
  
    // ✅ Passed validation
    editTemplate(payload,{
        onSuccess:()=>{
                router.back();
        },
        onError:()=>{
            setIsLoading(false);
            setShowErrorPopup(true);
            setErrorPopupMSG({
              title:"Wrong!",
              subTitle:`Failed to Update checklist template`
            });
        },
    })
    console.log("QuestionsList :: ", QuestionsList);
  };
  

  return (
    <div>
      {isLoading&&<Popup
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

      {showPopup&&<Popup title={"Congratulations!"} subTitle="Your template has been added successfully." btnTitle="Go To Templates List" btnFunc={()=>{setShowPopup(false)}} onClose={()=>{}}/>}
      {showErrorPopup&&<Popup 
              icon={
                <Lottie
                animationData={WorngIcon}
                loop={false}
                style={{ width: 150, height: 150 }}
              />
              } 
              title={ErrorPopupMSG.title} 
              subTitle={ErrorPopupMSG.subTitle} 
              btnTitle="Ok" 
              btnFunc={()=>{setShowErrorPopup(false)}} 
              onClose={()=>{setShowErrorPopup(false)}}/>}
    <div className={Styles.container}>
      
      <section 
        style={{ 
          display:'flex',
          alignItems:'center',
          justifyContent:'space-between',
          flexWrap:'wrap',
          gap:20,
          width: '100%',
          background: 'rgb(255, 249, 249)',
          padding: '0px 10px',
          // position: 'fixed',
          // top: '10%', 
          // zIndex: 1000 
        }}>
        <InputComponent label="" placeholder="Please Enter Template Name" onTyping={(txt)=>setTemplateName(txt)} value={templateName}/>
        <div style={{ width: 100 }}>
          <BottonComponent disabled={isPending} onClick={handelSubmit} title="Edit" />
        </div>
      </section>
      {QuestionsList.map((question, i) => (
        <QuestionFormComponent
          key={i}
          index={i}
          title={question.question_title}
          fields={question.fields}
          onSubmitNewType={handleAddField}
          onRemoveField={handleRemoveField}
          onRemoveQuestion={QuestionsList.length > 1 ? () => handleRemoveQuestion(i) : undefined}
          onUpdateTitle={handleUpdateQuestionTitle}
        />
      ))}
      <button style={{opacity:QuestionsList.length >= MAX_QUESTIONS_LIMIT?0.5:1}} className={Styles.addQuestionButton} onClick={handleAddNewQuestion}  disabled={QuestionsList.length >= MAX_QUESTIONS_LIMIT} type="button">
        + Add New Question
      </button>
    </div>
    </div>
  );
}

export default EditTemplateForm;

