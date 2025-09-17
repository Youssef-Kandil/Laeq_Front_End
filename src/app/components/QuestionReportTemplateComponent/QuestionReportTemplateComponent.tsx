/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import Styles from "./QuestionReportTemplateComponent.module.css";
import {
  InputComponent,
  ScoreInputComponent,
  // SignatureInputComponent,
  LocationInputComponent,
  SingleChoiceAnswer,
//   DateRangeComponent,
  DateInputComponent,
  TimeInputComponent,
  DateTimeInputComponent,
} from "../global/InputsComponents";


// import { Answer } from '../../Types/AnswerType';


interface answers {
  id: number;
  type: string;
  value?: string;
  question_fields?: {question_field_options:{ id: number; label: string; value: string | number }[]};
}

interface props {
  questionNumber: number;
  title: string;
  answers: answers[];
}

function QuestionReportTemplateComponent({ questionNumber, title, answers }: props) {
  const [showPdf,setShowPdf] = React.useState<boolean>(false);
  return (
    <div className={Styles.Question}>
      <h2>
        {questionNumber} - {title}
      </h2>

      <div className="space-y-4">
        {answers.map((ans) => {
          switch (ans.type) {
            case "short_text":
                return <InputComponent 
                            label="Answer" value={ans.value ?? "-"}  
                            type="text" placeholder=""  onTyping={()=>{}} />;
            case "comment":
              return <InputComponent 
                        label="comment" value={ans.value ?? "-"}  
                        type="text" placeholder=""  onTyping={()=>{}} />;
            case "action":
              return <InputComponent 
                          label="action" value={ans.value ?? "-"}  
                          type="text" placeholder=""  onTyping={()=>{}} />;
            case "number":
              return <InputComponent 
                        label="number" value={ans.value ?? "-"}  
                        type="text" placeholder=""  onTyping={()=>{}} />;
            case "time":
              return <TimeInputComponent defaultValue={ans.value ??"--:--"}  disabled onChange={()=>{}}/>;
            case "date":
              return <DateInputComponent defaultValue={ans.value ??"--:--"}  disabled onChange={()=>{}}/>;
            case "date_time":
              return <DateTimeInputComponent defaultValue={ans.value ??"--:--"}  disabled onChange={()=>{}}/>;
            case "date_range":
            case "location":
              return <LocationInputComponent label="Location" disabled={true}  value={JSON.parse(ans.value??"{}")} placeholder="" onChange={()=>{}} />;
            case "score":
                  return <ScoreInputComponent defaultValue={ans.value} disabled onChange={()=>{}}/>;
            case "mcq":
              return <SingleChoiceAnswer 
                          defaultValue={ans.value?Number(ans.value):-1}
                          options={
                            (ans?.question_fields?.question_field_options ?? []).map(opt => ({
                              ...opt,
                              value: String(opt.value)
                            }))
                          }
                          disabled />;

            case "checkbox":
              return (
                <div key={ans.id} className={Styles.AnswerItem}>
                  <strong>Checked:</strong>
                  <ul className={Styles.CheckboxList}>
                  {(ans.value
                      ? (JSON.parse(ans.value) as string[])
                      : []
                    ).map((opt: string, idx: number) => (
                      <li key={idx}>✔ {opt}</li>
                    ))}
                  </ul>
                </div>
              );

            case "images":
                return (
                  <div key={ans.id} className={Styles.AnswerItem}>
                    <strong>PDF:</strong>
                    {ans.value ? (
                      <>
                        <button
                          onClick={() =>{
                            if (ans?.value) {          
                              setShowPdf(!showPdf)
                            }
                          }}
                          className={Styles.PDF_Btn}
                        >
                          {showPdf ? "Hide Pdf" : "Show Pdf"}
                        </button>

                        {showPdf && (
                          <iframe
                            src={ans?.value?ans?.value:"#"}
                            width="100%"
                            height="500px"
                            style={{
                              border: "1px solid #ccc",
                              borderRadius: "8px",
                              marginTop: "10px",
                            }}
                          />
                        )}
                      </>
                    ) : (
                      <span>No Images Uploaded</span>
                    )}
                  </div>
                );


            case "signature":
              return (
                <div key={ans.id} className={Styles.AnswerItem}>
                  <strong>Signature:</strong>
                  {ans.value ? (
                    <img  src={ans?.value?ans.value as string : ""} loading='lazy'  alt="Signature IMAGE" />
                  ) : (
                    <span>-</span>
                  )}
                </div>
              );

            default:
              return (
                <p key={ans.id} className={Styles.AnswerItem}>
                  <strong>{ans.type}:</strong> {ans.value ?? "-"}
                </p>
              );
          }
        })}
      </div>
    </div>
  );
}

export default QuestionReportTemplateComponent;


