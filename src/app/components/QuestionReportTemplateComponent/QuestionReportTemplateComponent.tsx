"use client";
import React from 'react'
import Styles from './QuestionReportTemplateComponent.module.css'


import Text from './ReportTemplateComponents/Text';


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

function QuestionReportTemplateComponent({questionNumber,title,answers}:props) {

    function getFieldByType(answers: unknown[], type: string): any | null {
        return answers.find(
            (f) =>
                typeof f === "object" &&
                f !== null &&
                "type" in f &&
                (f as { type: string }).type === type
        ) || null;
    }
    const NumberField = getFieldByType(answers,'number');
    const ShortTextField = getFieldByType(answers,'short_text');
    const CommentField = getFieldByType(answers,'comment');
    const ActionField = getFieldByType(answers,'action');

    const SingleChoiceField  = getFieldByType(answers,'single');
    const CheckboxField = getFieldByType(answers,'checkbox');

    const ImagesField = getFieldByType(answers,'images');
    const DateRangeField = getFieldByType(answers,'date_range');
    const DateTimeField = getFieldByType(answers,'date_time');
    const DateField = getFieldByType(answers,'date');
    const TimeField = getFieldByType(answers,'time');
    const ScoreField = getFieldByType(answers,'score');

  return (
    <div className={Styles.Question} >
      <h2>{questionNumber} - {title}</h2>
      {SingleChoiceField&& <Text label='' value=''/>}
      {CheckboxField&& <Text label='' value=''/>}

      {NumberField&& <Text label='Answer' value=''/>}
      {ShortTextField&& <Text label='Answer' value=''/>}
      {CommentField&& <Text label='Answer' value=''/>}
      {ActionField&& <Text label='Answer' value=''/>}


      {DateRangeField&& <Text label='DateRange' value=''/>}
      {DateTimeField&& <Text label='DateRange' value=''/>}
      {TimeField&& <Text label='DateRange' value=''/>}

      {ScoreField&& <Text label='DateRange' value={`${ScoreField.value}/5`}/>}

      
    </div>
  )
}

export default QuestionReportTemplateComponent


