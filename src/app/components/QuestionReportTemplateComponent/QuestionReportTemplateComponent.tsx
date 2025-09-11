"use client";
import React from 'react'
import Styles from './QuestionReportTemplateComponent.module.css'




interface imagesType{
    urls?:string | null;
}

interface answers{
    id:number;
    type: string ;
    value?:string;
    images?:imagesType[];
}

interface props{
    questionNumber:number;
    title:string;
    answers:answers[];
}

function QuestionReportTemplateComponent({questionNumber,title}:props) {




  return (
    <div className={Styles.Question} >
      <h2>{questionNumber} - {title}</h2>
      
    </div>
  )
}

export default QuestionReportTemplateComponent


