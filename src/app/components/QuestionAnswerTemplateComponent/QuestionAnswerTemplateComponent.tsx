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
  action_level:string|null,
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


    // const [actionLevels,setActionLevels] = React.useState<Record<number, string>>({});



  
    // 📝 function بترجع القيمة الحالية لأي field
    const getFieldValue = (fieldID: number) => {
      const ans = answers.find(
        (a) => a.questionID === questionID && a.fieldID === fieldID
      );
      console.log(ans?ans.value:"")
      return ans ? ans.value : "";
    };

    console.log("answers >>> ",answers)
  
    return (
      <div className={Styles.Question}>
        <h2>
          {questionNumber}. {title} 
        </h2>
  
        <div className={Styles.QuestionAnswers} >
          {sortedFields.map((field) => {

            const  handleChange = async (value: unknown,action_level:string|null = null) => {
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
                    action_level:action_level
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
                    // defaultValue={Number(currentValue+"")}
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
                // const currentLevel = actionLevels[field.id] || "";
                return (
                  <div key={field.id}>
                    <InputComponent                   
                      isTextArea
                      label="Actions"
                      placeholder="Follow up notes*"
                      value={typeof currentValue === "string" ? currentValue : ""}
                      onTyping={(textValue) => {
                        // هنا بنبعت text + action_level
                        handleChange(
                          textValue,
                          "Medium"
                        );
                      }}
                    />
                     {/* Radio buttons تحت الـ input */}
                    {/* <div style={{ margin: "8px 0px 30px" ,display:"flex"}}>
                      {["Medium", "Low", "High"].map((filter, idx) => (
                        <label key={idx} style={{ margin: "16px" ,display:"flex",gap:"5px" }}>
                          <input
                            type="radio"
                            name={`action_filter_${field.id}`}
                            value={filter}
                            // checked={currentLevel === filter}
                            // checked={actionLevels[field.id] === filter}
                            checked={currentLevel === filter}
                            // checked لو عايز تحدد قيمة افتراضية
                            onChange={(e) => {
                              const level = e.target.value;
              
                              // خزّن القيمة
                              setActionLevels((prev) => ({ ...prev, [field.id]: level }));
              
                              // ابعت فورًا مع القيمة الحالية
                              handleChange(
                                currentValue,
                                level
                              );
                            }}
                          />
                          {filter}
                        </label>
                      ))}
                    </div> */}
                  </div>
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
                    // defaultValue={String(currentValue)}
                    onChange={handleChange}
                    defaultValue={String(currentValue)}
                  />
                );
  
              case "time":
                return (
                  <TimeInputComponent
                    key={field.id}
                    onChange={handleChange}
                    defaultValue={String(currentValue)}
                  />
                );
  
              case "date_time":
                return (
                  <DateTimeInputComponent
                    key={field.id}
                    onChange={handleChange}
                    defaultValue={String(currentValue)}
                    // value={currentValue}
                  />
                );
  
              case "location":
                let locationValue = { lat: "", long: "" };
                try {
                  if (currentValue && typeof currentValue === "string" && currentValue.trim() !== "") {
                    locationValue = JSON.parse(currentValue);
                  }
                } catch (error) {
                  console.error("Error parsing location value:", error);
                  locationValue = { lat: "", long: "" };
                }
                return (
                  <LocationInputComponent
                    key={field.id}
                    label="Location"
                    placeholder=""
                    value={locationValue}
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
                let checkboxValue: any = [];
                try {
                  if (currentValue && typeof currentValue === "string" && currentValue.trim() !== "") {
                    checkboxValue = JSON.parse(currentValue);
                  }
                } catch (error) {
                  console.error("Error parsing checkbox value:", error);
                  checkboxValue = [];
                }
                return (
                  <CheckBoxListComponent
                    key={field.id}
                    list={field.question_field_options}
                    defaultValue={checkboxValue}
                    onChange={handleChange}
                    
                  />
                );

              case "users_list":{
                  // نحاول نقرأ القيم المحفوظة في الداتا
                let parsedValues: string[] = [];
                try {
                  if (currentValue && typeof currentValue === "string" && currentValue.trim() !== "") {
                    parsedValues = JSON.parse(currentValue);
                  }
                } catch (error) {
                  console.error("Error parsing users_list value:", error);
                  parsedValues = [];
                }

                // نجهز الـ list اللي جاي من اليوزرز
                const users = mapToOptions(
                  usersList?.data?.length ? usersList.data : [{ id: 0, full_name: "No Users" }],
                  "full_name",
                  "full_name",
                  "id"
                );

                // نجهز الـ defaultOptions اللي هتكون متعلمة افتراضياً
                const defaultOptions =
                  users.filter((u: any) => parsedValues.includes(u.value)) ?? [];
                return (
                  <MultiDropListComponent 
                      key={field.id}
                      label="Users List" 
                      placeholder="Choose From Users List"
                      list={
                        mapToOptions(
                          (usersList?.data?.length ? usersList.data : [{id:0,full_name:"No Users"}]),
                          "full_name",
                          "full_name",
                          "id"
                        )
                      }
                      values={defaultOptions}
                      onSelect={handleChange}
                   />
                );
              }

              case "assets_list":{
                                  // نحاول نقرأ القيم المحفوظة في الداتا
                let parsedValues: string[] = [];
                try {
                  if (currentValue && typeof currentValue === "string" && currentValue.trim() !== "") {
                    parsedValues = JSON.parse(currentValue);
                  }
                } catch (error) {
                  console.error("Error parsing assets_list value:", error);
                  parsedValues = [];
                }

                // نجهز الـ list اللي جاي من اليوزرز
                const assets = mapToOptions(
                  assetsList?.data?.length ? assetsList.data : [{ id: 0, asset_name: "No Users" }],
                  "asset_name",
                  "asset_name",
                  "id"
                );

                // نجهز الـ defaultOptions اللي هتكون متعلمة افتراضياً
                const defaultOptions =
                assets.filter((u: any) => parsedValues.includes(u.value)) ?? [];

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
                  values={defaultOptions}
                  onSelect={handleChange}
                  />
                );
              }
  
              case "score":
                return (
                  <ScoreInputComponent
                    key={field.id}
                    defaultValue={String(currentValue)}
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
