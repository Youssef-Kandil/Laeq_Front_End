"use client";
import React, { useState } from "react";
import Styles from "./AddNewTemplateForm.module.css";

import BottonComponent from "@/app/components/global/ButtonComponent/BottonComponent";
import QuestionFormComponent from "@/app/components/global/QuestionFormComponent/QuestionFormComponent";
import InputComponent from "@/app/components/global/InputComponent/InputComponent";


interface FieldType {
  id: string | number;
  type: string;
  options?: { id: string | number; label: string; value: any }[];
}

interface questionType {
  title: string;
  fields: FieldType[];
}

// ===== FORM CONTROLERS VARS ====
const MAX_QUESTIONS_LIMIT = 300;

function AddNewTemplateForm() {
  const [QuestionsList, setQuestionsList] = useState<questionType[]>([
    {
      title: "test question in laeq 365  web app?",
      fields: [{ id: 1, type: "short_text" }],
    },
  ]);

  const handleAddNewQuestion = () => {
    if (QuestionsList.length >= MAX_QUESTIONS_LIMIT) {
      alert(`You can only add up to ${MAX_QUESTIONS_LIMIT} questions.`);
      return;
    }

    setQuestionsList((prev) => [
      ...prev,
      {
        title: "",
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

  return (
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
        <InputComponent label="" placeholder="Please Enter Template Name" onTyping={()=>{}} value=""/>
        <div style={{ width: 100 }}>
          <BottonComponent title="Save" />
        </div>
      </section>
      {QuestionsList.map((question, i) => (
        <QuestionFormComponent
          key={i}
          index={i}
          title={question.title}
          fields={question.fields}
          onSubmitNewType={handleAddField}
          onRemoveField={handleRemoveField}
          onRemoveQuestion={QuestionsList.length > 1 ? () => handleRemoveQuestion(i) : undefined}
        />
      ))}
      <button style={{opacity:QuestionsList.length >= MAX_QUESTIONS_LIMIT?0.5:1}} className={Styles.addQuestionButton} onClick={handleAddNewQuestion}  disabled={QuestionsList.length >= MAX_QUESTIONS_LIMIT} type="button">
        + Add New Question
      </button>
    </div>
  );
}

export default AddNewTemplateForm;

