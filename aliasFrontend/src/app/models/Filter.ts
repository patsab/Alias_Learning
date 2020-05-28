import { Statistik } from 'src/app/models/Statistik';
//Filter are the saved topics/preferences by the user
//these are returned by the DB
export class Filter{
    title:string;
    tags:string[];
}

//Thema is used for creating User spreferences
//The Title(which is used in the frontend design) is created in the backend
export class Thema{
    email:string;
    filter:string[];
}

//Filter with Statistik is a mix with a filter and it's correlated statistiks
export class FilterWithStatistiks{
    filter:Filter;
    statistikOneDay:Statistik;
    statistikSevenDays:Statistik;
}

export class TagRecommendation{
    tag:string;
    count:number;
}