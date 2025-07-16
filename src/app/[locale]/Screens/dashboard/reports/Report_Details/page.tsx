"use client";
import React from 'react'
import Styles from './Report_Details.module.css'
import { useParams ,useRouter } from 'next/navigation';


import QuestionReportTemplateComponent from '@/app/components/QuestionReportTemplateComponent/QuestionReportTemplateComponent';

const TestData = [
  {
  id: 1,
  text: "Dimensions Consistent with Elevations, Selections and Change orders? ",

  answers: [
    { id: 1, type: "short_text" , value:"Selections and Change orders" },
    { id: 2, type: "comment" , value:"loream  Selections and Change orders  Selections and Change orders  Selections and Change orders"},

    { id: 3, type: "images" , imags:[] },

    { id: 4, type: "action"  ,  value:"Go Selections and Change orders  Selections and Change orders  Selections and Change orders  Selections and Change ordersod"},
    { id: 5, type: "time"  ,  value:"12:12:12"},
    { id: 6, type: "number"  ,  value:"547"},
    { id: 7, type: "date_time"  ,  value:"22, May 2025 12:12:12"},
    { id: 8, type: "date_range"  ,  value:"22, May 2025 - 25, May 2025"},
    { id: 9, type: "date"  ,  value:"22, May 2025" },
    { id: 10, type: "score" , value:"4"},
    
    {
      id: 11,
      type: "single",
      value:"Good",
    },
    {
      id: 12,
      type: "checkbox",
      options: [
        { id: 11, label:"Youssef",value:"Youssef"},
        { id: 12, label:"Madani",value:"Youssef"},
        { id: 12, label:"Khokh",value:"Youssef"},
      ]
    }
  ]
},
  {
  id: 2,
  text: "Dimensions Consistent with Elevations, Selections and Change orders? ",

  answers: [
    { id: 1, type: "text" },

    { id: 2, type: "comment" },

    { id: 3, type: "images" },
    
    {
      id: 4,
      type: "single",
      value:"Good",
    }
  ]
},
  {
  id: 3,
  text: "Dimensions Consistent with Elevations, Selections and Change orders? ",

  answers: [
    { id: 1, type: "text" },

    { id: 2, type: "comment" },

    { id: 3, type: "images" },
    
    {
      id: 4,
      type: "single",
      options: [
        { id: 11, label:"SAFE",value:1},
        { id: 12, label:"UNSAFE", value:0},
        { id: 12, label:"N/A", value:-1},
      ]
    }
  ]
},

]

function Report_Details() {


      // === Looping On Data === 

      const Questions = TestData.map((question,index)=>{
            return  <QuestionReportTemplateComponent
                         key={index} 
                         questionNumber={(index+1)}
                          title={question.text}
                          answers={question.answers}
                        />
      })

  return (
    <div>
      {Questions}
    </div>
  )
}

export default Report_Details
