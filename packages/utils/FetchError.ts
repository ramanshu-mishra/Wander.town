
export class FetchError extends Error{
    status:number;
    json:any;

    constructor(
        status:number,
        statusText:string,
        json:any
    ){
        super(statusText);
        this.status = status;
        this.json = json
    }

}

