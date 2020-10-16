//This class is used for the statistics in the overview
export class Statistik{
    cardsCorrect:number;
    cardsOverall:number;
    averageCorrectness:number;
}

export class AnswerStat{
    question:string;
    correctAnswer:string;
    userAnswer:string;
    prediction_bert:number;
    prediction_news:number;
    prediction_user:number[];
    prediction_own?:number;
    prediction_avg:number;
}