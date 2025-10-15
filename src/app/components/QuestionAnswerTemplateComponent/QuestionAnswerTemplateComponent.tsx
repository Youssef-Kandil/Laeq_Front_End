/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import Styles from "./QuestionAnswerTemplateComponent.module.css";
import { useAssetsByAdmin } from "@/app/Hooks/useAssets";
import { useEmployees } from "@/app/Hooks/useEmployees";

import {
  InputComponent,
  ScoreInputComponent,
  CheckBoxListComponent,
  SignatureInputComponent,
  LocationInputComponent,
  SingleChoiceAnswer,
//   DateRangeComponent,
  DateInputComponent,
  TimeInputComponent,
  DateTimeInputComponent,
  MultimageInputComponent,
} from "../global/InputsComponents";
import { AccountInfo } from "@/app/Types/AccountsType";
import { getAdminAccountInfo } from "@/app/utils/getAccountInfo";

import MultiDropListComponent from "../global/InputsComponents/MultiDropListComponent/MultiDropListComponent";




// =============================
// 📝 Types
// =============================
interface OptionType {
  id?:number;
  label: string;
  value:string ;
}

interface FieldType {
  id: number;
  type: string;
  question_field_options: OptionType[];
}

// نفس الـ Answer اللي عندك في الأب
interface Answer {
  userID: number;
  task_id?:number;
  admin_id?:number;
  company_id:number;
  site_id:number;
  questionID: number;
  fieldID: number;
  value: string | Blob;
  type: string;
}

// =============================
// 📝 خريطة الترتيب للحقول
// =============================
const fieldOrder: Record<string, number> = {
  mcq: 1,
  short_text: 2,
  number: 3,
  comment:4,
  action: 5,
  images: 6,
  date_range: 7,
  date_time: 8,
  date: 9,
  time: 10,
  location: 11,
  signature: 12,
  checkbox: 13,
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
    userID: number;
    task_id: number;
    admin_id: number;
    onAnswerChange: (newAnswer: Answer) => void;
    answers: Answer[]; // ✅ نضيف الاجابات الحالية
  };

  // =============================
// 📝 بنعمل اعادة تشكيل لشكل الداتا عشان تناسب التشك بوكس
// =============================

  function mapToOptions<T extends Record<string, any>>(
    arr: T[],
    labelKey: keyof T,
    valueKey?: keyof T,
    idKey?: keyof T
  ): any {
    return arr.map((item) => ({
      // label: String(item[labelKey]),
      title: String(item[labelKey]),
      value: valueKey ? String(item[valueKey]) : undefined,
      id: idKey ? Number(item[idKey]) : undefined,
    }));
  }
  
  const QuestionAnswerTemplateComponent: React.FC<QuestionProps> = ({
    questionNumber,
    title,
    fields,
    questionID,
    userID,
    task_id,
    admin_id,
    onAnswerChange,
    answers,
  }) => {
    const info = getAdminAccountInfo("AccountInfo") as AccountInfo | null;
    const isEmployee = info?.role === "employee";    
    const targetId  =
            isEmployee
              ? info?.userDetails?.admin_id
              : info?.userDetails?.id;
    const usersList = useEmployees(targetId??-1);
    const assetsList = useAssetsByAdmin(targetId??-1);
    const sortedFields = sortFields(fields);
  
    // 📝 function بترجع القيمة الحالية لأي field
    const getFieldValue = (fieldID: number) => {
      const ans = answers.find(
        (a) => a.questionID === questionID && a.fieldID === fieldID
      );
      console.log(ans?ans.value:"")
      return ans ? ans.value : "";
    };
  
    return (
      <div className={Styles.Question}>
        <h2>
          {questionNumber}. {title} 
        </h2>
  
        <div className="space-y-4">
          {sortedFields.map((field) => {
            const  handleChange = async (value: unknown) => {
                console.log("Value ::: ", value);
                if(value !== undefined){
                    const processedValue =
                    value instanceof Blob ? value : typeof value === "string" ? value : JSON.stringify(value);
                  onAnswerChange({
                    userID, // مؤقت
                    task_id,
                    admin_id,
                    questionID,
                    company_id:-1,
                    site_id:-1,
                    fieldID: field.id,
                    value: processedValue,
                    type: field.type,
                  });
                };
            }
  
            const currentValue = getFieldValue(field.id); // ✅ نجيب القيمة الحالية
  
            switch (field.type) {
              case "mcq":
                return (
                  <SingleChoiceAnswer
                    key={field.id}
                    options={field.question_field_options}
                    onChoose={(val)=>handleChange(val)}
                  />
                );

              case "number":
                return (
                  <InputComponent
                    key={field.id}
                    type="number"
                    label="Answer"
                    placeholder="Please enter your Answer"
                    value={typeof currentValue === "string" ? currentValue : ""} // ✅ بقت dynamic
                    onTyping={handleChange}
                  />
                );
  
              case "short_text":
                return (
                  <InputComponent
                    key={field.id}
                    label="Answer"
                    placeholder="Please enter your Answer"
                    value={typeof currentValue === "string" ? currentValue : ""}
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
                    value={typeof currentValue === "string" ? currentValue : ""}
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
                    value={typeof currentValue === "string" ? currentValue : ""}
                    onTyping={handleChange}
                  />
                );
  
              case "images":
                return (
                  <MultimageInputComponent
                    key={field.id}
                    label="Photos"
                    placeholder="Upload Photo"
                    asPdf={true}
                    onChange={(_,blobs)=>handleChange(blobs[0])}
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
                    value={currentValue ? JSON.parse(typeof currentValue === "string" ? currentValue : "") : { lat: "", long: "" }}
                    onChange={handleChange}
                  />
                );
  
              case "signature":
                return (
                  <SignatureInputComponent
                    key={field.id}
                    label="Signature"
                    placeholder=""
                    value={typeof currentValue === "string" ? null : currentValue}
                    onChange={handleChange}
                  />
                );

              case "checkbox":
                return (
                  <CheckBoxListComponent
                    key={field.id}
                    list={field.question_field_options}
                    onChange={handleChange}
                  />
                );

              case "users_list":
                return (
                  <MultiDropListComponent 
                      key={field.id}
                      label="Users List" 
                      placeholder="Choose From Users List"
                      // list={mapToOptions(usersList?.data??[{id:0,full_name:"No Users"}],"full_name","full_name", "id")}
                      list={
                        mapToOptions(
                          (usersList?.data?.length ? usersList.data : [{id:0,full_name:"No Users"}]),
                          "full_name",
                          "full_name",
                          "id"
                        )
                      }
                      onSelect={handleChange}
                   />
                );

              case "assets_list":
                return (
                  <MultiDropListComponent 
                  key={field.id}
                  label="Assets List" 
                  placeholder="Choose From Assets List"
                  list={
                    mapToOptions(
                      (assetsList?.data?.length ? assetsList.data : [{ id: 0, asset_name: "No Assets" }]),
                      "asset_name",
                      "asset_name",
                      "id"
                    )
                  }
                  onSelect={handleChange}
               />
                  // <CheckBoxListComponent
                  //   key={field.id}
                    
                  //   list={mapToOptions(assetsList?.data??[],"asset_name","asset_name")}
                  //   onChange={handleChange}
                  // />
                );
  
              case "score":
                return (
                  <ScoreInputComponent
                    key={field.id}
                    onChange={handleChange}
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
