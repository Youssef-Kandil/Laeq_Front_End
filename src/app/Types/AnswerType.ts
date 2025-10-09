export interface Answer{
    answerID?:number;
    userID:number;
    questionID:number;
    fieldID:number;
    value:string | Blob | Buffer;
    type:string;
    answered_at?:string|Date; 
};

interface options{
    label:string;
    value:string;
}

interface report_answers{
    type:string;
    value:string | Blob | Buffer;
    options?:options[];
}
interface report_question{
    question_title:string;
    answers:report_answers[]
    
}
export interface report_payload{
    admin_id:number;
    site_id:number;
    company_id?:number;
    userID?:number;
    template_title:string;
    score:string;
    submitted_by:string;
    questions:report_question[],
    answered_at?:string|Date; 
};