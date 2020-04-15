//card is needed to create a card
//other field like creationTime are created in the DB
export class Card{
    //email is the email adress of the creator
    email:string;
    answer:string;
    question:string;
    tags:string[];
    //these fields are optional and used to change an existing card
    cardId?:string;
}

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