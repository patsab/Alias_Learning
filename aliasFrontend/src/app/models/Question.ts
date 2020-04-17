
//question is a part of a card, which will be returned by the DB
export class Question{
    cardId:string;
    question:string;
    answer:string;
}

//Answer class is used to insert an answer to the db
export class Answer{
    //email of the person who answers the question
    email:string;
    userAnswer:string;
    correctAnswer:string;
    cardId:string;
    question:string;
    
}