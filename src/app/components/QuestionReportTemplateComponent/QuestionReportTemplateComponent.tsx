/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { CircularProgress} from '@mui/material';
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
import { pdfToImages } from "@/app/utils/pdfToImages";


// import { Answer } from '../../Types/AnswerType';


interface answers {
  id: number;
  type: string;
  value?: string;
  report_fields_option_answers?:{ id: number; label: string; value: string | number }[];
  question_fields?: {question_field_options:{ id: number; label: string; value: string | number }[]};
}

interface props {
  questionNumber: number;
  title: string;
  answers: answers[];
}

function QuestionReportTemplateComponent({ questionNumber, title, answers }: props) {
  const [pdfImages, setPdfImages] = React.useState<Record<number, string[]>>({});
  const [loadingPdf, setLoadingPdf] = React.useState<Record<number, boolean>>({});
  const [showPdf,setShowPdf] = React.useState<boolean>(false);
  // === جلب الصور من PDF لو فيه ===
  // React.useEffect(() => {
  //   const fetchImages = async () => {
  //     const imagesMap: Record<number, string[]> = {};
  //     for (const ans of answers) {
  //       if (ans.type === "images" && ans.value) {
  //         try {
  //           const imgs = await pdfToImages(ans.value);
  //           imagesMap[ans.id] = imgs;
  //         } catch (err) {
  //           console.error("Error loading PDF:", err);
  //         }
  //       }
  //     }
  //     setPdfImages(imagesMap);
  //   };

  //   fetchImages();
  // }, [answers]);
  React.useEffect(() => {
    const fetchImages = async () => {
      const imagesMap: Record<number, string[]> = {};
      const loadingMap: Record<number, boolean> = {};
  
      for (const ans of answers) {
        if (ans.type === "images" && ans.value) {
          // ✅ أول ما نبدأ تحميل نخلي اللودر ظاهر
          loadingMap[ans.id] = true;
          setLoadingPdf((prev) => ({ ...prev, ...loadingMap }));
  
          try {
            const imgs = await pdfToImages(ans.value);
  
            imagesMap[ans.id] = imgs;
          } catch (err) {
            console.error("Error loading PDF:", err);
          } finally {
            // ✅ بعد ما اللوب يخلص (الـ pdfToImages ترجع) نشيل اللودر
            loadingMap[ans.id] = false;
            setLoadingPdf((prev) => ({ ...prev, ...loadingMap }));
            setPdfImages((prev) => ({ ...prev, ...imagesMap }));
          }
        }
      }
    };
  
    fetchImages();
  }, [answers]);
  
  


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
                            disabled 
                            label="Answer" value={ans.value ?? "-"}  
                            type="text" placeholder=""  onTyping={()=>{}} />;
            case "comment":
              return <InputComponent
                        disabled 
                        label="comment" value={ans.value ?? "-"}  
                        type="text" placeholder=""  onTyping={()=>{}} />;
            case "action":
              return <InputComponent
                          disabled 
                          label="action" value={ans.value ?? "-"}  
                          type="text" placeholder=""  onTyping={()=>{}} />;
            case "number":
              return <InputComponent 
                        disabled
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
                            (ans?.report_fields_option_answers?? []).map(opt => ({
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

            case "users_list":
              return (
                <div key={ans.id} className={Styles.AnswerItem}>
                  <strong>Checked Users:</strong>
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

            case "assets_list":
              return (
                <div key={ans.id} className={Styles.AnswerItem}>
                  <strong>Checked Assets:</strong>
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
                  {/* صور من pdf */}
                  <strong>Images:</strong>
                  <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",marginTop:5,marginBottom:20}}>
                    {loadingPdf[ans.id]&&<CircularProgress className={Styles.laoder} size={25} />}
                    {pdfImages[ans.id]?.map((src, i) => (
                      <img key={i} style={{width:100,height:100,borderRadius:5}} loading="lazy" src={src} alt={`page-${i}`} />
                    ))}
                  </div>
                    {/* <strong>PDF:</strong> */}
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
                          {showPdf ? "Hide Pdf" : "Show as Pdf"}
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


