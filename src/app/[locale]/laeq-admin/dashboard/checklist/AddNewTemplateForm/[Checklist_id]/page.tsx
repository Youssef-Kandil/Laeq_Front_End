"use client";
import React, { useState } from "react";
import Styles from "./AddNewTemplateForm.module.css";

import BottonComponent from "@/app/components/global/ButtonComponent/BottonComponent";
import QuestionFormComponent from "@/app/components/global/QuestionFormComponent/QuestionFormComponent";
import InputComponent from "@/app/components/global/InputsComponents/InputComponent/InputComponent";
import { useCheckList, useCreateTemplate } from "@/app/Hooks/useCheckList";

import Popup from "@/app/components/global/Popup/Popup";
import Lottie from "lottie-react";
import WorngIcon  from '@/app/Lottie/wrong.json'
import LoadingIcon  from '@/app/Lottie/Loading animation blue.json'
import { useRouter } from "next/navigation";
import { getAdminAccountInfo } from "@/app/utils/getAccountInfo";
import { AccountInfo } from "@/app/Types/AccountsType";
import DropListComponent from "@/app/components/global/InputsComponents/DropListComponent/DropListComponent";
import { DropListType } from "@/app/Types/DropListType";


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

function AddNewTemplateForm() {
  const router = useRouter();
  const info = getAdminAccountInfo("AccountInfo") as AccountInfo | null;
  const admin_id =  info?.userDetails?.id ?? -1;
  const CheckLists = useCheckList(admin_id?? -1);
  const [SelectedChecklist,setSelectedChecklist] = React.useState<DropListType|null>(null)
  const {mutate:sendTemplateDataToDB} = useCreateTemplate();
  const [isLoading,setIsLoading] = useState<boolean>(false);
  const [showPopup,setShowPopup] = useState<boolean>(false);
  const [showErrorPopup,setShowErrorPopup] = useState<boolean>(false);
  const [ErrorPopupMSG,setErrorPopupMSG] = useState<{title:string,subTitle:string}>({title:"",subTitle:""});
  const [templateName,setTemplateName] = useState<string>("");
  const [QuestionsList, setQuestionsList] = useState<questionType[]>([
    {
      question_title: "",
      fields: [{ id: 1, type: "mcq",options:[{id:1,label:"Yes",value:"1"},{label:"No",value:"0"},{id:2,label:"N/A",value:"-1"}] }],
    },
  ]);

  const CheckLis_Categories_List = CheckLists.data?.map((item:{id:number,checklist_title:string}) => ({
    id: item?.id,
    value: String(item?.id),
    title: item.checklist_title,
  }))

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
    if (!SelectedChecklist) {
      setIsLoading(false);
      setShowErrorPopup(true);
      setErrorPopupMSG({
        title:"Wrong!",
        subTitle:"Must Select Check list Category"
      });
      return;
    }
  
    // ✅ Passed validation
    sendTemplateDataToDB({
      checklist_id:Number(SelectedChecklist?.id)??-1,
      template_title:templateName,
      questions:QuestionsList
    },{
      onSuccess:()=>{
        setIsLoading(false);
        setShowPopup(true);
        router.back();
      },
      onError:()=>{
        setIsLoading(false);
        setShowErrorPopup(true);
        setErrorPopupMSG({
            title: "Failed to add template",
            subTitle: "An error occurred while saving. Please try again."
        });
      }
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
        <div style={{minWidth:300,width:250}}>
              <DropListComponent label='Checklist Catecgory' placeholder='Choose Checklist Catecgory' list={CheckLis_Categories_List??[]}  onSelect={(val)=>{setSelectedChecklist(val)}}/>
        </div>
        <div style={{ width: 100 }}>
          <BottonComponent onClick={handelSubmit} title="Save" />
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

export default AddNewTemplateForm;

