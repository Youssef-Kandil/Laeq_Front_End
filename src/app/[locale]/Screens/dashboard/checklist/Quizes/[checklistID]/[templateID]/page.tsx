"use client";
import React from 'react'
import { useParams ,useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

import Question from '@/app/components/QuestionComponent/Question';



const TestData = [
  {
  id: 1,
  text: "Dimensions Consistent with Elevations, Selections and Change orders? ",

  fields: [
    { id: 1, type: "text"},

    { id: 2, type: "comment"},

    { id: 3, type: "images" },

    { id: 4, type: "action" },
    { id: 5, type: "short_text" },
    { id: 6, type: "number" },
    
    {
      id: 4,
      type: "single",
      options: [
        { id: 11, label:"YES",value:1},
        { id: 12, label:"NO", value:0},
        { id: 12, label:"N/A", value:-1},
      ]
    },
    {
      id: 4,
      type: "checkbox",
      options: [
        { id: 11, label:"Youssef"},
        { id: 12, label:"Madani"},
        { id: 12, label:"Khokh"},
      ]
    }
  ]
},
  {
  id: 2,
  text: "Dimensions Consistent with Elevations, Selections and Change orders? ",

  fields: [
    { id: 1, type: "text" },

    { id: 2, type: "comment" },

    { id: 3, type: "images" },
    
    {
      id: 4,
      type: "single",
      options: [
        { id: 11, label:"Good",value:1},
        { id: 12, label:"Bad", value:0},
        { id: 12, label:"N/A", value:-1},
      ]
    }
  ]
},
  {
  id: 3,
  text: "Dimensions Consistent with Elevations, Selections and Change orders? ",

  fields: [
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

function Template() {
        // const router = useRouter();
        // const current_lang = useLocale();
  
      // Start Sceleton Loading..
      //  Get Checklist ID From Params
      const params = useParams(); 
      // const   { checklistID ,templateID}= params
      // === Looping On Data === 
      const Questions = TestData.map((question,index)=>{
            return  <Question
                         key={index} 
                         questionNumber={(index+1)}
                          title={question.text}
                          fields={question.fields}
                        />
      })
  return (
    <div>
      {Questions}
    </div>
  )
}

export default Template
