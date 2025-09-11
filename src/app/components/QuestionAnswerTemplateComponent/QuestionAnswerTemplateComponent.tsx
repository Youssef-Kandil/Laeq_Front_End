"use client";
import React from "react";
import Styles from "./QuestionAnswerTemplateComponent.module.css";

import {
  InputComponent,
  ScoreInputComponent,
  SignatureInputComponent,
  LocationInputComponent,
//   DateRangeComponent,
  DateInputComponent,
  TimeInputComponent,
  DateTimeInputComponent,
  MultimageInputComponent,
} from "../global/InputsComponents";

// =============================
// 📝 Types
// =============================
interface OptionType {
  label: string;
  value?: number | string | null;
}

interface FieldType {
  id: number;
  type: string;
  options?: OptionType[];
}

// نفس الـ Answer اللي عندك في الأب
interface Answer {
  userID: number;
  questionID: number;
  fieldID: number;
  value: string;
  type: string;
}

// =============================
// 📝 خريطة الترتيب للحقول
// =============================
const fieldOrder: Record<string, number> = {
  number: 1,
  short_text: 2,
  comment: 3,
  action: 4,
  single: 5,
  checkbox: 6,
  images: 7,
  date_range: 8,
  date_time: 9,
  date: 10,
  time: 11,
  location: 12,
  signature: 13,
  score: 14,
};

// =============================
// 📝 function بترتب الحقول
// =============================
function sortFields(fields: FieldType[]): FieldType[] {
  return [...fields].sort(
    (a, b) => (fieldOrder[a.type] ?? 999) - (fieldOrder[b.type] ?? 999)
  );
}

// =============================
// 📝 الكومبوننت الرئيسي
// =============================
type QuestionProps = {
    questionNumber: number;
    title: string;
    fields: FieldType[];
    questionID: number;
    onAnswerChange: (newAnswer: Answer) => void;
    answers: Answer[]; // ✅ نضيف الاجابات الحالية
  };
  
  const QuestionAnswerTemplateComponent: React.FC<QuestionProps> = ({
    questionNumber,
    title,
    fields,
    questionID,
    onAnswerChange,
    answers,
  }) => {
    const sortedFields = sortFields(fields);
  
    // 📝 function بترجع القيمة الحالية لأي field
    const getFieldValue = (fieldID: number) => {
      const ans = answers.find(
        (a) => a.questionID === questionID && a.fieldID === fieldID
      );
      return ans ? ans.value : "";
    };
  
    return (
      <div className={Styles.Question}>
        <h2>
          {questionNumber}. {title} ?
        </h2>
  
        <div className="space-y-4">
          {sortedFields.map((field) => {
            const handleChange = (value: unknown) => {
              onAnswerChange({
                userID: 1, // مؤقت
                questionID,
                fieldID: field.id,
                value: typeof value === "string" ? value : JSON.stringify(value),
                type: field.type,
              });
            };
  
            const currentValue = getFieldValue(field.id); // ✅ نجيب القيمة الحالية
  
            switch (field.type) {
              case "number":
                return (
                  <InputComponent
                    key={field.id}
                    type="number"
                    label="Answer"
                    placeholder="Please enter your Answer"
                    value={currentValue} // ✅ بقت dynamic
                    onTyping={handleChange}
                  />
                );
  
              case "short_text":
                return (
                  <InputComponent
                    key={field.id}
                    label="Answer"
                    placeholder="Please enter your Answer"
                    value={currentValue}
                    onTyping={handleChange}
                  />
                );
  
              case "comment":
                return (
                  <InputComponent
                    key={field.id}
                    isTextArea
                    label="Comments"
                    placeholder="Please enter your comment"
                    value={currentValue}
                    onTyping={handleChange}
                  />
                );
  
              case "action":
                return (
                  <InputComponent
                    key={field.id}
                    isTextArea
                    label="Actions"
                    placeholder="Follow up notes*"
                    value={currentValue}
                    onTyping={handleChange}
                  />
                );
  
              case "images":
                return (
                  <MultimageInputComponent
                    key={field.id}
                    label="Photos"
                    placeholder="Upload Photo"
                    onChange={handleChange}
                    // value={currentValue} // ✅ لو الكومبوننت بيدعمها
                  />
                );
  
              case "date":
                return (
                  <DateInputComponent
                    key={field.id}
                    onChange={handleChange}
                    // value={currentValue}
                  />
                );
  
              case "time":
                return (
                  <TimeInputComponent
                    key={field.id}
                    onChange={handleChange}
                    // value={currentValue}
                  />
                );
  
              case "date_time":
                return (
                  <DateTimeInputComponent
                    key={field.id}
                    onChange={handleChange}
                    // value={currentValue}
                  />
                );
  
              case "location":
                return (
                  <LocationInputComponent
                    key={field.id}
                    label="Location"
                    placeholder=""
                    value={currentValue ? JSON.parse(currentValue) : { lat: "", long: "" }}
                    onChange={handleChange}
                  />
                );
  
              case "signature":
                return (
                  <SignatureInputComponent
                    key={field.id}
                    label="Signature"
                    placeholder=""
                    value={currentValue}
                    onChange={handleChange}
                  />
                );
  
              case "score":
                return (
                  <ScoreInputComponent
                    key={field.id}
                    // onChange={handleChange}
                    // value={currentValue}
                  />
                );
  
              default:
                return null;
            }
          })}
        </div>
      </div>
    );
  };
  

export default QuestionAnswerTemplateComponent;
