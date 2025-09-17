
interface OptionType {
    id?:number;
    label: string;
    value:string ;
  }

export interface FieldType{
    id:number;
    type:string;
    question_field_options:OptionType[]
};

export interface QuestionType{
    id:number;
    template_id:number;
    question_title:string;
    question_fields:FieldType[]
};

export interface TemplateType{
    id?:number;
    checklist_id:number;
    template_title:string;
    _count:{questions:number}
    questions?:QuestionType[]
}; 


export interface AnswerType{
    answerID?:number;
    userID:number;
    questionID:number;
    fieldID:number;
    value:string;
    type:string;
    answered_at?:string|Date;
};