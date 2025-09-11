"use client";
import React, { useState } from "react";
import Styles from "./answerTemplate.module.css";
import { useParams } from "next/navigation";
import { QuestionType } from "@/app/Types/checklistTypes";
import QuestionAnswerTemplateComponent from "@/app/components/QuestionAnswerTemplateComponent/QuestionAnswerTemplateComponent";
import BottonComponent from "@/app/components/global/ButtonComponent/BottonComponent";
import { useGetQuestionsByTemplatesId } from "@/app/Hooks/useTemplateQuestions";

// نوع البيانات اللي هتتبعت للباك
interface Answer {
  userID: number;
  questionID: number;
  fieldID: number;
  value: string;
  type: string;
}

function AnswerTemplate() {
  const params = useParams();
  const { answerTemplate: templateID } = params;

  let title: string | undefined = undefined;
  let id: string | number | undefined = undefined;

  if (templateID) {
    const raw = Array.isArray(templateID) ? templateID[0] : templateID;
    const lastDashIndex = raw.lastIndexOf("-");

    if (lastDashIndex !== -1) {
      const encodedTitle = raw.slice(0, lastDashIndex);
      const rawId = raw.slice(lastDashIndex + 1);

      title = decodeURIComponent(encodedTitle);
      id = isNaN(Number(rawId)) ? rawId : Number(rawId);
    }
  }

  const { data, isLoading, error } = useGetQuestionsByTemplatesId(Number(id));
  const [answers, setAnswers] = useState<Answer[]>([]);

  // استقبال اجابة من الابن
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

  if (isLoading) return <div>جاري التحميل...</div>;
  if (error) return <div>حدث خطأ: {(error as Error).message}</div>;
  if (!data) return <div>لا توجد بيانات</div>;

  const Questions = data.map((question: QuestionType, index: number) => (
    <QuestionAnswerTemplateComponent
      key={index}
      questionNumber={index + 1}
      title={question.question_title}
      fields={question.question_fields}
      questionID={question.id}
      onAnswerChange={handleAnswerChange}
      answers={answers}
    />
  ));

  return (
    <div>
      <nav className={Styles.nav}>
        <span>{title}</span>
        <div>
          <BottonComponent
            title="Send"
            onClick={() => {
              console.log("Answers ready to send:", answers);
              // هنا هتبعت الاجابات للباك
              // مثلا:
              // await axios.post("/api/answers", answers)
            }}
          />
        </div>
      </nav>
      {Questions}
    </div>
  );
}

export default AnswerTemplate;
