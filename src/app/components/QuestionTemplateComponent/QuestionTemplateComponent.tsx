"use client";
import React, { ReactNode } from 'react'
import Styles from './QuestionTemplateComponent.module.css'




import { TbNumber123 } from "react-icons/tb";
import { MdTextFields } from "react-icons/md";
import { BsChatRightText } from "react-icons/bs";
import { VscGithubAction } from "react-icons/vsc";

import { GiChoice } from "react-icons/gi";
import { RiListCheck3 } from "react-icons/ri";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";

import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import { MdEvent } from "react-icons/md";
import { MdDateRange } from "react-icons/md";
import { MdAccessTime } from "react-icons/md"; 

import { TfiPulse } from "react-icons/tfi";
import { FaMapLocationDot } from "react-icons/fa6";
import { PiSignatureDuotone } from "react-icons/pi";




interface opthionsType{
    label:string;
    value?: string | null
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

function QuestionTemplateComponent({questionNumber,title,fields}:props) {
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    const SingleChoiceField  = getFieldByType(fields,'mcq');
    const CheckboxField = getFieldByType(fields,'checkbox');

    const ImagesField = getFieldByType(fields,'images');
    const DateRangeField = getFieldByType(fields,'date_range');
    const DateTimeField = getFieldByType(fields,'date_time');
    const DateField = getFieldByType(fields,'date');
    const TimeField = getFieldByType(fields,'time');
    const ScoreField = getFieldByType(fields,'score');
    const LocationField = getFieldByType(fields,'location');
    const SignatureField = getFieldByType(fields,'signature');
  return (
    <div className={Styles.Question} >
      <h2>{questionNumber} - {title}</h2>

      <section className={Styles.list}>

        {NumberField&&<ButtonCard title='Number' icon={<TbNumber123/>}/>}
        {ShortTextField&&<ButtonCard title='Text' icon={<MdTextFields/>}/>}
        {CommentField&&<ButtonCard title='Comment' icon={<BsChatRightText size={16}/>}/>}
        {ActionField&&<ButtonCard title='Action' icon={<VscGithubAction/>}/>}

        {SingleChoiceField&&<ButtonCard title='MCQ Choice' icon={<GiChoice size={16}/>}/>}
        {CheckboxField&&<ButtonCard title='Checkbox' icon={<RiListCheck3/>}/>}

        {ImagesField&&<ButtonCard title='Photo' icon={<MdOutlineAddPhotoAlternate/>}/>}
        {DateRangeField&&<ButtonCard title='Date Range' icon={<HiOutlineCalendarDateRange/>}/>}
        {DateTimeField&&<ButtonCard title='DateTime' icon={<MdEvent/>}/>}
        {DateField&&<ButtonCard title='Date' icon={<MdDateRange/>}/>}
        {TimeField&&<ButtonCard title='Time' icon={<MdAccessTime/>}/>}

        {LocationField&&<ButtonCard title='Location' icon={<FaMapLocationDot/>}/>}
        {SignatureField&&<ButtonCard title='Signature' icon={<PiSignatureDuotone/>}/>}
        {ScoreField&&<ButtonCard title='Score' icon={<TfiPulse/>}/>}
      </section>

      
    </div>
  )
}

export default QuestionTemplateComponent




interface btnCardProps{
  title:string;
  icon:ReactNode;
}
function ButtonCard({title,icon}:btnCardProps){
    return(
      <div className={Styles.ButtonCard}>
        <span>{icon}</span>
        <span>{title}</span>
      </div>
    )
}
