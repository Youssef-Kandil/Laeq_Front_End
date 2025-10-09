"use client";
import React from 'react'
import Styles from './template.module.css'
import { useParams ,useRouter } from 'next/navigation';
import { QuestionType } from '@/app/Types/checklistTypes';
import { useLocale } from 'next-intl';

// import Question from '@/app/components/QuestionComponent/Question';
import QuestionTemplateComponent from '@/app/components/QuestionTemplateComponent/QuestionTemplateComponent';
import BottonComponent from '@/app/components/global/ButtonComponent/BottonComponent';

import { useGetQuestionsByTemplatesId } from '../../../../../../../Hooks/useTemplateQuestions';

// const TestData = [
//   {
//   id: 1,
//   text: "Dimensions Consistent with Elevations, Selections and Change orders? ",

//   fields: [
//     { id: 1, type: "short_text" },
//     { id: 2, type: "comment"},

//     { id: 3, type: "images" },

//     { id: 4, type: "action" },
//     { id: 5, type: "time" },
//     { id: 6, type: "number" },
//     { id: 7, type: "date_time" },
//     { id: 8, type: "date_range" },
//     { id: 9, type: "date" },
//     { id: 10, type: "score" },
//     { id: 10, type: "location" },
//     { id: 10, type: "signature" },
    
//     {
//       id: 11,
//       type: "single",
//       options: [
//         { id: 11, label:"YES",value:1},
//         { id: 12, label:"NO", value:0},
//         { id: 12, label:"N/A", value:-1},
//       ]
//     },
//     {
//       id: 12,
//       type: "checkbox",
//       options: [
//         { id: 11, label:"Youssef",value:"Youssef"},
//         { id: 12, label:"Madani",value:"Youssef"},
//         { id: 12, label:"Khokh",value:"Youssef"},
//       ]
//     }
//   ]
// },
//   {
//   id: 2,
//   text: "Dimensions Consistent with Elevations, Selections and Change orders? ",

//   fields: [
//     { id: 1, type: "text" },

//     { id: 2, type: "comment" },

//     { id: 3, type: "images" },
    
//     {
//       id: 4,
//       type: "single",
//       options: [
//         { id: 11, label:"Good",value:1},
//         { id: 12, label:"Bad", value:0},
//         { id: 12, label:"N/A", value:-1},
//       ]
//     }
//   ]
// },
//   {
//   id: 3,
//   text: "Dimensions Consistent with Elevations, Selections and Change orders? ",

//   fields: [
//     { id: 1, type: "text" },

//     { id: 2, type: "comment" },

//     { id: 3, type: "images" },
    
//     {
//       id: 4,
//       type: "single",
//       options: [
//         { id: 11, label:"SAFE",value:1},
//         { id: 12, label:"UNSAFE", value:0},
//         { id: 12, label:"N/A", value:-1},
//       ]
//     }
//   ]
// },

// ]

function CheckList() {
        const router = useRouter();
        const current_lang = useLocale();
  
      // Start Sceleton Loading..
      //  Get Checklist ID From Params
      const params = useParams(); 
      const   { templateID ,checklistID } = params;
      let title: string | undefined = undefined;
      let id: string | number | undefined = undefined;

      if (templateID) {
        const raw = Array.isArray(templateID) ? templateID[0] : templateID;
        const lastDashIndex = raw.lastIndexOf("-");
        
        if (lastDashIndex !== -1) {
          const encodedTitle = raw.slice(0, lastDashIndex);
          const rawId = raw.slice(lastDashIndex + 1);
          
          title = decodeURIComponent(encodedTitle);
          id = isNaN(Number(rawId)) ? rawId : Number(rawId);
        }
      }

      const { data, isLoading, error } = useGetQuestionsByTemplatesId(Number(id));
              if (isLoading) return <div>جاري التحميل...</div>;
              if (error) return <div>حدث خطأ: {(error as Error).message}</div>;
              if (!data) return <div>لا توجد بيانات</div>;
      // === Looping On Data === 

      const Questions = data.map((question:QuestionType,index:number)=>{
            return  <QuestionTemplateComponent
                         key={index} 
                         questionNumber={(index+1)}
                          title={question.question_title}
                          fields={question.question_fields}
                        />
              })


  return (
    <div>
      <nav className={Styles.nav}>
        <span>{title}</span>

        <div>
             <BottonComponent 
                title='Use This Template'
                onClick={()=>  router.push(`/${current_lang}/Screens/dashboard/checklist/Quizes/${checklistID}/${title}-${id}/ChooseUserTableScreen`)}/>
        </div>
      </nav>
      {Questions}
    </div>
  )
}

export default CheckList
