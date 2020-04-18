
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

//This returns the Answer which will be evaluated
export class AnswerForEvaluation{
    userAnswer:string;
    correctAnswer:string;
    question:string;
    answerId:string;
}

//This makes the POST if an User evaluates an answer
export class Evaluation{
    answerId:string;
    given:number;
    given_by:string;
}



