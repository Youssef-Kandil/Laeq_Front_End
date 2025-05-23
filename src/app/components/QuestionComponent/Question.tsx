"use client";
import React from 'react'
import Styles from './question.module.css'


import SingleChoiceAnswer from '../SingleChoiceAnswer/SingleChoiceAnswer';
import ScoreInputComponent from '../global/ScoreInputComponent/ScoreInputComponent';
import InputComponent from '../global/InputComponent/InputComponent';
import MultimageInputComponent from '../global/MultimageInputComponent/MultimageInputComponent';
import CheckBoxListComponent from '../global/CheckBoxListComponent/CheckBoxListComponent';



interface opthionsType{
    label:string;
    value?:number
}

interface fieldType{
    id:number;
    type: string ;
    options?:opthionsType[];
}

interface props{
    questionNumber:number;
    title:string;
    fields:fieldType[];
}

function Question({questionNumber,title,fields}:props) {


    function getFieldByType(fields: unknown[], type: string): any | null {
        return fields.find(
            (f) =>
                typeof f === "object" &&
                f !== null &&
                "type" in f &&
                (f as { type: string }).type === type
        ) || null;
    }

    const NumberField = getFieldByType(fields,'number');
    const ShortTextField = getFieldByType(fields,'short_text');
    const CommentField = getFieldByType(fields,'comment');
    const ActionField = getFieldByType(fields,'action');

    const SingleChoiceField  = getFieldByType(fields,'single');
    const CheckboxField = getFieldByType(fields,'checkbox');

    const ImagesField = getFieldByType(fields,'images');
    const DateRangeField = getFieldByType(fields,'date_range');
    const DateTimeField = getFieldByType(fields,'date_time');
    const DateField = getFieldByType(fields,'date');
    const TimeField = getFieldByType(fields,'time');



  return (
    <div className={Styles.Question} >
      <h2>{questionNumber} - {title}</h2>
      {SingleChoiceField&&  <SingleChoiceAnswer options={SingleChoiceField.options ?? []}/>}
      {ImagesField&&  <MultimageInputComponent label='Photos' placeholder='Upload Photo'/>}
      {CheckboxField&& <CheckBoxListComponent list={CheckboxField.options?? []} />}
      {NumberField&&<InputComponent
                            label='Answer'
                            placeholder='Please enter your Answer'
                            value=''
                            type='number'
                            onTyping={()=>{}}
                       />}
      {ShortTextField&&<InputComponent
                            label='Answer'
                            placeholder='Please enter your Answer'
                            value=''
                            onTyping={()=>{}}
                       />}
      {CommentField&&<InputComponent
                            isTextArea={true}
                            label='Comments'
                            placeholder='Please enter your comment'
                            value=''
                            onTyping={()=>{}}
                       />}
      {ActionField&&<InputComponent
                            isTextArea={true}
                            label='Actions'
                            placeholder='Follow up notes*'
                            value=''
                            onTyping={()=>{}}
                       />}


        <ScoreInputComponent/>
    </div>
  )
}

export default Question
