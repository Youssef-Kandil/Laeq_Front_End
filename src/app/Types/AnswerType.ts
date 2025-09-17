export interface Answer{
    answerID?:number;
    userID:number;
    questionID:number;
    fieldID:number;
    value:string | Blob | Buffer;
    type:string;
    answered_at?:string|Date; 
};