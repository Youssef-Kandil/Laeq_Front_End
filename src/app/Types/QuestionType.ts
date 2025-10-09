interface options{
    label:string;
    value:string;
  }
   interface Field{
    question_id:number;
    type:string;
    options?:options[];
  };
  
export interface QuestionType {question_id:number,question_fields:Field[],question_title:string}