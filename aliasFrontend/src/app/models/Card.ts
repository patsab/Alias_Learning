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